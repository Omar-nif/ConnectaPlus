import React, { useState } from 'react'

// ====== Componentes comunes ======
import AuthHeader from '../components/AuthHeader'
import Footer from '../components/Footer'

// ====== Configuración ======
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

// ====== Página Login ======
export default function Login() {
  // ====== Estados ======
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  // ====== Handlers ======
  const onChange = (e) => setForm((f) => ({ ...f, [e.target.id]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')

    // Validaciones básicas
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr('Correo inválido.')
    if (form.password.length < 8) return setErr('Contraseña inválida.')

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.error?.message || data?.message || `HTTP ${res.status}`
        throw new Error(msg)
      }

      // Guarda token y nombre para saludo inmediato
      localStorage.setItem('access_token', data.data.accessToken)
      if (data.data.user?.name) localStorage.setItem('user_name', data.data.user.name)

      // Redirige al home
      window.location.href = '/home'
    } catch (e) {
      setErr(e.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  // ====== Render ======
  return (
    <div className="site">
      <AuthHeader />

      <main className="auth-wrap">
        <div className="auth-card">
          {/* ===== Encabezado ===== */}
          <div className="head">
            <h1>Iniciar sesión</h1>
            <p>Accede a tu cuenta</p>
          </div>

          {/* ===== Cuerpo (formulario) ===== */}
          <div className="body">
            {err && <div className="alert alert-danger mb-3">{err}</div>}

            <form onSubmit={onSubmit}>
              {/* Correo */}
              <div className="mb-3">
                <label className="auth-label" htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  className="form-control auth-input"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Contraseña */}
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="auth-label" htmlFor="password">Contraseña</label>
                  <button
                    type="button"
                    className="btn btn-link p-0 small"
                    onClick={() => setShow((s) => !s)}
                  >
                    {show ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  className="form-control auth-input"
                  placeholder="Tu contraseña"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Enlace: Olvidé contraseña */}
              <div className="d-flex justify-content-end mb-3">
                <a href="/forgot" className="help-link small">¿Olvidaste tu contraseña?</a>
              </div>

              {/* Botón enviar */}
              <button className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>

          {/* ===== Pie ===== */}
          <div className="foot text-center">
            <span className="small-muted">¿No tienes cuenta?</span>{' '}
            <a href="/register" className="help-link">Regístrate</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
