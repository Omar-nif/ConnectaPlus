import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMyGroups, deleteGroup } from "../api/groups";

const MXN = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    Math.max(0, Number(n) || 0)
  );

export default function Groups() {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await getMyGroups();
      setGroups(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "No se pudo cargar.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = [...groups];
    const q = query.trim().toLowerCase();

    if (q) {
      list = list.filter((g) => {
        const hay = `${g.platformName ?? ""} ${g.notes ?? ""}`.toLowerCase();
        return hay.includes(q);
      });
    }
    if (status !== "all") {
      list = list.filter((g) =>
        status === "active" ? g.status === "active" : g.status !== "active"
      );
    }
    list.sort((a, b) => {
      if (sort === "recent") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      const pa = Number(a.pricePerMember) || 0;
      const pb = Number(b.pricePerMember) || 0;
      if (sort === "price_asc") return pa - pb;
      if (sort === "price_desc") return pb - pa;
      return 0;
    });
    return list;
  }, [groups, query, status, sort]);

  function openGroup(id) { navigate(`/groups/${id}`); }
  function editGroup(id) { navigate(`/groups/${id}?edit=1`); }

  async function onDelete(id) {
    if (!confirm("¿Eliminar este grupo?")) return;
    try {
      await deleteGroup(id);
      await load();
    } catch (e) {
      alert(e.message || "No se pudo eliminar.");
    }
  }

  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Regresar</button>
              <h1 className="h5 m-0">Grupos activos</h1>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/groups/new")}>
              Crear grupo
            </button>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <input
              className="form-control"
              style={{ maxWidth: 520 }}
              placeholder="Buscar por plataforma, plan o notas"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="form-select" style={{ maxWidth: 220 }} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Todos ({groups.length})</option>
              <option value="active">Activos</option>
              <option value="paused">Pausados</option>
            </select>
            <select className="form-select" style={{ maxWidth: 220 }} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recent">Recientes primero</option>
              <option value="price_asc">Precio por integrante ↑</option>
              <option value="price_desc">Precio por integrante ↓</option>
            </select>
          </div>

          {loading ? (
            <div className="border rounded p-5 text-center">Cargando…</div>
          ) : err ? (
            <div className="alert alert-danger">{err}</div>
          ) : filtered.length === 0 ? (
            <div className="border rounded p-5 text-center text-secondary">
              No hay grupos. Crea tu primer grupo.
              <div className="mt-3">
                <button className="btn btn-primary" onClick={() => navigate("/groups/new")}>Crear grupo</button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filtered.map((g) => {
                const slotsTotal = Number(g.slots) || 0;
                const slotsUsed = Array.isArray(g.members) ? g.members.length : 0;

                return (
                  <div key={g.id} className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="fw-bold m-0">{g.platformName || "Plataforma"}</h5>
                          <div className="small text-secondary mt-1">
                            Creado: {new Date(g.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <span className={`badge ${g.status === "active" ? "text-bg-success" : "text-bg-secondary"}`}>
                          {g.status}
                        </span>
                      </div>

                      <div className="row mt-3 g-3">
                        <div className="col-12 col-md-4">
                          <div className="small text-secondary">Cupos</div>
                          <div className="fw-bold">{slotsUsed} / {slotsTotal}</div>
                          <div className="progress mt-1">
                            <div className="progress-bar" style={{ width: `${slotsTotal ? (100 * slotsUsed) / slotsTotal : 0}%` }} />
                          </div>
                        </div>
                        <div className="col-6 col-md-4">
                          <div className="small text-secondary">MXN por integrante</div>
                          <div className="fw-bold">{MXN(g.pricePerMember)}</div>
                        </div>
                        <div className="col-6 col-md-4">
                          <div className="small text-secondary">Precio base</div>
                          <div className="fw-bold">{MXN(g.basePriceMXN)}</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="small text-secondary mb-1">Notas del dueño</div>
                        <input className="form-control" disabled value={g.notes || "—"} readOnly />
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-outline-primary" onClick={() => openGroup(g.id)}>Abrir</button>
                        <button className="btn btn-outline-secondary" onClick={() => editGroup(g.id)}>Editar</button>
                        <button className="btn btn-outline-danger" onClick={() => onDelete(g.id)}>Eliminar</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
