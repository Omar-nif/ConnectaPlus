import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function GroupNew() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const editId = params.get('id') ? Number(params.get('id')) : null

  // Usuario actual (mock desde auth)
  const userId = localStorage.getItem('user_id') || 'anon'
  const userName = localStorage.getItem('user_name') || 'Usuario'

  const [form, setForm] = useState({
    platform: 'Netflix',
    plan: '',
    seats: 4,
    priceMonthly: 199,
    notes: '',
    credUser: '',
    credPass: '',
    credHint: '',
  })
  const [err, setErr] = useState('')

  // Prefill si es edición
  useEffect(() => {
    if (!editId) return
    const groups = JSON.parse(localStorage.getItem('groups') || '[]')
    const g = groups.find((x) => x.id === editId)
    if (!g) return
    setForm({
      platform: g.platform,
      plan: g.plan ?? '',
      seats: g.seats,
      priceMonthly: g.priceMonthly,
      notes: g.notes ?? '',
      credUser: g.credentials?.user ?? '',
      credPass: g.credentials?.pass ?? '',
      credHint: g.credentials?.hint ?? '',
    })
  }, [editId])

  const pricePerSeat = useMemo(() => {
    const seats = Number(form.seats) || 1
    const total = Number(form.priceMonthly) || 0
    return seats > 0 ? total / seats : 0
  }, [form.seats, form.priceMonthly])

  function onChange(e) {
    const { id, value } = e.target
    setForm((f) => ({ ...f, [id]: value }))
  }
  function onNumber(e) {
    const { id, value } = e.target
    const n = value.replace(/[^0-9.]/g, '')
    setForm((f) => ({ ...f, [id]: n }))
  }
  function onSeats(e) {
    const v = e.target.value.replace(/\D/g, '')
    setForm((f) => ({ ...f, seats: v }))
  }

  function onSubmit(e) {
    e.preventDefault()
    setErr('')

    if (!form.platform) return setErr('Selecciona una plataforma.')
    const seats = Number(form.seats)
    if (!seats || seats < 2) return setErr('Define al menos 2 cupos.')
    const total = Number(form.priceMonthly)
    if (!total || total <= 0) return setErr('Ingresa un precio mensual válido.')

    const groups = JSON.parse(localStorage.getItem('groups') || '[]')
    const existing = editId ? groups.find(g => g.id === editId) : null

    const payload = {
      id: editId ?? Date.now(),
      ownerId: existing?.ownerId ?? userId,          // dueño del grupo
      ownerName: existing?.ownerName ?? userName,
      platform: form.platform,
      plan: form.plan || null,
      seats,
      priceMonthly: total,
      pricePerSeat: Number((total / seats).toFixed(2)),
      notes: form.notes || null,
      status: 'activo',
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      credentials: {
        user: form.credUser || null,
        pass: form.credPass || null,
        hint: form.credHint || null,
      },
      members: existing?.members ?? [],
    }

    let next
    if (editId) {
      next = groups.map(g => (g.id === editId ? payload : g))
    } else {
      next = [payload, ...groups]
    }
    localStorage.setItem('groups', JSON.stringify(next))

    // 🔔 notifica a la app para refrescar contadores/listas
    window.dispatchEvent(new Event('groups:change'))

    navigate('/groups')
  }

  const isEdit = Boolean(editId)

  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="h3 m-0">{isEdit ? 'Editar grupo' : 'Crear grupo'}</h1>
            <a href="/groups" className="btn btn-outline-secondary">Grupos activos</a>
          </div>

          <div className="row g-4">
            <div className="col-7">
              <div className="card h-100">
                <div className="card-body">
                  {err && <div className="alert alert-danger mb-3">{err}</div>}

                  <form onSubmit={onSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="platform">Plataforma</label>
                      <select id="platform" className="form-select" value={form.platform} onChange={onChange}>
                        {['Netflix','Spotify','Disney+','YouTube Premium','Xbox Game Pass','Adobe','Otro'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="plan">Plan (opcional)</label>
                      <input id="plan" className="form-control" placeholder="Ej. Premium / Familiar" value={form.plan} onChange={onChange} />
                    </div>

                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label" htmlFor="seats">Cupos totales</label>
                        <input id="seats" inputMode="numeric" className="form-control" value={form.seats} onChange={onSeats} />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label" htmlFor="priceMonthly">Precio total / mes (MXN)</label>
                        <div className="input-group">
                          <span className="input-group-text">MXN</span>
                          <input id="priceMonthly" inputMode="decimal" className="form-control" value={form.priceMonthly} onChange={onNumber} />
                        </div>
                        <div className="form-text">≈ MXN {Number(pricePerSeat).toFixed(2)} por integrante</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label" htmlFor="notes">Notas / reglas (opcional)</label>
                      <textarea
                        id="notes"
                        className="form-control"
                        rows={3}
                        placeholder="Instrucciones para los miembros (ej. no cambiar la contraseña, no compartir)."
                        value={form.notes}
                        onChange={onChange}
                      />
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-2">Credenciales del servicio</h6>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label" htmlFor="credUser">Correo / Usuario</label>
                          <input id="credUser" className="form-control" placeholder="usuario@correo.com" value={form.credUser} onChange={onChange} />
                        </div>
                        <div className="col-6 mb-3">
                          <label className="form-label" htmlFor="credPass">Contraseña</label>
                          <input id="credPass" className="form-control" placeholder="Contraseña" value={form.credPass} onChange={onChange} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label" htmlFor="credHint">Pista (opcional)</label>
                        <input id="credHint" className="form-control" placeholder='Ej. "Correo inicia con ju***@gmail.com"' value={form.credHint} onChange={onChange} />
                      </div>
                      <div className="form-text">
                        Para no miembros, las credenciales se mostrarán <strong>borrosas</strong> en el detalle del grupo (mock).
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/groups')}>Cancelar</button>
                      <button type="submit" className="btn btn-primary">{isEdit ? 'Guardar cambios' : 'Crear grupo'}</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-5">
              <div className="card h-100">
                <div className="card-body">
                  <h6 className="fw-bold">Vista previa</h6>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between">
                      <div className="fw-semibold">
                        {form.platform} {form.plan ? `· ${form.plan}` : ''}
                      </div>
                    </div>
                    <div className="small text-secondary mt-1">
                      {form.seats} cupos · MXN {Number(pricePerSeat).toFixed(2)} / integrante
                    </div>
                  </div>

                  {form.notes && (
                    <div className="mt-3">
                      <div className="text-secondary small">Notas</div>
                      <div className="border rounded p-2 small bg-light">{form.notes}</div>
                    </div>
                  )}

                  <div className="mt-3">
                    <div className="text-secondary small mb-1">Credenciales (se muestran borrosas hasta pagar)</div>
                    <div className="border rounded p-2" style={{ position: 'relative', overflow: 'hidden', background: '#f8f9fa' }}>
                      <div style={{ filter: 'blur(6px)' }}>
                        <div className="small mb-1"><strong>Usuario:</strong> {form.credUser || 'usuario@correo.com'}</div>
                        <div className="small"><strong>Contraseña:</strong> {form.credPass || '••••••••'}</div>
                      </div>
                      <div className="small text-secondary mt-2">
                        Pista: {form.credHint || 'Correo inicia con ju***@gmail.com'}
                      </div>
                    </div>
                  </div>

                  {Boolean(editId) && <div className="small text-secondary mt-3">Estás editando un grupo existente.</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
