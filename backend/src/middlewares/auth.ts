// backend/src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccess } from "../utils/jwt";
import jwt from "jsonwebtoken";
/* ---------------------------- Tipo extendido ---------------------------- */
/* Extendemos Request para incluir el usuario autenticado.
export type AuthedRequest = Request & {
  user?: { id: string; email: string };
};*/
export interface AuthedRequest extends Request {
  user?: { id: string; email: string };
}
/* --------------------------- Middleware Auth ---------------------------- */
/**
 * Verifica el token de acceso (JWT) en Authorization: Bearer <token>.
 * - Si es válido → agrega req.user y sigue al siguiente middleware.
 * - Si no hay token o es inválido → responde con 401.
 */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, error: { message: "No token" } });
  }

  try {
    const p = verifyAccess(token);
    req.user = { id: p.sub, email: p.email };
    next();
  } catch {
    return res.status(401).json({ ok: false, error: { message: "Token inválido o expirado" } });
  }
}
