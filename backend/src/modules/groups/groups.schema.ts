// backend/src/modules/groups/groups.schema.ts
import { z } from "zod";

// Crear grupo: solo pedimos lo mínimo desde el frontend
export const createGroupSchema = z.object({
  platformKey: z.string().min(2),  // ← REQUERIDO, mínimo 2 caracteres
  planKey: z.string().min(1).optional().nullable(),  // ← OPCIONAL, puede ser null
  credentials: z.string().min(1), // ← REQUERIDO, no vacío
  notes: z.string().optional().nullable(), // ← OPCIONAL
});

// Update: cualquier campo parcial (se puede extender luego)
export const updateGroupSchema = createGroupSchema.partial();

export type CreateGroupDTO = z.infer<typeof createGroupSchema>;
export type UpdateGroupDTO = z.infer<typeof updateGroupSchema>;
