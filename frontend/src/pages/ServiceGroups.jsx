import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { API_URL } from '../lib/api' 

function timeAgo(dateStr) {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  const m = Math.floor(diff / (60 * 1000))
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} h`
  const days = Math.floor(h / 24)
  if (days < 30) return `${days} d`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} mes(es)`
  const years = Math.floor(months / 12)
  return `${years} año(s)`
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

    async function load() {
      setLoading(true)
      setErr('')
      try {
        // 1) Info de la plataforma
        const sres = await fetch(`${API_URL}/api/services/${slug}`)
        if (!sres.ok) throw new Error('No se encontró la plataforma')
        const sjson = await sres.json()
        if (!cancel) setService(sjson.data)

        // 2) Grupos activos (excluye los del usuario si hay token)
        const gres = await fetch(`${API_URL}/api/services/${slug}/groups`, { headers })
        if (!gres.ok) throw new Error('No se pudo cargar grupos')
        const gj = await gres.json()
        if (!cancel) setGroups(gj.data ?? [])
      } catch (e) {
        if (!cancel) setErr(e.message || 'Error cargando datos')
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    load()
    return () => { cancel = true }
  }, [slug])

  const title = service?.name ?? 'Plataforma'
  const desc  = service?.desc ?? 'Grupos disponibles'

  return (
    <div className="site">
      <Navbar />

      <main>
    
        <section className="py-4 bg-light border-bottom">
          <div className="container d-flex align-items-center justify-content-between">
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

        {/* Lista lineal */}
        <section className="py-4">
          <div className="container">
            {loading && <div className="alert alert-info m-0">Cargando…</div>}
            {err && !loading && <div className="alert alert-danger m-0">{err}</div>}
            {!loading && !err && (
              <>
                {groups.length === 0 ? (
                  <div className="alert alert-secondary m-0">No hay grupos disponibles por ahora.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr>
                          <th>Dueño</th>
                          <th>Antigüedad</th>
                          <th>Cupos disponibles</th>
                          <th>Precio</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups.map(g => (
                          <tr key={g.id}>
                            <td className="fw-medium">{g.ownerName}</td>
                            <td className="text-secondary">{timeAgo(g.createdAt)}</td>
                            <td>{g.availableSlots}</td>
                            <td>${g.pricePerMember} MXN</td>
                            <td className="text-end">
                              
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => alert('pendiente')}
                              >
                                Unirme
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
