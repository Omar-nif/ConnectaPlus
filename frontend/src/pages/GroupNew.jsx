import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createGroup } from "../api/groups";
import "../styles/groups.css";

/* Catálogo local ALINEADO con Landing.jsx */
const PRESETS = [
  { key: "paramount",   name: "Paramount+",       color: "#0064E0", plans: [] },
  { key: "disney",      name: "Disney+",          color: "#113CCF", plans: [] },
  { key: "prime-video", name: "Prime Video",      color: "#00A8E1", plans: [] },
  { key: "youtube",     name: "YouTube Premium",  color: "#FF0000", plans: [
      { key: "individual", name: "Individual" },
      { key: "family",     name: "Familiar"   },
    ]},
  { key: "spotify",     name: "Spotify",          color: "#1DB954", plans: [
      { key: "duo",    name: "Duo"      },
      { key: "family", name: "Familiar" },
    ]},
  { key: "hbo",         name: "HBO Max",          color: "#5A2D82", plans: [
      { key: "estandar", name: "Estándar" },
      { key: "premium",  name: "Premium"  },
    ]},
];

/* Mapa de compatibilidad para el backend (parche rápido) */
const SERVER_KEY_MAP = {
  "paramount": "paramount",
  "disney": "disney",
  "prime-video": "prime", // backend espera 'prime'
  "youtube": "youtube",
  "spotify": "spotify",
  "hbo": "max",           // backend espera 'max'
};

export default function GroupNew() {
  const navigate = useNavigate();

  // form state
  const [platformKey, setPlatformKey] = useState("");
  const [planKey, setPlanKey] = useState("");
  const [credentials, setCredentials] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [touched, setTouched] = useState({ platform: false, credentials: false });

  const selectedPlatform = useMemo(
    () => PRESETS.find((p) => p.key === platformKey) || null,
    [platformKey]
  );

  // Autoseleccionar primer plan cuando aplique
  useEffect(() => {
    if (!selectedPlatform) { setPlanKey(""); return; }
    if (selectedPlatform.plans?.length) {
      if (!selectedPlatform.plans.find(pl => pl.key === planKey)) {
        setPlanKey(selectedPlatform.plans[0].key);
      }
    } else {
      setPlanKey("");
    }
  }, [selectedPlatform, planKey]);

  // Validación simple
  const errors = {
    platform: !platformKey ? "Selecciona una plataforma." : "",
    credentials: !credentials.trim() ? "Agrega las credenciales (correo y contraseña)." : "",
    plan: selectedPlatform?.plans?.length && !planKey ? "Selecciona un plan." : "",
  };
  const isValid = !errors.platform && !errors.credentials && !errors.plan;

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!isValid) {
      setTouched({ platform: true, credentials: true });
      return;
    }

    setLoading(true);
    try {
      await createGroup({
        platformKey: SERVER_KEY_MAP[platformKey] || platformKey, // 👈 mapeo aquí
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

  // Acento por marca
  const accentStyle = selectedPlatform
    ? { ["--brand-accent"]: selectedPlatform.color }
    : {};

  return (
    <div className="site">
      <Navbar />

      <main className="py-4">
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button className="btn btn-soft" onClick={() => navigate(-1)}>
              ← Regresar
            </button>
            <h1 className="h5 m-0">Crear grupo</h1>
            <div />
          </div>

          <div className="card shadow-sm group-card" style={accentStyle}>
            <div className="card-body">
              {/* Encabezado amigable */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="brand-dot" aria-hidden />
                <div>
                  <div className="fw-semibold">
                    {selectedPlatform ? selectedPlatform.name : "Selecciona una plataforma"}
                  </div>
                  <div className="text-secondary small">
                    Configura tu grupo, comparte solo con quienes se unan.
                  </div>
                </div>
              </div>

              {err && <div className="alert alert-danger">{err}</div>}

              <form onSubmit={onSubmit} noValidate>
                {/* Plataforma */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Plataforma</label>
                  <select
                    className={`form-select ${touched.platform && errors.platform ? "is-invalid" : ""}`}
                    value={platformKey}
                    onChange={(e) => setPlatformKey(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, platform: true }))}
                    aria-describedby="platformHelp"
                    required
                  >
                    <option value="">Selecciona</option>
                    {PRESETS.map((p) => (
                      <option key={p.key} value={p.key}>{p.name}</option>
                    ))}
                  </select>
                  <div id="platformHelp" className="form-hint">
                    Debe coincidir con las plataformas visibles en el inicio.
                  </div>
                  {touched.platform && errors.platform && (
                    <div className="invalid-feedback">{errors.platform}</div>
                  )}
                </div>

                {/* Plan (si aplica) */}
                {selectedPlatform?.plans?.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Plan</label>
                    <select
                      className={`form-select ${errors.plan ? "is-invalid" : ""}`}
                      value={planKey}
                      onChange={(e) => setPlanKey(e.target.value)}
                      required
                    >
                      {selectedPlatform.plans.map((pl) => (
                        <option key={pl.key} value={pl.key}>{pl.name}</option>
                      ))}
                    </select>
                    {errors.plan && <div className="invalid-feedback">{errors.plan}</div>}
                  </div>
                )}

                {/* Credenciales */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label className="form-label fw-semibold mb-1">Credenciales</label>
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0"
                      onClick={() => setCredentials("correo@servicio.com\ncontraseña123")}
                    >
                      Autocompletar ejemplo
                    </button>
                  </div>
                  <textarea
                    className={`form-control ${touched.credentials && errors.credentials ? "is-invalid" : ""}`}
                    rows={4}
                    placeholder={"correo@servicio.com\ncontraseña123"}
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, credentials: true }))}
                    required
                  />
                  <div className="form-hint">
                    Se mostrarán borrosas a los no-miembros; se desbloquean tras pagar (mock).
                  </div>
                  {touched.credentials && errors.credentials && (
                    <div className="invalid-feedback">{errors.credentials}</div>
                  )}
                </div>

                {/* Notas */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Notas</label>
                  <input
                    className="form-control"
                    placeholder="Reglas o recordatorios (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="form-hint">
                    Por ejemplo: “No cambiar contraseña”, “Avisar antes de renovar”, etc.
                  </div>
                </div>

                {/* Botonera */}
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    className="btn btn-primary"
                    disabled={loading || !isValid}
                    aria-disabled={loading || !isValid}
                  >
                    {loading ? "Creando…" : "Crear grupo"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/groups")}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-3 small text-secondary">
            ¿Necesitas otra plataforma? Agrega primero su tarjeta en el Landing.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
