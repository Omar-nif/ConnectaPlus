import React from 'react'

// ====== Componente AuthHeader ======
// Header minimal para pantallas de autenticación.
// Muestra solo el logo centrado (imagen o texto fallback).
export default function AuthHeader() {
  return (
    <header className="auth-header">
      <a className="auth-logo" href="/">
        {/* Si tienes un logo, descomenta y usa tu ruta:
        <img src="/logo.svg" alt="Connecta+" /> */}
        <span className="auth-logo-text">Connecta+</span>
      </a>
    </header>
  )
}
