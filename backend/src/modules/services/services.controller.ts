// src/services/services.controller.ts
import { Request, Response } from 'express'
import { ok, fail } from '../../utils/http'
import { prisma } from '../../lib/prisma'
import { verifyAccess } from '../../utils/jwt'

//Lista TODOS los servicios desde BD
export async function listAll(req: Request, res: Response) {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    })
    return ok(res, { services })
  } catch (error) {
    console.error('Error obteniendo servicios:', error)
    return fail(res, 'Error obteniendo servicios', 500)
  }
}
//-------------------------------------------------------
// Servicios agrupados por categoría
export async function listByCategory(req: Request, res: Response) {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc'}
    })

    // Agrupar categorias
    const categories = {
      'peliculas-series': { 
        key: 'peliculas-series', 
        title: 'Películas y series', 
        services: services.filter(s => s.category === 'peliculas-series')
      },
      'programas': { 
        key: 'programas', 
        title: 'Programas', 
        services: services.filter(s => s.category === 'programas')
      },
      'musica': { 
        key: 'musica', 
        title: 'Música', 
        services: services.filter(s => s.category === 'musica')
      }
    }
    
    return ok(res, Object.values(categories))
  } catch (error) {
    console.error('Error obteniendo categorías:', error)
    return fail(res, 'Error obteniendo categorías', 500)
  }
}
//------------------------------------------------------------
// Obtener servicio por SLUG desde la base de datos
export async function getBySlug(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params // ← Extrae "netflix" por ejemplo
  if (!slug) return fail(res, 'Falta el parámetro slug', 400, 'MISSING_PARAM')
  
  try {
    const service = await prisma.service.findUnique({
      where: { slug }
    })

    if (!service) return fail(res, 'Servicio no encontrado', 404, 'SERVICE_NOT_FOUND')
      return ok(res, service)
  } catch (error) {
    console.error('Error buscando servicio:', error)
    return fail(res, 'Error buscando servicio', 500)
  }
}
//-------------------------------------------------------

export async function listGroupsByService(req: Request<{ slug: string }>, res: Response) {
  const { slug } = req.params
  if (!slug) return fail(res, 'Falta el parámetro slug', 400, 'MISSING_PARAM')

  // Esta parte verifica si el usuario está loggeado (para excluir sus grupos si está logeado)
  let currentUserId: number | null = null
  const header = req.header('Authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (token) {
    try {
      const p = verifyAccess(token) // ← Decodifica el token JWT
      currentUserId = Number(p.sub) || null // ← Extrae el ID del usuario (p.sub = user id)
    } catch {
      // token inválido, se mostrará lista pública
    }
  }

  // Esta parte EXCLUYE tus propios grupos
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