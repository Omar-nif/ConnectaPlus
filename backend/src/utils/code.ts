// code.ts
// ===============================
// Utilidad para generar códigos numéricos (ej. verificación, reset password)
// ===============================

/**
 * Genera un código numérico aleatorio de longitud fija.
 * @param len Número de dígitos (default: 6)
 * @returns String con ceros a la izquierda (ej: "004237")
 */
export function generateCode(len = 6): string {
  // Cálculo: número aleatorio entre 0 y 999999 (10^len - 1)
  const randomNum = Math.floor(Math.random() * 10 ** len)

  // padStart: asegura que siempre tenga la longitud deseada
  return String(randomNum).padStart(len, '0')
}

// ===============================
// Notas
// ===============================
// - Uso típico: para códigos de verificación (OTP) enviados por correo.
// - Por seguridad, estos códigos deben caducar pronto (ej: 5-10 min).
// - No usar para contraseñas o tokens criptográficamente fuertes.
//   (para eso mejor crypto.randomBytes o librerías como uuid).
