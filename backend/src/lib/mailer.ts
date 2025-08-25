// ======================================================================
// Mailer centralizado con Nodemailer
// ======================================================================
// - Usa credenciales desde ENV (Mailtrap recomendado para dev).
// - Si no existen, genera una cuenta temporal en Ethereal (solo dev).
// ======================================================================

import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

/**
 * Obtiene o crea un transporter de nodemailer.
 * - Usa ENV (MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS).
 * - Si no existen, crea cuenta de prueba en Ethereal.
 */
async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  const host = process.env.MAIL_HOST;
  const port = process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : undefined;
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (host && port && user && pass) {
    // Configuración real
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // secure solo si es puerto 465
      auth: { user, pass },
    });
    return transporter;
  }

  // Fallback: cuenta temporal en Ethereal
  const test = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: test.user, pass: test.pass },
  });
  console.log("📬 Ethereal enabled. Login:", test.user, "Pass:", test.pass);
  return transporter;
}

/**
 * Envía un correo HTML.
 * @param to      destinatario
 * @param subject asunto
 * @param html    cuerpo en HTML
 */
export async function sendMail(to: string, subject: string, html: string) {
  const t = await getTransporter();
  const from = process.env.MAIL_FROM || "Connecta+ <no-reply@example.com>";

  const info = await t.sendMail({ from, to, subject, html });

  // Si estamos en Ethereal, muestra URL de vista previa en consola
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log("🔗 Preview URL:", preview);
}
