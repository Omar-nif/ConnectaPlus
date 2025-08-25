// src/utils/http.ts
// =====================================================
// Helpers para enviar respuestas consistentes en la API
// =====================================================

import { Response } from "express";

/**
 * Respuesta exitosa.
 * @param res Express Response
 * @param data Payload (puede ser objeto, array, string, etc.)
 * @param status HTTP status code (default 200)
 */
export function ok(res: Response, data: unknown, status = 200) {
  return res.status(status).json({
    ok: true,
    data,
  });
}

/**
 * Respuesta de error.
 * @param res Express Response
 * @param message Mensaje de error para el cliente
 * @param status Código HTTP (default 400)
 * @param code Código interno opcional (ej. "INVALID_CREDENTIALS")
 */
export function fail(
  res: Response,
  message: string,
  status = 400,
  code?: string
) {
  return res.status(status).json({
    ok: false,
    error: { message, code },
  });
}
