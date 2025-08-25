// ====== Configuración ======
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

// ====== Helper: POST JSON ======
// Envía un POST con JSON y retorna el payload parseado.
// Lanza Error si la respuesta no es OK.
export async function postJSON(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  // Parseo tolerante (por si no viene JSON)
  let payload = null
  try {
    payload = await res.json()
  } catch {
    /* ignore */
  }

  // Manejo de error básico
  if (!res.ok) {
    const msg =
      payload?.error?.message ||
      payload?.message ||
      `Error HTTP ${res.status}`
    throw new Error(msg)
  }

  // Éxito: { ok: true, data: ... }
  return payload
}
