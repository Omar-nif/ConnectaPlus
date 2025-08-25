// backend/src/modules/auth.routes.ts
import { Router, Response } from "express";
import { register, login, forgot, verifyCode, resetPassword } from "./auth.controller";
import { requireAuth, AuthedRequest } from "../../middlewares/auth";
import { prisma } from "../../lib/prisma";
import { ok } from "../../utils/http";

const router = Router();

/* ----------------------------- Rutas públicas ----------------------------- */
router.post("/register", register);   // Registro
router.post("/login",    login);      // Login

/* ---------------------- Recuperación de contraseña ------------------------ */
router.post("/forgot",   forgot);       // Solicitar código (ciego)
router.post("/verify",   verifyCode);   // Verificar código
router.post("/reset",    resetPassword);// Resetear contraseña

/* ----------------------------- Ruta protegida ----------------------------- */
router.get("/me", requireAuth, async (req: AuthedRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.user!.id) },
    select: { id: true, name: true, email: true, createdAt: true }
  });
  return ok(res, user);
});

export default router;
