import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export default function HomePage() {
  const [name, setName] = useState(localStorage.getItem("user_name") || "");
  const [groupsCount, setGroupsCount] = useState(0);

  const userId = localStorage.getItem("user_id") || null;

  // Carga nombre
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const n = json?.data?.name;
        if (n) {
          setName(n);
          localStorage.setItem("user_name", n);
        }
      })
      .catch(() => {});
  }, []);

  // Calcula # de grupos del dueño actual
  const computeMyGroupsCount = () => {
    const all = JSON.parse(localStorage.getItem("groups") || "[]");
    return all.filter((g) => String(g.ownerId ?? "") === String(userId)).length;
  };

  // Mantén el contador actualizado
  useEffect(() => {
    const update = () => setGroupsCount(computeMyGroupsCount());
    update(); // inicial

    const onStorage = (e) => {
      if (e.key === "groups") update();
    };
    const onGroupsChange = () => update();

    window.addEventListener("storage", onStorage);
    window.addEventListener("groups:change", onGroupsChange);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("groups:change", onGroupsChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="site">
      <Navbar />

      <main className="home">
        <section className="home-hero">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-12">
                <span className="badge text-bg-primary">Bienvenido</span>
                <h1 className="display-5 fw-bold mt-3">
                  Hola{ name ? `, ${name}` : "" } 👋
                </h1>
                <p className="lead mt-2 text-white-70">
                  Administra tus grupos y suscripciones. Explora nuevas
                  plataformas y controla tus pagos desde un solo lugar.
                </p>
                <div className="d-flex gap-2 mt-3">
                  <a href="/groups/new" className="btn btn-light">Crear grupo</a>
                  <a href="/groups" className="btn btn-outline-light">Explorar plataformas</a>
                </div>

                <div className="home-quick mt-4">
                  <a className="home-chip" href="/groups">Mis grupos</a>
                  <a className="home-chip" href="/payments">Pagos</a>
                  <a className="home-chip" href="/profile">Perfil</a>
                  <a className="home-chip" href="/help">Ayuda</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              <div className="col-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="fw-bold m-0">Mis grupos</h5>
                      <span className="badge text-bg-light border">
                        {groupsCount} activos
                      </span>
                    </div>
                    <p className="text-secondary mt-2">
                      Crea, invita y gestiona cupos y membresías.
                    </p>
                    <a href="/groups" className="btn btn-outline-primary btn-sm">Ir a grupos</a>
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="fw-bold m-0">Explorar plataformas</h5>
                    <p className="text-secondary mt-2">
                      Netflix, Spotify, Game Pass, Adobe y más.
                    </p>
                    <a href="/groups" className="btn btn-outline-primary btn-sm">Explorar</a>
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="fw-bold m-0">Pagos</h5>
                    <p className="text-secondary mt-2">
                      Ver historial, pendientes y métodos guardados.
                    </p>
                    <a href="/payments" className="btn btn-outline-primary btn-sm">Ver pagos</a>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="fw-bold m-0">Actividad reciente</h6>
                    <div className="table-responsive mt-3">
                      <table className="table m-0">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Evento</th>
                            <th>Detalle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>—</td>
                            <td>Sin actividad</td>
                            <td>Aún no hay registros</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-end mt-2">
                      <a className="small link-primary" href="/activity">Ver todo</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h6 className="fw-bold m-0">Centro de seguridad</h6>
                    <ul className="mt-3 text-secondary">
                      <li>Verifica tu correo y activa alertas</li>
                      <li>Configura 2FA (próximamente)</li>
                      <li>Revisa inicios de sesión recientes</li>
                    </ul>
                    <a href="/security" className="btn btn-outline-primary btn-sm">Ir a seguridad</a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
