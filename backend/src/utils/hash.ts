// src/utils/hash.ts
// ==================================
// Utilidades para hashing de contraseñas usando bcrypt
// ==================================

import bcrypt from "bcrypt";

// Número de rondas para el salt (coste de cómputo).
// 10 es un valor estándar: seguro y relativamente rápido.
// En producción podrías usar 12–14 según la capacidad del servidor.
const ROUNDS = 10;

/**
 * Hashea una contraseña en texto plano.
 * @param plain Contraseña en texto plano
 * @returns Promise<string> Hash resultante (incluye salt)
 */
export const hashPassword = (plain: string) => {
  return bcrypt.hash(plain, ROUNDS);
};

/**
 * Compara una contraseña ingresada contra el hash guardado.
 * @param plain Contraseña en texto plano
 * @param hash Hash previamente almacenado en la base de datos
 * @returns Promise<boolean> true si coincide, false si no
 */
export const verifyPassword = (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash);
};

// ==================================
// Notas de seguridad
// ==================================
// - Nunca guardes contraseñas en texto plano.
// - bcrypt ya maneja internamente el salt, no necesitas generarlo aparte.
// - Ajusta ROUNDS según el equilibrio seguridad/rendimiento de tu entorno.
// ==================================
