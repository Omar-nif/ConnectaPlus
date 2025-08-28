// src/services/services.controller.ts
import { Request, Response } from 'express'
import { ok, fail } from '../utils/http'
import { prisma } from '../lib/prisma'
import { verifyAccess } from '../utils/jwt'
import { getAllServices, getCategories, getServicesByCategory, findBySlug } from './services.data'


/**
 * GET /api/services
 */
export function listAll(req: Request, res: Response) {
  return ok(res, {
    services: getAllServices(),
  })
}

/**
 * GET /api/services/categories
 */
export function listByCategory(req: Request, res: Response) {
  const cats = getCategories()
  const data = cats.map(c => ({
    key: c.key,
    title: c.title,
    // Tipado simple; en runtime es seguro
    services: getServicesByCategory(c.key as any),
  }))
  return ok(res, data)
}

/**
 * GET /api/services/:slug
 * Nota: tipamos req.params con genérico para evitar undefined en TS.
 */
export function getBySlug(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params
  if (!slug) return fail(res, 'Falta el parámetro slug', 400, 'MISSING_PARAM')

  const svc = findBySlug(slug)
  if (!svc) return fail(res, 'Servicio no encontrado', 404, 'SERVICE_NOT_FOUND')
  return ok(res, svc)
}
export async function listGroupsByService(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params
  if (!slug) return fail(res, 'Falta el parámetro slug', 400, 'MISSING_PARAM')

  // Usuario opcional (para excluir sus grupos si está logeado)
  let currentUserId: number | null = null
  const header = req.header('Authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (token) {
    try {
      const p = verifyAccess(token)
      currentUserId = Number(p.sub) || null
    } catch {
      // token inválido, se mostrará lista pública
    }
  }

  const where: any = { platformKey: slug, status: 'active' }
  if (currentUserId) where.ownerId = { not: currentUserId }

  const rows = await prisma.group.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      ownerId: true,
      platformKey: true,
      platformName: true,
      planKey: true,
      basePriceMXN: true,      
      slots: true,             
      pricePerMember: true,    
      notes: true,
      createdAt: true,
      owner: { select: { id: true, name: true } },
    },
  })

  const data = rows.map(g => {
    
    const computedUnit = Math.round((g.pricePerMember ?? 0) * 1.2)
    return {
      id: g.id,
      ownerId: g.ownerId,
      ownerName: g.owner?.name ?? '—',
      platformKey: g.platformKey,
      platformName: g.platformName,
      planKey: g.planKey,
      basePriceMXN: g.basePriceMXN,
      slots: g.slots,
      availableSlots: g.slots,
      pricePerMember: computedUnit,
      createdAt: g.createdAt,
      notes: g.notes,
    }
  })

  return ok(res, data)
}