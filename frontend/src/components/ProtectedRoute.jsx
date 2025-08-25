// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

// ====== Config ======
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

// ====== Componente: ruta protegida ======
export default function ProtectedRoute({ children }) {
  // ====== Estado ======
  const [status, setStatus] = useState('checking')

  // ====== Efecto: verificar sesión ======
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setStatus('fail')
      return
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) throw new Error('invalid')
        const json = await r.json().catch(() => ({}))
        if (json?.data?.name) localStorage.setItem('user_name', json.data.name)
        setStatus('ok')
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_name')
        setStatus('fail')
      })
  }, [])

  // ====== Render ======
  if (status === 'checking') {
    return <div style={{ padding: 40 }}>Verificando sesión…</div>
  }
  if (status === 'fail') return <Navigate to="/login" replace />
  return <>{children}</>
}
