// backend/src/modules/groups/groups.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { ok, fail } from "../../utils/http";
import { createGroupSchema, updateGroupSchema } from "./groups.schema";
import { AuthedRequest } from "../../middlewares/auth";

// ======================================================================
// GET /api/groups → Devuelve los grupos del usuario autenticado
// ======================================================================
export async function listMyGroups(req: AuthedRequest, res: Response) {
  const userId = Number(req.user!.id);
  const groups = await prisma.group.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      service: {
        select: {
          name: true,
          description: true,
          category: true
        }
      }
    }
  });
  return ok(res, groups);
}

// ======================================================================
// POST /api/groups → Crear grupo consultando la BASE DE DATOS
// ======================================================================
export async function createGroup(req: AuthedRequest, res: Response) {
  const parsed = createGroupSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return fail(res, msg, 422, "VALIDATION_ERROR");
  }
  
  const { platformKey, planKey, credentials, notes } = parsed.data;

  //  CONSULTAR LA BASE DE DATOS EN LUGAR DE PRESETS
  const service = await prisma.service.findUnique({
    where: { slug: platformKey }
  });
  
  if (!service) {
    return fail(res, "Servicio no encontrado", 400, "SERVICE_NOT_FOUND");
  }

  // Verificar que el servicio tenga la información necesaria
  if (!service.basePriceMXN || !service.slots) {
    return fail(res, "Este servicio no tiene configuración de precios completa", 400, "SERVICE_INCOMPLETE");
  }

  // Calcular precio por miembro
  const pricePerMember = Math.ceil(service.basePriceMXN / service.slots);

  // Determinar el nombre de la plataforma con plan
  let platformName = service.name;
  if (planKey && service.plans) {
    try {
      const plans = service.plans as Record<string, string>;
      if (plans[planKey]) {
        platformName = `${service.name} · ${plans[planKey]}`;
      }
    } catch (error) {
      console.warn("Error parsing plans JSON for service:", platformKey);
    }
  }

  // Crear el grupo con relación al servicio
  const group = await prisma.group.create({
    data: {
      ownerId: Number(req.user!.id),
      platformKey: service.slug,
      platformName,
      planKey: planKey ?? null,
      basePriceMXN: service.basePriceMXN,
      slots: service.slots,
      pricePerMember,
      credentials,
      notes: notes ?? null,
      status: "active",
      serviceId: service.id  // 
    },
    include: {
      service: {
        select: {
          name: true,
          description: true,
          category: true
        }
      }
    }
  });

  return ok(res, group, 201);
}

// ======================================================================
// GET /api/groups/:id → Detalle de grupo (solo dueño)
// ======================================================================
export async function getGroup(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const userId = Number(req.user!.id);

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      service: {
        select: {
          name: true,
          description: true,
          category: true
        }
      },
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  
  if (!group || group.ownerId !== userId) {
    return fail(res, "No encontrado.", 404, "NOT_FOUND");
  }
  return ok(res, group);
}

// ======================================================================
// PATCH /api/groups/:id → Actualizar grupo (solo dueño)
// ======================================================================
// VERSIÓN CORREGIDA del método updateGroup
export async function updateGroup(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const userId = Number(req.user!.id);

  const parsed = updateGroupSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    return fail(res, msg, 422, "VALIDATION_ERROR");
  }

  const existing = await prisma.group.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) {
    return fail(res, "No encontrado.", 404, "NOT_FOUND");
  }

  // Preparar datos de actualización
  let updateData: any = { ...parsed.data };

  // Si se actualiza platformKey, obtener nuevo servicio
  if (parsed.data.platformKey && parsed.data.platformKey !== existing.platformKey) {
    const newService = await prisma.service.findUnique({
      where: { slug: parsed.data.platformKey }
    });
    
    if (!newService) {
      return fail(res, "El nuevo servicio no existe", 400, "SERVICE_NOT_FOUND");
    }

    // Actualizar datos derivados del NUEVO servicio
    updateData.platformKey = newService.slug;
    
    if (newService.basePriceMXN && newService.slots) {
      updateData.basePriceMXN = newService.basePriceMXN;
      updateData.slots = newService.slots;
      updateData.pricePerMember = Math.ceil(newService.basePriceMXN / newService.slots);
      updateData.serviceId = newService.id; // ← Actualizar relación también
    }
  }

  // 🔹 Quitar undefined antes de pasar a Prisma
  const cleanData = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined)
  );

  const updated = await prisma.group.update({
    where: { id },
    data: cleanData,
    include: {
      service: {
        select: {
          name: true,
          description: true,
          category: true
        }
      }
    }
  });

  return ok(res, updated);
}
// ======================================================================
// DELETE /api/groups/:id → Eliminar grupo (solo dueño)
// ======================================================================
export async function deleteGroup(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const userId = Number(req.user!.id);

  const existing = await prisma.group.findUnique({ where: { id } });
  if (!existing || existing.ownerId !== userId) {
    return fail(res, "No encontrado.", 404, "NOT_FOUND");
  }

  await prisma.group.delete({ where: { id } });
  return ok(res, { deleted: true });
}

// ======================================================================
// GET /api/groups/public/:id → Grupo público (sin autenticación)
// ======================================================================
export async function getPublicGroup(req: Request, res: Response) {
  const id = Number(req.params.id);

  const group = await prisma.group.findUnique({
    where: { id },
    select: {
      id: true,
      platformName: true,
      basePriceMXN: true,
      slots: true,
      pricePerMember: true,
      createdAt: true,
      status: true,
      service: {
        select: {
          name: true,
          description: true,
          category: true
        }
      }
    },
  });

  if (!group) {
    return fail(res, "No encontrado.", 404, "NOT_FOUND");
  }

  return ok(res, group);
}