// ======================================================================
// Auth Routes (sin endpoints de recuperación)
// - Mantiene /register, /login, /me
// ======================================================================

import { Router, Response } from "express";
import { register, login } from "./auth.controller";  // ← sólo registro/login
import { requireAuth, AuthedRequest } from "../../middlewares/auth";
import { prisma } from "../../lib/prisma";
import { ok } from "../../utils/http";

const router = Router();

// ----------------------------------------------------------------------
// Rutas públicas
// ----------------------------------------------------------------------
router.post("/register", register);
router.post("/login",    login);

// (Eliminadas) /forgot, /verify, /reset

// ----------------------------------------------------------------------
// GET /api/auth/me (protegida)
// - Devuelve info básica del usuario autenticado
// ----------------------------------------------------------------------
router.get("/me", requireAuth, async (req: AuthedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.user!.id) },
    select: { id: true, name: true, email: true, createdAt: true }
  });
  return ok(res, user);
});

export default router;
