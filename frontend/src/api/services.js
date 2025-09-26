// src/api/services.js
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

// Obtener todos los servicios
export async function getServices() {
  const res = await fetch(`${API_URL}/api/services`, { 
    headers: authHeaders() 
  });
  return parse(res);
}

// Obtener servicio por slug
export async function getServiceBySlug(slug) {
  const res = await fetch(`${API_URL}/api/services/${slug}`, { 
    headers: authHeaders() 
  });
  return parse(res);
}

// Obtener servicios por categoría
export async function getServicesByCategory() {
  const res = await fetch(`${API_URL}/api/services/categories`, { 
    headers: authHeaders() 
  });
  return parse(res);
}