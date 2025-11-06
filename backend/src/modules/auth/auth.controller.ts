// backend/src/modules/auth/auth.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma'
import { registerSchema, loginSchema } from './auth.schema'
import { hashPassword, verifyPassword } from '../../utils/hash'
import { fail, ok } from '../../utils/http'
import { signAccess, signRefresh } from '../../utils/jwt'
import { AuthedRequest } from '../../middlewares/auth';

// ======================================================================
// POST /api/auth/register
// - Valida payload con Zod
// - Hash de contraseña y creación de usuario
// - Devuelve datos públicos del usuario (sin password)
// ======================================================================
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
    // P2002 = unique constraint (email duplicado)
    if (err?.code === 'P2002') {
      return fail(res, 'El correo ya está registrado.', 409, 'EMAIL_TAKEN')
    }
    console.error(err)
    return fail(res, 'Error al registrar usuario.', 500, 'INTERNAL')
  }
}

// ======================================================================
// POST /api/auth/login
// - Valida payload con Zod
// - Verifica credenciales con bcrypt
// - Firma tokens JWT (access/refresh)
// - Devuelve user + tokens
// ======================================================================
export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
    return fail(res, msg, 422, 'VALIDATION_ERROR')
  }

  const { email, password } = parsed.data

  // Busca usuario por email
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return fail(res, 'Credenciales inválidas.', 401, 'BAD_CREDENTIALS')

  // Compara hash
  const okPwd = await verifyPassword(password, user.password)
  if (!okPwd) return fail(res, 'Credenciales inválidas.', 401, 'BAD_CREDENTIALS')

  // Firma tokens
  const payload = { sub: String(user.id), email: user.email }
  const accessToken = signAccess(payload)
  const refreshToken = signRefresh(payload)

  // Respuesta
  return ok(res, {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  })
}
  
// ======================================================================
// GET /api/auth/me
// - Devuelve los datos del usuario actualmente autenticado
// ======================================================================
export async function getCurrentUser(req: AuthedRequest, res: Response) {
  try {
    console.log('Obteniendo usuario actual, ID:', req.user!.id);
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.user!.id) }, 
      select: {
        id: true,
        name: true,
        email: true,
        stripeAccountId: true,
        createdAt: true
      }
    });

    if (!user) {
      return fail(res, 'Usuario no encontrado', 404);
    }
    
    console.log('Usuario encontrado:', user.name);
    return ok(res, user);
    
  } catch (error: any) {
    console.error('Error obteniendo usuario actual:', error);
    return fail(res, error.message, 500);
  }
}