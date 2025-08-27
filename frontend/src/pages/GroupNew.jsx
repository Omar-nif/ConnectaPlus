import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createGroup } from "../api/groups";

/* Catálogo local (igual al server) */
const PRESETS = [
  { key: "spotify", name: "Spotify Premium", plans: [
    { key: "duo", name: "Duo" },
    { key: "family", name: "Familiar" },
  ]},
  { key: "disney", name: "Disney+", plans: [] },
  { key: "youtube", name: "YouTube Premium", plans: [
    { key: "individual", name: "Individual" },
    { key: "family", name: "Familiar" },
  ]},
  { key: "prime", name: "Prime Video", plans: [] },
  { key: "max", name: "Max (HBO)", plans: [
    { key: "estandar", name: "Estándar" },
    { key: "premium", name: "Premium" },
  ]},
  { key: "apple_tv", name: "Apple TV+", plans: [] },
  { key: "paramount", name: "Paramount+", plans: [] },
  { key: "game_pass", name: "Xbox Game Pass", plans: [
    { key: "core", name: "Core" },
    { key: "ultimate", name: "Ultimate" },
  ]},
];

export default function GroupNew() {
  const navigate = useNavigate();
  const [platformKey, setPlatformKey] = useState("");
  const [planKey, setPlanKey] = useState("");
  const [credentials, setCredentials] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const selectedPlatform = useMemo(
    () => PRESETS.find((p) => p.key === platformKey) || null,
    [platformKey]
  );

  // Si la plataforma cambia y tiene planes, prepara el primero
  React.useEffect(() => {
    if (!selectedPlatform) { setPlanKey(""); return; }
    if ((selectedPlatform.plans?.length ?? 0) > 0) {
      // si el plan actual no existe, selecciona el primero
      if (!selectedPlatform.plans.find(pl => pl.key === planKey)) {
        setPlanKey(selectedPlatform.plans[0].key);
      }
    } else {
      setPlanKey("");
    }
  }, [selectedPlatform, planKey]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!platformKey) return setErr("Selecciona una plataforma.");
    if (!credentials.trim()) return setErr("Agrega las credenciales.");
    if ((selectedPlatform?.plans?.length ?? 0) > 0 && !planKey) {
      return setErr("Selecciona un plan.");
    }

    setLoading(true);
    try {
      await createGroup({
        platformKey,
        planKey: planKey || null,
        credentials: credentials.trim(),
        notes: notes.trim() || null,
      });
      navigate("/groups");
    } catch (e) {
      setErr(e.message || "No se pudo crear el grupo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>← Regresar</button>
            <h1 className="h5 m-0">Crear grupo</h1>
            <div />
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              {err && <div className="alert alert-danger">{err}</div>}

              <form onSubmit={onSubmit}>
                {/* Plataforma */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Plataforma</label>
                  <select
                    className="form-select"
                    value={platformKey}
                    onChange={(e) => setPlatformKey(e.target.value)}
                  >
                    <option value="">Selecciona</option>
                    {PRESETS.map((p) => (
                      <option key={p.key} value={p.key}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Plan (si aplica) */}
                {selectedPlatform && (selectedPlatform.plans?.length ?? 0) > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Plan</label>
                    <select
                      className="form-select"
                      value={planKey}
                      onChange={(e) => setPlanKey(e.target.value)}
                    >
                      {selectedPlatform.plans.map((pl) => (
                        <option key={pl.key} value={pl.key}>{pl.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Credenciales */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Credenciales</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder={"correo@servicio.com\ncontraseña123"}
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                  />
                  <div className="form-text">
                    Se mostrarán borrosas a los no-miembros; se desbloquean tras pagar (mock).
                  </div>
                </div>

                {/* Notas */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Notas</label>
                  <input
                    className="form-control"
                    placeholder="Reglas o recordatorios (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Creando..." : "Crear grupo"}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate("/groups")}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
