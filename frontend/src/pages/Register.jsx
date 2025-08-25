import React, { useState } from 'react'

// ====== Componentes comunes ======
import AuthHeader from '../components/AuthHeader'
import Footer from '../components/Footer'

// ====== Configuración ======
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

// ====== Página Register ======
export default function Register() {
  // ====== Estados ======
  const [showPass, setShowPass] = useState(false)
  const [showPass2, setShowPass2] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    accept: false,
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  // ====== Handlers ======
  const onChange = (e) => {
    const { id, type, checked, value } = e.target
    setForm((f) => ({ ...f, [id]: type === 'checkbox' ? checked : value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    setOk('')

    // Validaciones básicas (front)
    if (!form.name.trim()) return setErr('Ingresa tu nombre.')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr('Correo inválido.')
    if (form.password.length < 8) return setErr('La contraseña debe tener al menos 8 caracteres.')
    if (form.password !== form.password2) return setErr('Las contraseñas no coinciden.')
    if (!form.accept) return setErr('Debes aceptar Términos y Privacidad.')

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = data?.error?.message || data?.message || `Error HTTP ${res.status}`
        throw new Error(msg)
      }

      setOk(`¡Cuenta creada! Bienvenido/a, ${data?.data?.name || 'usuario'}.`)
      // Redirigir a login
      setTimeout(() => (window.location.href = '/login'), 1000)
    } catch (e) {
      setErr(e.message || 'No se pudo crear la cuenta.')
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
            <h1>Crear cuenta</h1>
            <p>Únete a Connecta+ en minutos</p>
          </div>

          {/* ===== Cuerpo (formulario) ===== */}
          <div className="body">
            {err && <div className="alert alert-danger mb-3">{err}</div>}
            {ok && <div className="alert alert-success mb-3">{ok}</div>}

            <form onSubmit={onSubmit}>
              {/* Nombre */}
              <div className="mb-3">
                <label className="auth-label" htmlFor="name">Nombre</label>
                <input
                  id="name"
                  type="text"
                  className="form-control auth-input"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="auth-label" htmlFor="email">Correo electrónico</label>
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
                  <button type="button" className="btn btn-link p-0 small" onClick={() => setShowPass((v) => !v)}>
                    {showPass ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-control auth-input"
                  placeholder="Mínimo 8 caracteres"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Confirmación */}
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="auth-label" htmlFor="password2">Confirmar contraseña</label>
                  <button type="button" className="btn btn-link p-0 small" onClick={() => setShowPass2((v) => !v)}>
                    {showPass2 ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  id="password2"
                  type={showPass2 ? 'text' : 'password'}
                  className="form-control auth-input"
                  placeholder="Repite tu contraseña"
                  value={form.password2}
                  onChange={onChange}
                  required
                />
              </div>

              {/* Términos */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="accept"
                  checked={form.accept}
                  onChange={onChange}
                  required
                />
                <label className="form-check-label small" htmlFor="accept">
                  Acepto los <a href="/terms" className="help-link">Términos</a> y la{' '}
                  <a href="/privacy" className="help-link">Privacidad</a>.
                </label>
              </div>

              {/* Botón enviar */}
              <button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
                {loading ? 'Creando...' : 'Crear cuenta'}
              </button>

              {/* División / OAuth (placeholder) */}
              <div className="auth-divider">o</div>

              <button type="button" className="btn-google" disabled>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6-2.74-6-6.1s2.69-6.1 6-6.1c1.89 0 3.16.8 3.88 1.49l2.64-2.55C16.7 3.4 14.53 2.5 12 2.5 6.98 2.5 2.9 6.58 2.9 11.6S6.98 20.7 12 20.7c6.93 0 9.2-4.84 9.2-7.33 0-.49-.05-.86-.11-1.23H12z"/>
                </svg>
                Registrarme con Google
              </button>
            </form>
          </div>

          {/* ===== Pie ===== */}
          <div className="foot text-center">
            <span className="small-muted">¿Ya tienes cuenta?</span>{' '}
            <a href="/login" className="help-link">Inicia sesión</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}