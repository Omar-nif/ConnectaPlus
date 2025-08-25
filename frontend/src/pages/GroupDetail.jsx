// src/pages/GroupDetail.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const gid = Number(id)

  const [group, setGroup] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  // Usuario actual (mock desde auth/localStorage)
  const userId = localStorage.getItem('user_id') || 'anon'
  const userName = localStorage.getItem('user_name') || 'Usuario'

  // Cargar grupo y chat
  useEffect(() => {
    const groups = JSON.parse(localStorage.getItem('groups') || '[]')
    const g = groups.find(x => x.id === gid)
    if (!g) return
    if (!g.members) g.members = []
    setGroup(g)

    const chat = JSON.parse(localStorage.getItem(`chat:${gid}`) || '[]')
    setMessages(chat)
  }, [gid])

  // Helpers persistencia
  function saveGroup(next) {
    const groups = JSON.parse(localStorage.getItem('groups') || '[]')
    const arr = groups.map(x => (x.id === gid ? next : x))
    localStorage.setItem('groups', JSON.stringify(arr))
    setGroup(next)
  }
  function saveChat(next) {
    localStorage.setItem(`chat:${gid}`, JSON.stringify(next))
    setMessages(next)
  }

  const isOwner = useMemo(() => {
    if (!group) return false
    return String(group.ownerId ?? '') === String(userId)
  }, [group, userId])

  const isMember = useMemo(() => {
    if (!group) return false
    return group.members?.some(m => m.id === userId)
  }, [group, userId])

  // Dueño SIEMPRE puede chatear; miembros también
  const canChat = isOwner || isMember

  const seatsUsed = group?.members?.length || 0
  const seatsFree = group ? Math.max(0, group.seats - seatsUsed) : 0

  function handleJoin() {
    if (!group || isOwner || isMember) return
    if (seatsFree <= 0) return alert('No hay cupos disponibles.')
    // Mock: tras “pagar” te unes
    const next = { ...group, members: [...group.members, { id: userId, name: userName }] }
    saveGroup(next)
  }

  function handleLeave() {
    if (!group || isOwner || !isMember) return
    const next = { ...group, members: group.members.filter(m => m.id !== userId) }
    saveGroup(next)
  }

  function sendMessage(e) {
    e.preventDefault()
    if (!group || !canChat) return
    if (!text.trim()) return
    const msg = { id: Date.now(), userId, userName, content: text.trim(), createdAt: new Date().toISOString() }
    saveChat([...messages, msg])
    setText('')
  }

  if (!group) {
    return (
      <div className="site">
        <Navbar />
        <main className="py-4">
          <div className="container">
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate('/groups')}>← Regresar</button>
            <div className="alert alert-warning">Grupo no encontrado.</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const pricePerSeat = Number(group.pricePerSeat ?? (group.priceMonthly / group.seats)).toFixed(2)

  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-secondary" onClick={() => navigate('/groups')}>← Regresar</button>
              <h1 className="h4 m-0">
                {group.platform}{group.plan ? ` · ${group.plan}` : ''}
                {isOwner && <span className="badge text-bg-primary ms-2">Dueño</span>}
              </h1>
            </div>
            <a className="btn btn-outline-secondary" href={`/groups/new?id=${group.id}`}>Editar</a>
          </div>

          <div className="row g-4">
            {/* Detalle y credenciales */}
            <div className="col-6">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="small text-secondary">Cupos</div>
                      <div className="fw-semibold">{seatsUsed} / {group.seats}</div>
                    </div>
                    <div>
                      <div className="small text-secondary">Costo por integrante</div>
                      <div className="fw-semibold">MXN {pricePerSeat}</div>
                    </div>
                  </div>

                  <hr />

                  {/* Credenciales */}
                  <div>
                    <div className="fw-semibold">Credenciales</div>
                    {(isOwner || isMember) ? (
                      <div className="border rounded p-2 mt-2 bg-light">
                        <div className="small mb-1"><strong>Usuario:</strong> {group.credentials?.user || '—'}</div>
                        <div className="small"><strong>Contraseña:</strong> {group.credentials?.pass || '—'}</div>
                        {group.credentials?.hint && <div className="small text-secondary mt-2">Pista: {group.credentials.hint}</div>}
                      </div>
                    ) : (
                      <div className="border rounded p-2 mt-2" style={{ position: 'relative', overflow: 'hidden', background: '#f8f9fa' }}>
                        <div style={{ filter: 'blur(6px)' }}>
                          <div className="small mb-1"><strong>Usuario:</strong> {group.credentials?.user || 'usuario@correo.com'}</div>
                          <div className="small"><strong>Contraseña:</strong> {group.credentials?.pass || '••••••••'}</div>
                        </div>
                        <div className="small text-secondary mt-2">
                          Pista: {group.credentials?.hint || 'Correo inicia con ju***@gmail.com'}
                        </div>
                        <div className="small text-secondary mt-2">Se desbloquea al <strong>pagar</strong> (mock).</div>
                      </div>
                    )}
                  </div>

                  {group.notes && (
                    <>
                      <hr />
                      <div>
                        <div className="fw-semibold">Notas del dueño</div>
                        <div className="small border rounded p-2 mt-2 bg-light">{group.notes}</div>
                      </div>
                    </>
                  )}

                  <hr />
                  {/* Acciones de miembro – ocultas para dueño */}
                  {!isOwner && (
                    <div className="d-flex gap-2">
                      {!isMember ? (
                        <button className="btn btn-primary" onClick={handleJoin} disabled={seatsFree <= 0}>
                          {seatsFree > 0 ? 'Pagar con Stripe (mock)' : 'Sin cupos'}
                        </button>
                      ) : (
                        <button className="btn btn-outline-danger" onClick={handleLeave}>Salir</button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Miembros */}
              <div className="card">
                <div className="card-body">
                  <div className="fw-semibold mb-2">Miembros</div>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-dark">Dueño: {group.ownerName || 'Owner'}</span>
                    {group.members?.map(m => (
                      <span key={m.id} className="badge text-bg-primary">{m.name}</span>
                    ))}
                    {Array.from({ length: seatsFree }).map((_, i) => (
                      <span key={`free-${i}`} className="badge text-bg-light border">Libre</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat */}
            <div className="col-6">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="fw-semibold mb-2">Chat del grupo (mock)</div>

                  <div className="border rounded p-2 mb-3" style={{ height: 360, overflowY: 'auto' }}>
                    {messages.length === 0 ? (
                      <div className="text-secondary small">Aún no hay mensajes.</div>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id} className="mb-2">
                          <div className="small">
                            <strong>{msg.userName}</strong>
                            <span className="text-secondary"> · {new Date(msg.createdAt).toLocaleString()}</span>
                          </div>
                          <div className="small">{msg.content}</div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={sendMessage} className="mt-auto">
                    <div className="input-group">
                      <input
                        className="form-control"
                        placeholder={canChat ? "Escribe un mensaje..." : "Debes pagar para escribir"}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={!canChat}
                      />
                      <button className="btn btn-primary" disabled={!canChat || !text.trim()}>Enviar</button>
                    </div>
                    {!canChat && <div className="small text-secondary mt-2">Solo miembros (o el dueño) pueden escribir.</div>}
                  </form>
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
