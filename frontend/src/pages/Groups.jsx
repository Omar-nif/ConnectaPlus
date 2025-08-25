// src/pages/Groups.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Groups() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('createdAt-desc')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('groups') || '[]')
    setGroups(data)
  }, [])

  function save(next) {
    setGroups(next)
    localStorage.setItem('groups', JSON.stringify(next))
  }
  function remove(id) {
    const next = groups.filter(g => g.id !== id)
    save(next)
  }

  const filtered = useMemo(() => {
    let arr = [...groups]
    if (q.trim()) {
      const s = q.toLowerCase()
      arr = arr.filter(g => `${g.platform} ${g.plan ?? ''} ${g.notes ?? ''}`.toLowerCase().includes(s))
    }
    if (status !== 'all') arr = arr.filter(g => g.status === status)
    const [field, dir] = sort.split('-')
    arr.sort((a, b) => {
      const va = field === 'price' ? a.priceMonthly : Date.parse(a.createdAt)
      const vb = field === 'price' ? b.priceMonthly : Date.parse(b.createdAt)
      return dir === 'asc' ? va - vb : vb - va
    })
    return arr
  }, [groups, q, status, sort])

  const stats = useMemo(() => ({
    total: groups.length,
    activos: groups.filter(g => g.status === 'activo').length,
    pausados: groups.filter(g => g.status === 'pausado').length,
  }), [groups])

  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <button onClick={() => navigate('/home')} className="btn btn-outline-secondary" type="button">
                ← Regresar
              </button>
              <h1 className="h3 m-0">Grupos activos</h1>
            </div>
            <a href="/groups/new" className="btn btn-primary">Crear grupo</a>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <div className="row g-2 align-items-center">
                <div className="col-6">
                  <input className="form-control" placeholder="Buscar por plataforma, plan o notas" value={q} onChange={e => setQ(e.target.value)} />
                </div>
                <div className="col-3">
                  <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="all">Todos ({stats.total})</option>
                    <option value="activo">Activos ({stats.activos})</option>
                    <option value="pausado">Pausados ({stats.pausados})</option>
                  </select>
                </div>
                <div className="col-3">
                  <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="createdAt-desc">Recientes primero</option>
                    <option value="createdAt-asc">Antiguos primero</option>
                    <option value="price-asc">Precio ↑</option>
                    <option value="price-desc">Precio ↓</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center text-secondary p-5 border rounded bg-light">
              No hay grupos. Crea tu primer grupo.
              <div className="mt-3"><a href="/groups/new" className="btn btn-primary">Crear grupo</a></div>
            </div>
          ) : (
            <div className="row g-3">
              {filtered.map(g => (
                <div key={g.id} className="col-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold">{g.platform}{g.plan ? ` · ${g.plan}` : ''}</div>
                          <div className="small text-secondary">
                            {g.seats} cupos · MXN {Number(g.pricePerSeat ?? (g.priceMonthly / g.seats)).toFixed(2)} por integrante
                          </div>
                        </div>
                        <span className={`badge ${g.status === 'activo' ? 'text-bg-success' : 'text-bg-secondary'}`}>{g.status}</span>
                      </div>

                      {g.notes && <div className="small mt-2 border rounded p-2 bg-light">{g.notes}</div>}

                      <div className="d-flex gap-2 mt-3">
                        <a className="btn btn-outline-primary btn-sm" href={`/groups/${g.id}`}>Abrir</a>
                        <a className="btn btn-outline-secondary btn-sm" href={`/groups/new?id=${g.id}`}>Editar</a>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => remove(g.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
