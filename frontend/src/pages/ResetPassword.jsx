import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// ====== Componentes comunes ======
import AuthHeader from '../components/AuthHeader'
import Footer from '../components/Footer'
import Modal from '../components/Modal'

// ====== Configuración ======
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

// ====== Página ResetPassword ======
export default function ResetPassword() {
  // ====== Router ======
  const navigate = useNavigate()
  const location = useLocation()

  // Desde Forgot → navigate('/reset', { state: { email, code } })
  const email = location?.state?.email
  const code = location?.state?.code

  // ====== Estado ======
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [err, setErr] = useState('')
  const [okOpen, setOkOpen] = useState(false)

  // ====== Guard: si no hay email/code, regresar ======
  useEffect(() => {
    if (!email || !code) navigate('/forgot', { replace: true })
  }, [email, code, navigate])

  // ====== Handler: enviar nueva contraseña ======
  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')

    if (p1.length < 8) {
      setErr('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (p1 !== p2) {
      setErr('Las contraseñas no coinciden.')
      return
    }

    try {
      const r = await fetch(`${API_URL}/api/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password: p1 }),
      })
      if (!r.ok) throw new Error('No se pudo actualizar la contraseña (código inválido o caducado).')
      setOkOpen(true)
      setTimeout(() => {
        setOkOpen(false)
        navigate('/login')
      }, 1500)
    } catch (e) {
      setErr(e.message || 'Error al actualizar la contraseña.')
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
            <h1>Nueva contraseña</h1>
            <p>{email ? <>Para <strong>{email}</strong></> : 'Ingresa tu nueva contraseña'}</p>
          </div>

          {/* ===== Cuerpo (formulario) ===== */}
          <div className="body">
            <form onSubmit={handleSubmit}>
              {/* Contraseña */}
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label className="auth-label" htmlFor="p1">Contraseña</label>
                  <button type="button" className="btn btn-link p-0 small" onClick={() => setShow1((v) => !v)}>
                    {show1 ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  id="p1"
                  type={show1 ? 'text' : 'password'}
                  className="form-control auth-input"
                  placeholder="Mínimo 8 caracteres"
                  value={p1}
                  onChange={(e) => setP1(e.target.value)}
                  required
                />
              </div>

              {/* Confirmación */}
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <label className="auth-label" htmlFor="p2">Confirmar contraseña</label>
                  <button type="button" className="btn btn-link p-0 small" onClick={() => setShow2((v) => !v)}>
                    {show2 ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  id="p2"
                  type={show2 ? 'text' : 'password'}
                  className="form-control auth-input"
                  placeholder="Repite tu contraseña"
                  value={p2}
                  onChange={(e) => setP2(e.target.value)}
                  required
                />
              </div>

              {/* Error */}
              {err && <div className="text-danger small mb-2">{err}</div>}

              {/* Enviar */}
              <button type="submit" className="btn btn-primary w-100">
                Guardar nueva contraseña
              </button>

              {/* Ayuda */}
              <div className="text-center mt-3">
                <a href="/login" className="help-link small">Volver a iniciar sesión</a>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      {/* ===== Modal éxito ===== */}
      <Modal
        open={okOpen}
        title="¡Contraseña cambiada!"
        onClose={() => setOkOpen(false)}
        actions={
          <button className="btn btn-primary" onClick={() => { setOkOpen(false); navigate('/login') }}>
            Ir a iniciar sesión
          </button>
        }
      >
        <p className="m-0">Tu contraseña se actualizó correctamente. Redirigiendo…</p>
      </Modal>
    </div>
  )
}
