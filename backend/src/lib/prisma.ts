// ======================================================================
// Prisma Client
// ======================================================================
// Se instancia el cliente de Prisma para acceder a la BD.
// Configuramos logs diferentes según el entorno.
// ======================================================================

import { PrismaClient } from "@prisma/client";

// Cliente Prisma global exportado
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" 
    ? ["query", "error", "warn"] // en dev vemos queries + errores + warnings
    : ["error"],                 // en prod solo errores
});
