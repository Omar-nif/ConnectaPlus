import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getGroup, updateGroup } from "../api/groups";

const MXN = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(
    Math.max(0, Number(n) || 0)
  );

export default function GroupDetail() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const editing = sp.get("edit") === "1";

  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

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

  if (loading) return <div className="site"><Navbar /><main className="container py-5">Cargando…</main><Footer /></div>;
  if (err) return <div className="site"><Navbar /><main className="container py-5"><div className="alert alert-danger">{err}</div></main><Footer /></div>;
  if (!group) return null;

  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-secondary" onClick={() => navigate("/groups")}>← Regresar</button>
            <h1 className="h5 m-0">{group.platformName}</h1>
            <button className="btn btn-outline-secondary" onClick={() => navigate(`/groups/${group.id}?edit=1`)}>Editar</button>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-7">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <div className="small text-secondary">Cupos</div>
                      <div className="fw-bold">{(group.members?.length ?? 0)} / {group.slots}</div>
                    </div>
                    <div>
                      <div className="small text-secondary">MXN por integrante</div>
                      <div className="fw-bold">{MXN(group.pricePerMember)}</div>
                    </div>
                    <div>
                      <div className="small text-secondary">Precio base</div>
                      <div className="fw-bold">{MXN(group.basePriceMXN)}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="fw-semibold">Credenciales (borrosas para no-miembros)</div>
                    <textarea className="form-control" rows={4} readOnly value={group.credentials || ""} />
                  </div>

                  <div>
                    <div className="fw-semibold">Notas del dueño</div>
                    <input className="form-control" readOnly value={group.notes || "—"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="fw-semibold mb-2">Chat del grupo (mock)</div>
                  <div className="border rounded p-3" style={{ minHeight: 220 }}>Próximamente…</div>
                  <div className="input-group mt-3">
                    <input disabled className="form-control" placeholder="Debes unirte para escribir" />
                    <button disabled className="btn btn-primary">Enviar</button>
                  </div>
                  <div className="small text-secondary mt-2">Solo miembros pueden escribir.</div>
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
