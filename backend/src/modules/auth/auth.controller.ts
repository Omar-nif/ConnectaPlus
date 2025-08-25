// backend/src/modules/auth.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { registerSchema, loginSchema } from './auth.schema'
import { hashPassword, verifyPassword } from '../../utils/hash'
import { fail, ok } from '../../utils/http'
import { signAccess, signRefresh } from '../../utils/jwt'
import { sendMail } from '../../lib/mailer' // mailer centralizado
import { generateCode } from '../../utils/code'
import { z } from 'zod'

/* ===== Helpers ===== */
async function sendResetCode(email: string, code: string) {
  const html = `
    <h2>Tu código de recuperación</h2>
    <p>Usa este código para restablecer tu contraseña (caduca en 10 minutos):</p>
    <p style="font-size:24px;font-weight:bold;letter-spacing:4px">${code}</p>
    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
  `
  await sendMail(email, 'Código de recuperación', html)
}

/* ===== Register ===== */
export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    const message = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    return fail(res, message, 422, 'VALIDATION_ERROR')
  }
  const { name, email, password } = parsed.data

  try {
    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, password: passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    })
    return ok(res, user, 201)
  } catch (err: any) {
    if (err?.code === 'P2002') return fail(res, 'El correo ya está registrado.', 409, 'EMAIL_TAKEN')
    console.error(err)
    return fail(res, 'Error al registrar usuario.', 500, 'INTERNAL')
  }
}

/* ===== Login ===== */
export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    return fail(res, msg, 422, 'VALIDATION_ERROR')
  }

  const { email, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return fail(res, 'Credenciales inválidas.', 401, 'BAD_CREDENTIALS')

  const okPwd = await verifyPassword(password, user.password)
  if (!okPwd) return fail(res, 'Credenciales inválidas.', 401, 'BAD_CREDENTIALS')

  const payload = { sub: String(user.id), email: user.email }
  const accessToken = signAccess(payload)
  const refreshToken = signRefresh(payload)

  return ok(res, {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  })
}

/* ===== Forgot (blind) ===== */
export async function forgot(req: Request, res: Response) {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const emailSchema = z.string().email()
  const emailParsed = emailSchema.safeParse(email)
  if (!emailParsed.success) return fail(res, 'Email inválido.', 422, 'VALIDATION_ERROR')

  const user = await prisma.user.findUnique({ where: { email } })
  const blindOk = () => ok(res, { sent: true })
  if (!user) return blindOk()

  const ttlMinutes = Number(process.env.RESET_CODE_TTL_MIN ?? 10)
  const code = generateCode(6)
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

  await prisma.passwordReset.create({
    data: { userId: user.id, code, expiresAt, ip: req.ip ?? null },
  })

  try { await sendResetCode(email, code) } catch (e) { console.error('sendResetCode error:', e) }
  return blindOk()
}

/* ===== Verify code ===== */
export async function verifyCode(req: Request, res: Response) {
  const schema = z.object({
    email: z.string().email(),
    code: z.string().regex(/^\d{6}$/, 'Código inválido'),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    return fail(res, msg, 422, 'VALIDATION_ERROR')
  }

  const { email, code } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return fail(res, 'Código inválido.', 400, 'BAD_CODE')

  const pr = await prisma.passwordReset.findFirst({
    where: { userId: user.id, code, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  })

  if (!pr) return fail(res, 'Código inválido o caducado.', 400, 'BAD_CODE')
  return ok(res, { valid: true })
}

/* ===== Reset password ===== */
export async function resetPassword(req: Request, res: Response) {
  const schema = z.object({
    email: z.string().email(),
    code: z.string().regex(/^\d{6}$/, 'Código inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  })
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    return fail(res, msg, 422, 'VALIDATION_ERROR')
  }

  const { email, code, password } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return fail(res, 'Código inválido.', 400, 'BAD_CODE')

  const pr = await prisma.passwordReset.findFirst({
    where: { userId: user.id, code, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  })
  if (!pr) return fail(res, 'Código inválido o caducado.', 400, 'BAD_CODE')

  const passwordHash = await hashPassword(password)

  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { password: passwordHash } }),
    prisma.passwordReset.update({ where: { id: pr.id }, data: { usedAt: new Date() } }),
  ])

  return ok(res, { changed: true })
}
