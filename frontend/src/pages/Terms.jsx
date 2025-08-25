import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  const navigate = useNavigate();
  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container" style={{ maxWidth: 900 }}>
          <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
            ← Regresar
          </button>

          <h1 className="h3">Términos y Condiciones</h1>
          <p className="text-secondary">Última actualización: 2025-08-23</p>
          <hr />

          <h6>1. Aceptación</h6>
          <p>
            Al utilizar Connecta+ aceptas estos Términos y las políticas
            relacionadas. Si no estás de acuerdo, no uses el servicio.
          </p>

          <h6>2. Uso del servicio</h6>
          <p>
            Connecta+ facilita la organización de grupos y pagos entre usuarios.
            No vendemos cuentas ni contenidos. El uso de cada plataforma está
            sujeto a sus propios Términos y condiciones.
          </p>

          <h6>3. Cuentas y seguridad</h6>
          <p>
            Eres responsable de la confidencialidad de tus credenciales y de
            toda actividad realizada con tu cuenta.
          </p>

          <h6>4. Pagos y reembolsos (MVP)</h6>
          <p>
            Los pagos se procesan a través de terceros. En el MVP, se simula el
            flujo de pago. Las políticas de reembolso pueden variar por caso.
          </p>

          <h6>5. Contenido y conductas</h6>
          <p>
            No publiques información ilegal, ofensiva o que infrinja derechos de
            terceros. Podemos moderar o suspender cuentas ante incumplimientos.
          </p>

          <h6>6. Limitación de responsabilidad</h6>
          <p>
            El servicio se ofrece “tal cual”. En la medida permitida por ley,
            Connecta+ no será responsable por daños indirectos o consecuenciales.
          </p>

          <h6>7. Cambios</h6>
          <p>
            Podemos actualizar estos Términos. Te notificaremos los cambios
            relevantes a través del sitio o por correo.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
