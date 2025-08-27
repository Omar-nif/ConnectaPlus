// src/api/groups.js
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function authHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parse(res) {
  let json = null;
  try { json = await res.json(); } catch {}
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json?.data ?? json;
}

// Lista mis grupos
export async function getMyGroups() {
  const res = await fetch(`${API_URL}/api/groups`, { headers: authHeaders() });
  return parse(res);
}

// Detalle
export async function getGroup(id) {
  const res = await fetch(`${API_URL}/api/groups/${id}`, { headers: authHeaders() });
  return parse(res);
}

// Crear (server deriva plan/precio/cupos)
export async function createGroup(payload) {
  // payload = { platformKey, planKey?, credentials, notes? }
  const res = await fetch(`${API_URL}/api/groups`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return parse(res);
}

// Actualizar
export async function updateGroup(id, data) {
  const res = await fetch(`${API_URL}/api/groups/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return parse(res);
}

// Eliminar
export async function deleteGroup(id) {
  const res = await fetch(`${API_URL}/api/groups/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return parse(res);
}
