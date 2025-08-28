// backend/src/modules/groups/groups.controller.ts
import { Response } from "express";
import { prisma } from "../../lib/prisma";
import { ok, fail } from "../../utils/http";
import { createGroupSchema, updateGroupSchema } from "./groups.schema";
import { AuthedRequest } from "../../middlewares/auth";

// ======================================================================
// Presets de plataformas con planes y precios
// ======================================================================
const PRESETS: Record<
  string,
  {
    name: string;
    basePriceMXN: number;
    slots: number;
    plans?: Record<string, string>;
  }
> = {
  spotify: {
    name: "Spotify Premium",
    basePriceMXN: 179,
    slots: 6,
    plans: { duo: "Duo", family: "Familiar" },
  },
  disney: { name: "Disney+", basePriceMXN: 179, slots: 4 },
  youtube: {
    name: "YouTube Premium",
    basePriceMXN: 139,
    slots: 5,
    plans: { individual: "Individual", family: "Familiar" },
  },
  prime: { name: "Prime Video", basePriceMXN: 99, slots: 4 },
  max: {
    name: "Max (HBO)",
    basePriceMXN: 149,
    slots: 5,
    plans: { estandar: "Estándar", premium: "Premium" },
  },
  apple_tv: { name: "Apple TV+", basePriceMXN: 69, slots: 4 },
  paramount: { name: "Paramount+", basePriceMXN: 79, slots: 4 },
  game_pass: {
    name: "Xbox Game Pass",
    basePriceMXN: 229,
    slots: 5,
    plans: { core: "Core", ultimate: "Ultimate" },
  },
};

// ======================================================================
// GET /api/groups → Devuelve los grupos del usuario autenticado
// ======================================================================
export async function listMyGroups(req: AuthedRequest, res: Response) {
  const userId = Number(req.user!.id);
  const groups = await prisma.group.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, groups);
}

// ======================================================================
// POST /api/groups → Crear grupo a partir de presets
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

  const preset = PRESETS[platformKey];
  if (!preset) return fail(res, "Plataforma no soportada", 400);

  const platformName =
    planKey && preset.plans?.[planKey]
      ? `${preset.name} · ${preset.plans[planKey]}`
      : preset.name;

  const pricePerMember = Math.ceil(preset.basePriceMXN / preset.slots);

  const group = await prisma.group.create({
    data: {
      ownerId: Number(req.user!.id),
      platformKey,
      platformName,
      planKey: planKey ?? null,
      basePriceMXN: preset.basePriceMXN,
      slots: preset.slots,
      pricePerMember,
      credentials,
      notes: notes ?? null,
      status: "active",
    },
  });

  return ok(res, group, 201);
}

// ======================================================================
// GET /api/groups/:id → Detalle de grupo (solo dueño)
// ======================================================================
export async function getGroup(req: AuthedRequest, res: Response) {
  const id = Number(req.params.id);
  const userId = Number(req.user!.id);

  const group = await prisma.group.findUnique({ where: { id } });
  if (!group || group.ownerId !== userId) {
    return fail(res, "No encontrado.", 404, "NOT_FOUND");
  }
  return ok(res, group);
}

// ======================================================================
// PATCH /api/groups/:id → Actualizar grupo (solo dueño)
// ======================================================================
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

  // 🔹 Quitar undefined antes de pasar a Prisma
  const cleanData = Object.fromEntries(
    Object.entries(parsed.data).filter(([_, v]) => v !== undefined)
  );

  const updated = await prisma.group.update({
    where: { id },
    data: cleanData,
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
