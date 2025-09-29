import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createGroup } from "../api/groups";
import { getServices } from "../api/services";

export default function GroupNew() {
  const navigate = useNavigate();
  const [platformKey, setPlatformKey] = useState("");
  const [planKey, setPlanKey] = useState("");
  const [credentials, setCredentials] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  //cargar servicios al montar componente
  useEffect(() => {
    async function loadServices() {
      setLoadingServices(true);
      try {
        const servicesData = await getServices(); // ← Usar API centralizada
        setServices(servicesData.services || servicesData || []);
      } catch (error) {
        console.error('Error cargando servicios:', error);
        setErr("Error cargando servicios disponibles");
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    }
    loadServices();
  }, []);

  const selectedService = useMemo(
    () => services.find((s) => s.slug === platformKey) || null,
    [platformKey, services]
  );

  //parsear planes desde JSON String a objeto
  const servicePlans = useMemo(() => {
    if (!selectedService || !selectedService.plans) return [];
    try {
      const plans = typeof selectedService.plans === 'string' 
        ? JSON.parse(selectedService.plans)
        : selectedService.plans;
      
      return Object.entries(plans || {}).map(([key, name]) => ({
        key,
        name
      }));
    } catch (error) {
      console.error('Error parsing plans:', error);
      return [];
    }
  }, [selectedService]);

// si el servicio cambia y tiene planes, prepara el primero
useEffect(() => {
  if (!selectedService) {
    setPlanKey("");
    return;
  }

  if (servicePlans.length > 0) {
    // si el plan actual no existe, selecciona el primero
    if (!servicePlans.find(pl => pl.key === planKey)) {
      setPlanKey(servicePlans[0].key);
    }
  } else {
    setPlanKey("");
  }
}, [selectedService, planKey, servicePlans]);

async function onSubmit(e) {
  e.preventDefault();
  setErr("");

  if (!platformKey) return setErr("Selecciona una plataforma.");
  if (!credentials.trim()) return setErr("Agregar las credenciales.");
  if (servicePlans.length >0 && !planKey) {
    return setErr("Selecciona un plan");
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
  }catch (e) {
    setErr(e.message || "No se pudo crear el grupo.");
  }finally {
    setLoading(false);
  }
}
if (loadingServices) {
  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando servicios...</span>
          </div>
          <p className="mt-2">Cargando servicios...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
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
                  disabled={services.length === 0}
                >
                  <option value="">Selecciona una plataforma</option>
                  {services.map((service) => (
                    <option key={service.slug} value={service.slug}>
                      {service.name} 
                      {service.basePriceMXN && ` - $${service.basePriceMXN} MXN`}
                      {service.slots && ` (${service.slots} slots)`}
                    </option>
                  ))}
                </select>
                {services.length === 0 && (
                  <div className="form-text text-warning">
                    No hay servicios disponibles. Contacta al administrador.
                  </div>
                )}
              </div>

              {/* Información del servicio seleccionado */}
              {selectedService && (
                <div className="alert alert-info">
                  <strong>{selectedService.name}</strong>
                  <br />
                  {selectedService.description}
                  {selectedService.basePriceMXN && (
                    <><br />Precio base: <strong>${selectedService.basePriceMXN} MXN/mes</strong></>
                  )}
                  {selectedService.slots && (
                    <><br />Máximo de miembros: <strong>{selectedService.slots}</strong></>
                  )}
                </div>
              )}

              {/* Plan (si aplica) */}
              {servicePlans.length > 0 && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Plan</label>
                  <select
                    className="form-select"
                    value={planKey}
                    onChange={(e) => setPlanKey(e.target.value)}
                  >
                    <option value="">Selecciona un plan</option>
                    {servicePlans.map((plan) => (
                      <option key={plan.key} value={plan.key}>{plan.name}</option>
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
                  Se mostrarán borrosas a los no-miembros; se desbloquean tras pagar.
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
                <button className="btn btn-primary" disabled={loading || services.length === 0}>
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