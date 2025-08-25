import React from 'react'
import { Link } from 'react-router-dom'

// ====== Componentes comunes ======
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ====== Página Landing ======
// Incluye:
// - Navbar
// - Hero
// - Cómo funciona
// - Plataformas
// - Juegos P2P
// - Precios
// - Seguridad
// - FAQ
// - Footer
export default function Landing() {
  return (
    <div className="site"> {/* Wrapper general */}
      <Navbar />

      <main className="bg-light">
        {/* ===== HERO ===== */}
        <section className="py-5 bg-white border-bottom hero">
          <div className="container">
            <div className="row align-items-center g-5">
              {/* Texto principal */}
              <div className="col-8">
                <span className="badge text-bg-primary">Nuevo</span>
                <h1 className="display-5 fw-bold mt-3">
                  Comparte suscripciones y juegos, paga menos y juega más.
                </h1>
                <p className="lead text-secondary mt-3">
                  Connecta+ organiza grupos, pagos protegidos y acceso seguro. Para juegos,
                  compartes solo la ventana del título con control filtrado.
                </p>
                <div className="d-flex gap-2 mt-3">
                  <Link to="/register" className="btn btn-primary btn-lg">Registrarme</Link>
                  <Link to="/login" className="btn btn-outline-primary btn-lg">Iniciar sesión</Link>
                </div>
                <div className="d-flex gap-4 mt-4 text-secondary small">
                  <div>Pagos con protección</div>
                  <div>Reseñas verificadas</div>
                  <div>Reembolsos</div>
                </div>
              </div>
              {/* Imagen / Mockup */}
              <div className="col-4 d-flex">
                <div className="ratio ratio-16x9 border rounded-3 bg-light d-flex align-items-center justify-content-center hero-mock ms-auto">
                  <div className="text-center p-3">
                    <div className="fw-bold">Mockup</div>
                    <div className="text-secondary">Coloca aquí una imagen o demo más adelante</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CÓMO FUNCIONA ===== */}
        <section id="como" className="py-5">
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="fw-bold">¿Cómo funciona?</h2>
              <p className="text-secondary m-0">Dos caminos: Dueño (Compartir) o Usuario (Unirme).</p>
            </div>
            <div className="row g-4">
              {/* Dueño */}
              <div className="col-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold">Soy Dueño (Compartir)</h5>
                    <ol className="mt-3 text-secondary">
                      <li>Elige la plataforma y crea tu grupo.</li>
                      <li>Define cupos y precio; método de cobro verificado.</li>
                      <li>Recibe pagos cuando el acceso esté confirmado.</li>
                    </ol>
                    <Link to="/register" className="btn btn-outline-primary mt-3">Compartir mi cuenta</Link>
                  </div>
                </div>
              </div>
              {/* Usuario */}
              <div className="col-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold">Soy Usuario (Unirme)</h5>
                    <ol className="mt-3 text-secondary">
                      <li>Explora grupos por plataforma y reputación.</li>
                      <li>Paga tu parte con protección (escrow).</li>
                      <li>Recibe instrucciones de acceso en minutos.</li>
                    </ol>
                    <Link to="/register" className="btn btn-primary mt-3">Unirme a un grupo</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PLATAFORMAS ===== */}
        <section id="plataformas" className="py-5 bg-white border-top border-bottom">
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Plataformas disponibles</h2>
              <p className="text-secondary m-0">Streaming, música, software y más.</p>
            </div>
            <div className="row g-4">
              {/* Lista de plataformas */}
              {[
                { name: 'Netflix', desc: 'Series y películas' },
                { name: 'Spotify', desc: 'Música sin anuncios' },
                { name: 'Disney+', desc: 'Películas y TV' },
                { name: 'YouTube Premium', desc: 'Video sin anuncios' },
                { name: 'Xbox Game Pass', desc: 'Biblioteca de juegos' },
                { name: 'Adobe', desc: 'Creatividad y diseño' },
              ].map((p, i) => (
                <div className="col-4" key={i}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="fw-bold m-0">{p.name}</h6>
                        <span className="badge text-bg-light border">Demo</span>
                      </div>
                      <p className="text-secondary mt-2 mb-3">{p.desc}</p>
                      <div className="d-flex gap-2">
                        <Link to="/register" className="btn btn-outline-primary btn-sm">Compartir</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Unirme</Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/register" className="btn btn-outline-secondary">Ver todas las plataformas</Link>
            </div>
          </div>
        </section>

        {/* ===== JUEGOS P2P ===== */}
        <section id="juegos" className="py-5">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-6">
                <h2 className="fw-bold">Juega por streaming seguro</h2>
                <ul className="mt-3 text-secondary">
                  <li>Compartes <strong>solo la ventana del juego</strong>, no tu escritorio.</li>
                  <li><strong>Control limitado</strong>: solo teclas/mandos permitidos.</li>
                  <li><strong>Cierre automático</strong> al terminar la sesión.</li>
                </ul>
                <Link to="/register" className="btn btn-primary mt-2">Descargar app de juegos</Link>
              </div>
              <div className="col-6">
                <div className="ratio ratio-16x9 border rounded-3 bg-light d-flex align-items-center justify-content-center">
                  <div className="text-center p-3">
                    <div className="fw-bold">Preview P2P</div>
                    <div className="text-secondary">Coloca un video/gif en el futuro</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRECIOS ===== */}
        <section id="precios" className="py-5 bg-white border-top border-bottom">
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Precios y comisiones</h2>
              <p className="text-secondary m-0">Ejemplo: comisión fija por transacción (MVP).</p>
            </div>
            <div className="row justify-content-center">
              <div className="col-6">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Ejemplo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Comisión Connecta+</td>
                      <td>10% por transacción</td>
                    </tr>
                    <tr>
                      <td>Ejemplo de ahorro</td>
                      <td>Netflix 4 personas: pagas menos</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-center">
                  <Link to="/register" className="btn btn-outline-primary">Crear mi primer grupo</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SEGURIDAD ===== */}
        <section id="seguridad" className="py-5">
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Confianza y Seguridad</h2>
              <p className="text-secondary m-0">Pagos protegidos, reputación y reportes.</p>
            </div>
            <div className="row g-4">
              {[
                { title: 'Pagos con protección', text: 'Escrow; liberación tras confirmar acceso; reembolsos.' },
                { title: 'Reputación visible', text: 'Calificaciones y reseñas por usuario y grupo.' },
                { title: 'Moderación', text: 'Reportes y resolución de disputas por admin.' },
              ].map((b, i) => (
                <div className="col-4" key={i}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h6 className="fw-bold">{b.title}</h6>
                      <p className="text-secondary m-0">{b.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-5 bg-white border-top">
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Preguntas frecuentes</h2>
            </div>
            <div className="accordion" id="faq-acc">
              {[
                { q: '¿Connecta+ vende cuentas?', a: 'No. Solo organizamos grupos y pagos; el contenido se consume en las apps oficiales.' },
                { q: '¿Es legal compartir?', a: 'Depende de los TyC de cada servicio. Mostramos avisos y límites por plataforma.' },
                { q: '¿Cómo funcionan los pagos?', a: 'Stripe; el dinero se libera cuando el acceso está confirmado (escrow).' },
                { q: '¿Qué tan seguro es el módulo P2P?', a: 'Solo ventana del juego, inputs filtrados y cierre automático.' },
              ].map((f, i) => (
                <div className="accordion-item" key={i}>
                  <h2 className="accordion-header" id={`h-${i}`}>
                    <button
                      className={`accordion-button ${i !== 0 ? 'collapsed' : ''}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#c-${i}`}
                    >
                      {f.q}
                    </button>
                  </h2>
                  <div
                    id={`c-${i}`}
                    className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                    data-bs-parent="#faq-acc"
                  >
                    <div className="accordion-body text-secondary">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
