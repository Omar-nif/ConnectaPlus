// src/utils/mail.ts
// =====================================================
// Configuración y helper para enviar correos con nodemailer
// En este caso se usa para enviar el código de recuperación
// =====================================================

import nodemailer from "nodemailer";

// ======================
// Transporter SMTP
// ======================
// Se crea una instancia de transporte con las credenciales SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false, // true solo si usas 465 (SSL directo)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ======================
// Enviar código de reset
// ======================
export async function sendResetCode(to: string, code: string) {
  const app = process.env.APP_NAME ?? "Connecta+";
  const ttl = process.env.RESET_CODE_TTL_MIN ?? "10";

  // Plantilla HTML simple del correo
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial">
      <h2>${app} — Recuperación de contraseña</h2>
      <p>Usa este código para restablecer tu contraseña:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</p>
      <p>El código caduca en ${ttl} minutos. Si no solicitaste este correo, ignóralo.</p>
    </div>
  `;

  // Envío del email
  await transporter.sendMail({
    from: `"${app}" <${process.env.SMTP_USER}>`,
    to,
    subject: `${app}: Tu código de recuperación`,
    html,
  });
}
