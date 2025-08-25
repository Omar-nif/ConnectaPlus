// src/utils/jwt.ts
// =====================================================
// Helpers para firmar y verificar JWT (access y refresh)
// =====================================================

import jwt, {
  JwtPayload as JwtPayloadBase,
  SignOptions,
  Secret,
} from "jsonwebtoken";

// ======================
// Configuración / Secrets
// ======================
// Usamos variables de entorno, con fallback de desarrollo
const ACCESS_SECRET: Secret  = process.env.JWT_ACCESS_SECRET  ?? "dev_access_secret";
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET ?? "dev_refresh_secret";

// ======================
// Expiración de tokens
// ======================
// Se castea para evitar undefined con `exactOptionalPropertyTypes`
type Expires = NonNullable<SignOptions["expiresIn"]>;
const ACCESS_EXPIRES: Expires  = (process.env.JWT_ACCESS_EXPIRES  ?? "15m") as Expires;
const REFRESH_EXPIRES: Expires = (process.env.JWT_REFRESH_EXPIRES ?? "7d")  as Expires;

// ======================
// Payload estándar de JWT
// ======================
// Extendemos JwtPayload con nuestros propios campos
export type JwtPayload = JwtPayloadBase & {
  sub: string;   // ID del usuario
  email: string; // correo del usuario
};

// ======================
// Firmar tokens
// ======================
export function signAccess(payload: JwtPayload): string {
  const opts: SignOptions = { expiresIn: ACCESS_EXPIRES };
  return jwt.sign(payload, ACCESS_SECRET, opts);
}

export function signRefresh(payload: JwtPayload): string {
  const opts: SignOptions = { expiresIn: REFRESH_EXPIRES };
  return jwt.sign(payload, REFRESH_SECRET, opts);
}

// ======================
// Verificar tokens
// ======================
// Lanza error si es inválido/expirado
export function verifyAccess(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}

// (opcional) verifyRefresh → útil si manejas rotación de refresh tokens
export function verifyRefresh(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}
