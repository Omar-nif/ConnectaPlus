import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ====== Componentes comunes ======
import AuthHeader from '../components/AuthHeader'
import Footer from '../components/Footer'
import Modal from '../components/Modal'

// ====== Configuración ======
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

// ====== Página ForgotPassword ======
export default function ForgotPassword() {
  // ====== Router ======
  const navigate = useNavigate()

  // ====== Estado: formulario y envío ======
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  // ====== Estado: modal de código ======
  const [codeOpen, setCodeOpen] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  // ====== Handler: enviar código ======
  async function handleSendCode(e) {
    e.preventDefault()
    setCode('')
    setCodeError('')

    if (!/^\S+@\S+\.\S+$/.test(email)) return

    setSending(true)
    try {
      // Respuesta ciega: siempre 200 aunque no exista el correo
      await fetch(`${API_URL}/api/auth/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      setCodeOpen(true)
    } catch {
      // También abrimos modal (no revelamos si existe el correo)
      setCodeOpen(true)
    } finally {
      setSending(false)
    }
  }

  // ====== Handler: verificar código ======
  async function handleVerifyCode() {
    if (!/^\d{6}$/.test(code)) {
      setCodeError('El código debe tener 6 dígitos.')
      return
    }
    try {
      const r = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      })
      if (!r.ok) throw new Error('Código inválido o caducado.')
      setCodeOpen(false)
      // Pasamos email y code a /reset
      navigate('/reset', { state: { email: email.trim().toLowerCase(), code } })
    } catch (e) {
      setCodeError(e.message || 'Código inválido o caducado.')
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
            <h1>Recuperar contraseña</h1>
            <p>Ingresa tu correo para enviarte un código de verificación</p>
          </div>

          {/* ===== Cuerpo (formulario) ===== */}
          <div className="body">
            <form onSubmit={handleSendCode}>
              <div className="mb-3">
                <label className="auth-label" htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  className="form-control auth-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={sending}>
                {sending ? 'Enviando código...' : 'Enviar código'}
              </button>

              <div className="text-center mt-3">
                <a href="/login" className="help-link small">Volver a iniciar sesión</a>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      {/* ===== Modal: Insertar código ===== */}
      <Modal
        open={codeOpen}
        title="Insertar código"
        onClose={() => setCodeOpen(false)}
        actions={
          <>
            <button className="btn btn-outline-secondary" onClick={() => setCodeOpen(false)}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleVerifyCode}>
              Verificar
            </button>
          </>
        }
      >
        <p className="small-muted mb-2">
          Te enviamos un código de 6 dígitos a <strong>{email}</strong>.
          Revísalo e ingrésalo aquí.
        </p>
        <input
          type="text"
          inputMode="numeric"
          pattern="\\d*"
          maxLength={6}
          className="form-control auth-input"
          placeholder="Código de 6 dígitos"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, ''))
            setCodeError('')
          }}
        />
        {codeError && <div className="text-danger small mt-2">{codeError}</div>}
      </Modal>
    </div>
  )
}
