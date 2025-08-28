import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ExploreGroups() {
  const peliculasYSeries = [
    { name: 'Netflix', desc: 'Series y películas' },
    { name: 'Amazon Prime Video', desc: 'Películas y TV' },
    { name: 'Paramount+', desc: 'Películas y TV' },
    { name: 'Apple TV+', desc: 'Series y películas' },
  ]

  const programas = [
    { name: 'Microsoft 365', desc: 'Ofimática y productividad' },
    { name: 'Google One', desc: 'Almacenamiento y servicios Google' },
    { name: 'Dropbox', desc: 'Almacenamiento en la nube' },
    { name: 'Canva', desc: 'Diseño gráfico y plantillas' },
  ]

  const musica = [
    { name: 'Apple Music', desc: 'Streaming de música' },
    { name: 'Spotify', desc: 'Música sin anuncios' },
    { name: 'Tidal', desc: 'Audio en alta fidelidad' },
    { name: 'Deezer', desc: 'Música y podcasts' },
    { name: 'Amazon Music Unlimited', desc: 'Catálogo completo de Amazon' },
  ]

  const Section = ({ id, title, subtitle, items }) => (
    <section id={id} className="py-5 bg-white border-top">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="fw-bold">{title}</h2>
          <p className="text-secondary m-0">{subtitle}</p>
        </div>
        <div className="row g-4">
          {items.map((p, i) => (
            <div className="col-4" key={i}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <h6 className="fw-bold m-0">{p.name}</h6>
                    <span className="badge text-bg-light border">Disponible</span>
                  </div>
                  <p className="text-secondary mt-2 mb-3">{p.desc}</p>
                  <div className="d-flex gap-2">
                    
                    <Link to="#" onClick={(e)=>e.preventDefault()} className="btn btn-primary btn-sm">Unirme</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  return (
    <div className="site">
      <Navbar />

      <main>
        {/* Encabezado */}
        <section className="py-5 bg-light border-bottom">
          <div className="container">
            <h1 className="fw-bold">Explorar grupos</h1>
            <p className="text-secondary m-0">
              Descubre todos los servicios disponibles y únete a un grupo. (Acciones por servicio: pendientes)
            </p>
            <div className="d-flex gap-2 mt-3">
              <Link to="/home" className="btn btn-outline-secondary">
                ← Regresar
              </Link>
            </div>
          </div>
        </section>

        {/* Categorías */}
        <Section
          id="peliculas-series"
          title="Películas y series"
          subtitle="Netflix, Prime Video, Paramount+, Apple TV+"
          items={peliculasYSeries}
        />
        <Section
          id="programas"
          title="Programas"
          subtitle="Microsoft 365, Google One, Dropbox, Canva"
          items={programas}
        />
        <Section
          id="musica"
          title="Música"
          subtitle="Apple Music, Spotify, Tidal, Deezer, Amazon Music Unlimited"
          items={musica}
        />

        <div className="py-5 text-center">
          <div className="container">
            <Link to="/groups" className="btn btn-outline-secondary">Ver todos los grupos</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
