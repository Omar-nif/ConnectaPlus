import bcrypt from "bcrypt";

const ROUNDS = 10; // Nivel de seguridad (10 es estándar)

export const hashPassword = (plain: string) => {
  return bcrypt.hash(plain, ROUNDS); // ← Encripta contraseña
};

export const verifyPassword = (plain: string, hash: string) => {
  return bcrypt.compare(plain, hash); // ← Verifica contraseña
};