import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div className="site">
      <Navbar />
      <main className="py-4">
        <div className="container" style={{ maxWidth: 900 }}>
          <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
            ← Regresar
          </button>

          <h1 className="h3">Política de Privacidad</h1>
          <p className="text-secondary">Última actualización: 2025-08-23</p>
          <hr />

          <h6>1. Datos que recopilamos</h6>
          <p>
            Nombre, correo y metadatos de uso del servicio. En producción,
            los pagos se gestionarían por un proveedor externo (p. ej. Stripe).
          </p>

          <h6>2. Uso de la información</h6>
          <p>
            Usamos la información para operar el servicio, prevención de fraude,
            soporte y mejoras del producto.
          </p>

          <h6>3. Base legal</h6>
          <p>
            Procesamos datos con tu consentimiento y para cumplir el contrato de
            prestación del servicio.
          </p>

          <h6>4. Conservación</h6>
          <p>
            Conservamos los datos solo el tiempo necesario para las finalidades
            descritas o por requerimientos legales.
          </p>

          <h6>5. Compartición</h6>
          <p>
            Podemos compartir datos con proveedores (p. ej. hosting, correo) bajo
            acuerdos de confidencialidad. No vendemos tu información personal.
          </p>

          <h6>6. Seguridad</h6>
          <p>
            Implementamos medidas técnicas y organizativas razonables para
            proteger tus datos. Ningún sistema es 100% infalible.
          </p>

          <h6>7. Tus derechos</h6>
          <p>
            Puedes solicitar acceso, rectificación o eliminación de tus datos.
            Escríbenos mediante el canal de soporte.
          </p>

          <h6>8. Cambios</h6>
          <p>
            Podremos actualizar esta política. Publicaremos la versión vigente en
            este sitio.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
