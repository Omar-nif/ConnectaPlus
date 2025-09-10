import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getGroup } from "../api/groups";
import "../styles/groups.css";

/* Paleta por plataforma */
const BRAND_COLORS = {
  paramount: "#0064E0",
  disney: "#113CCF",
  "prime-video": "#00A8E1",
  youtube: "#FF0000",
  spotify: "#1DB954",
  hbo: "#5A2D82",
};

const MXN = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" })
    .format(Math.max(0, Number(n) || 0));

function initialsFrom(nameOrEmail = "") {
  const s = String(nameOrEmail).trim();
  if (!s) return "👤";
  if (s.includes("@")) return s[0].toUpperCase();
  const parts = s.split(/\s+/).filter(Boolean);
  const [a, b] = [parts[0]?.[0], parts[1]?.[0]];
  return (a || "").toUpperCase() + (b || "").toUpperCase();
}
function maskEmail(email = "") {
  const [user, domain] = String(email).split("@");
  if (!user || !domain) return email || "—";
  const safeUser = user.length <= 2 ? user[0] + "*" : user[0] + "•••" + user.slice(-1);
  return `${safeUser}@${domain}`;
}
function fmtDate(d) { try { return new Date(d).toLocaleString("es-MX"); } catch { return "—"; } }

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [chatMsg, setChatMsg] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const g = await getGroup(id);
      setGroup(g);
    } catch (e) {
      setErr(e.message || "No se pudo cargar.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, [id]);

  const slotsTotal = useMemo(() => Number(group?.slots) || 0, [group]);
  const members = useMemo(() => Array.isArray(group?.members) ? group.members : [], [group]);
  const slotsUsed  = members.length;
  const pct = useMemo(() => (slotsTotal ? Math.min(100, (slotsUsed / slotsTotal) * 100) : 0), [slotsUsed, slotsTotal]);

  // ---- permisos actuales (dueño/miembro) ----
  const isOwner = Boolean(
    group?.currentUserRole === "owner" ||
    group?.isOwner === true ||
    members.some(m => m?.isSelf && (m?.isOwner || m?.role === "owner"))
  );
  const isMember = Boolean(
    isOwner ||
    group?.currentUserIsMember === true ||
    members.some(m => m?.isSelf)
  );
  const canWrite = isMember; // dueño y miembro pueden escribir
  const canSeePlainCreds = isOwner; // solo dueño ve sin blur

  function copyCreds() {
    if (!group?.credentials) return;
    navigator.clipboard.writeText(group.credentials).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function sendChatMock(e) {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    // Mock: aquí iría tu llamada al backend.
    setChatMsg("");
  }

  if (loading) {
    return (
      <div className="site">
        <Navbar />
        <main className="container py-5">Cargando…</main>
        <Footer />
      </div>
    );
  }
  if (err) {
    return (
      <div className="site">
        <Navbar />
        <main className="container py-5">
          <div className="alert alert-danger">{err}</div>
          <button className="btn btn-soft mt-2" onClick={() => navigate(-1)}>← Regresar</button>
        </main>
        <Footer />
      </div>
    );
  }
  if (!group) return null;

  const createdAt = group.createdAt ? new Date(group.createdAt).toLocaleString("es-MX") : "—";
  const status = group.status || "active";
  const planSuffix = group.planName ? ` · ${group.planName}` : "";
  const accentStyle = { "--brand-accent": BRAND_COLORS[group.platformKey] || "var(--bs-primary)" };

  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container" style={{ maxWidth: 1100 }}>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-soft" onClick={() => navigate("/groups")}>← Regresar</button>

            <div className="text-center flex-grow-1">
              <h1 className="h5 m-0 d-flex align-items-center justify-content-center gap-2">
                <span className="brand-dot" style={accentStyle} />
                {group.platformName}{planSuffix}
              </h1>
              <div className="text-secondary small">Creado: {createdAt}</div>
            </div>

            <span className={`badge rounded-pill ${status === "active" ? "text-bg-success" : "text-bg-secondary"}`}>
              {status}
            </span>
          </div>

          <div className="row g-3">
            {/* Columna izquierda */}
            <div className="col-12 col-lg-7">
              <div className="card shadow-sm group-card" style={accentStyle}>
                <div className="card-body">
                  {/* KPIs */}
                  <div className="row g-3 mb-3">
                    <div className="col-12">
                      <div className="d-flex justify-content-between">
                        <div className="small text-secondary">Cupos</div>
                        <div className="small text-secondary">{slotsUsed} / {slotsTotal}</div>
                      </div>
                      <div className="progress">
                        <div className="progress-bar" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="small text-secondary">MXN por integrante</div>
                      <div className="fw-bold">{MXN(group.pricePerMember)}</div>
                    </div>
                    <div className="col-6">
                      <div className="small text-secondary">Precio base</div>
                      <div className="fw-bold">{MXN(group.basePriceMXN)}</div>
                    </div>
                  </div>

                  {/* Credenciales */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-semibold">Credenciales</div>
                      <button type="button" className="btn btn-link btn-sm p-0" onClick={copyCreds} disabled={!group.credentials}>
                        {copied ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <textarea
                      className={`form-control ${canSeePlainCreds ? "" : "masked"}`}
                      rows={4}
                      readOnly
                      value={group.credentials || ""}
                    />
                    <div className="form-hint">
                      {canSeePlainCreds
                        ? "Eres el dueño: ves las credenciales completas."
                        : "Se muestran borrosas a los no-miembros (mock)."}
                    </div>
                  </div>

                  {/* Notas */}
                  <div className="mb-1">
                    <div className="fw-semibold mb-1">Notas del dueño</div>
                    <textarea className="form-control" rows={2} readOnly value={group.notes || "—"} />
                  </div>
                </div>
              </div>

              {/* Integrantes */}
              <div className="card shadow-sm group-card mt-3" style={accentStyle}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="fw-semibold">Integrantes</div>
                    <span className="text-secondary small">{members.length} / {slotsTotal}</span>
                  </div>

                  {members.length === 0 ? (
                    <div className="text-secondary small">Aún no hay integrantes. Comparte tu grupo para que se unan.</div>
                  ) : (
                    <ul className="list-unstyled m-0">
                      {members.map((m, i) => {
                        const title = m.name || m.displayName || m.email || `Usuario ${i + 1}`;
                        const email = m.email ? maskEmail(m.email) : "—";
                        const role = (m.role || (m.isOwner ? "owner" : "member")).toLowerCase();
                        const statusMember = (m.status || "active").toLowerCase();
                        const isSelf = !!m.isSelf;
                        return (
                          <li key={m.id || i} className="member-item">
                            <div className="member-avatar" style={accentStyle}>
                              {initialsFrom(title)}
                            </div>
                            <div className="member-meta">
                              <div className="d-flex flex-wrap align-items-center gap-2">
                                <span className="fw-semibold">{title}</span>
                                <span className="text-secondary">· {email}</span>
                                {role === "owner" && <span className="badge rounded-pill text-bg-primary">Dueño</span>}
                                {role !== "owner" && <span className="badge rounded-pill text-bg-secondary">Miembro</span>}
                                {isSelf && <span className="badge rounded-pill text-bg-success">Tú</span>}
                                {statusMember !== "active" && (
                                  <span className="badge rounded-pill text-bg-warning text-dark">{statusMember}</span>
                                )}
                              </div>
                              <div className="text-secondary small">
                                Unido: {fmtDate(m.joinedAt || m.createdAt)}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha - Chat */}
            <div className="col-12 col-lg-5">
              <div className="card shadow-sm group-card" style={accentStyle}>
                <div className="card-body">
                  <div className="fw-semibold mb-2">Chat del grupo (mock)</div>

                  <div className="border rounded p-3 empty-chat" aria-live="polite">
                    {canWrite
                      ? "Escribe un mensaje para tu grupo."
                      : "Próximamente… aquí podrás coordinarte con tu grupo."}
                  </div>

                  <form className="input-group mt-3" onSubmit={sendChatMock}>
                    <input
                      className="form-control"
                      placeholder={canWrite ? "Escribe un mensaje…" : "Debes unirte para escribir"}
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      disabled={!canWrite}
                    />
                    <button className="btn btn-primary" disabled={!canWrite || !chatMsg.trim()}>
                      Enviar
                    </button>
                  </form>

                  <div className="small text-secondary mt-2">
                    {canWrite ? "Tu mensaje se enviará a todos los integrantes (mock)." : "Solo miembros pueden escribir."}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
