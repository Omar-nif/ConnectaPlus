// backend/src/modules/auth.schema.ts
import { z } from "zod";

/* ------------------------------- Schemas ------------------------------- */
export const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

/* ------------------------------- Tipos ------------------------------- */
export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO    = z.infer<typeof loginSchema>;
