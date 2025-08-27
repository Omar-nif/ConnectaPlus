// backend/src/modules/groups/groups.schema.ts
import { z } from "zod";

// Crear grupo: solo pedimos lo mínimo desde el frontend
export const createGroupSchema = z.object({
  platformKey: z.string().min(2),
  planKey: z.string().min(1).optional().nullable(),
  credentials: z.string().min(1),
  notes: z.string().optional().nullable(),
});

// Update: cualquier campo parcial (se puede extender luego)
export const updateGroupSchema = createGroupSchema.partial();

export type CreateGroupDTO = z.infer<typeof createGroupSchema>;
export type UpdateGroupDTO = z.infer<typeof updateGroupSchema>;
