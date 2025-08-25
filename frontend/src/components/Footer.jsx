import React from 'react'

// ====== Footer ======
// Muestra derechos reservados y enlaces de ayuda / legales.
export default function Footer() {
  return (
    <footer className="py-4 bg-white border-top">
      <div className="container">
        <div className="row align-items-center">
          {/* Texto de copyright */}
          <div className="col-6 small text-secondary">
            © {new Date().getFullYear()} Connecta+. Todos los derechos reservados.
          </div>
          {/* Enlaces */}
          <div className="col-6 small text-end">
            <a className="text-decoration-none me-3" href="#faq">FAQ</a>
            <a className="text-decoration-none me-3" href="#seguridad">Seguridad</a>
            <a className="text-decoration-none me-3" href="/terms">Términos</a>
            <a className="text-decoration-none" href="/privacy">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
