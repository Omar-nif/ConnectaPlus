// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react'

export default function Navbar() {
  // Estado de sesión
  const [authed, setAuthed] = useState(Boolean(localStorage.getItem('access_token')))

  // Listeners de cambios de sesión
  useEffect(() => {
    const onStorage = () => setAuthed(Boolean(localStorage.getItem('access_token')))
    const onAuthChange = () => onStorage()
    window.addEventListener('storage', onStorage)
    window.addEventListener('auth:change', onAuthChange)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('auth:change', onAuthChange)
    }
  }, [])

  // Logout
  function handleLogout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_name')
    localStorage.removeItem('user_id')
    window.dispatchEvent(new Event('auth:change'))
    window.location.href = '/' // vuelve al landing
  }

  // Destino del logo: si está logeado → /home, si no → /
  const logoHref = authed ? '/home' : '/'

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container" style={{ maxWidth: 1160 }}>
        {/* Logo (redirige según sesión) */}
        <a className="navbar-brand fw-bold" href={logoHref}>
          Connecta+
        </a>

        {/* Toggle responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            {/* Vista si está logeado */}
            {authed ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="#juegos">Juegos P2P</a>
                </li>
                <li className="nav-item ms-lg-3">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              // Vista pública
              <>
                <li className="nav-item"><a className="nav-link" href="#como">Cómo funciona</a></li>
                <li className="nav-item"><a className="nav-link" href="#plataformas">Plataformas</a></li>
                <li className="nav-item"><a className="nav-link" href="#juegos">Juegos P2P</a></li>
                <li className="nav-item"><a className="nav-link" href="#precios">Precios</a></li>
                <li className="nav-item"><a className="nav-link" href="#seguridad">Seguridad</a></li>
                <li className="nav-item"><a className="nav-link" href="#faq">FAQ</a></li>
                <li className="nav-item ms-lg-3">
                  <a className="btn btn-outline-primary" href="/login">Iniciar sesión</a>
                </li>
                <li className="nav-item ms-lg-2">
                  <a className="btn btn-primary" href="/register">Registrarme</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
