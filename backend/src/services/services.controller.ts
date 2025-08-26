// src/services/services.controller.ts
import { Request, Response } from 'express'
import { ok, fail } from '../utils/http'
import { getAllServices, getCategories, getServicesByCategory, findBySlug } from './services.data'

/**
 * GET /api/services
 */
export function listAll(req: Request, res: Response) {
  return ok(res, {
    categories: getCategories(),
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
