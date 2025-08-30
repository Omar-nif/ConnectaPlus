import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { API_URL } from '../lib/api.js' // asegúrate que sea export named

// "Miembro desde {mes} {año}"
function memberSince(dateStr) {
  const d = new Date(dateStr)
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  if (isNaN(d.getTime())) return 'Miembro reciente'
  return `Miembro desde ${meses[d.getMonth()]} ${d.getFullYear()}`
}

function fmtMXN(n) {
  const val = Number(n || 0)
  try {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val)
  } catch {
    return `$${val} MXN`
  }
}

function Avatar({ name }) {
  const ini = (name?.trim()?.[0] || 'U').toUpperCase()
  return (
    <div
      className="rounded-circle d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary fw-bold"
      style={{ width: 44, height: 44 }}
      aria-label={name || 'Usuario'}
      title={name || 'Usuario'}
    >
      {ini}
    </div>
  )
}

export default function ServiceGroups() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const token = localStorage.getItem('access_token') || null
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    let cancel = false
    ;(async () => {
      setLoading(true); setErr('')
      try {
        // Info de la plataforma
        const sres = await fetch(`${API_URL}/api/services/${slug}`)
        if (!sres.ok) throw new Error('No se encontró la plataforma')
        const sjson = await sres.json()
        if (!cancel) setService(sjson.data)

        // Grupos activos (excluye los del usuario si hay token)
        const gres = await fetch(`${API_URL}/api/services/${slug}/groups`, { headers })
        if (!gres.ok) throw new Error('No se pudo cargar grupos')
        const gj = await gres.json()
        if (!cancel) setGroups(gj.data ?? [])
      } catch (e) {
        if (!cancel) setErr(e.message || 'Error cargando datos')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [slug])

  const title = service?.name ?? 'Plataforma'
  const desc  = service?.desc ?? 'Grupos disponibles'

  return (
    <div className="site">
      <Navbar />

      <main>
        {/* Header */}
        <section className="py-4 bg-light border-bottom">
          <div className="container d-flex align-items-center justify-content-between" style={{ maxWidth: 920 }}>
            <div>
              <h2 className="fw-bold m-0">{title}</h2>
              <p className="text-secondary m-0">{desc}</p>
            </div>
            <div>
              <Link to="/explore-groups" className="btn btn-outline-secondary">
                ← Regresar
              </Link>
            </div>
          </div>
        </section>

        {/* Lista de tarjetas */}
        <section className="py-4">
          <div className="container" style={{ maxWidth: 920 }}>
            {loading && <div className="alert alert-info m-0">Cargando…</div>}
            {err && !loading && <div className="alert alert-danger m-0">{err}</div>}

            {!loading && !err && (
              <>
                {groups.length === 0 ? (
                  <div className="alert alert-secondary m-0">No hay grupos disponibles por ahora.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {groups.map(g => {
                      // cuando exista membresía real, reemplazar:
                      const ocupados = Math.max(0, (g.slots ?? 0) - (g.availableSlots ?? g.slots ?? 0))
                      const total = g.slots ?? 0
                      const unit = g.pricePerMember ?? Math.round(((g.basePriceMXN ?? 0) / Math.max(1,total)) * 1.2)
                      return (
                        <div key={g.id} className="card border-0 shadow-sm rounded-4">
                          <div className="card-body d-flex align-items-center justify-content-between gap-3">
                            {/* Izquierda: avatar + info */}
                            <div className="d-flex align-items-center gap-3">
                              <Avatar name={g.ownerName} />
                              <div>
                                <div className="fw-semibold">{g.ownerName || '—'}</div>
                                <div className="text-secondary small">{memberSince(g.createdAt)}</div>
                                <div className="text-secondary small">{ocupados}/{total} miembros</div>
                              </div>
                            </div>

                            {/* Derecha: precio + botón */}
                            <div className="text-end">
                              <div className="fs-5 fw-bold">{fmtMXN(unit)}</div>
                              <button
                                className="btn btn-primary btn-sm mt-2"
                                onClick={() => alert('Flujo de unión pendiente')}
                              >
                                Únete
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
