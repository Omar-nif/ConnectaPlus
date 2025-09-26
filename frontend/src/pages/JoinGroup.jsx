import React, { useState, useEffect } from "react";   
import { useParams, useNavigate } from "react-router-dom";  
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JoinGroupModal from "../components/JoinModal";
import { getPublicGroup } from "../api/groups";

export default function JoinGroup() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
      let cancel = false;
      (async () => {
        try {
          const data = await getPublicGroup(id);
          if (!cancel) setGroup(data);
          console.log("📦 Datos del grupo:", data); // ← Debug
        } catch (e) {
          console.error(e);
        } finally {
          if (!cancel) setLoading(false);
        }
      })();
      return () => { cancel = true; }
    }, [id]);
  
    const handleAccept = () => {
      setShowModal(false);
      // Aquí iría la lógica para Stripe / pago
      console.log("Ir a pago de Stripe para el grupo", group.id);
    };
  
    if (loading) return <div className="alert alert-info m-4">Cargando…</div>;
    if (!group) return <div className="alert alert-danger m-4">Grupo no encontrado</div>;

    // Mapeo de campos
    const serviceName = group.service?.name || group.platformName;
    const ownerName = group.owner?.name || group.ownerName || "Anónimo";
    const price = group.pricePerMember || group.price || group.basePriceMXN;
    const planName = group.planKey ? ` · ${group.planKey}` : "";
  
    return (
      <div className="site">
        <Navbar />
        <main className="container py-5" style={{ maxWidth: 600 }}>
          <h2>{serviceName}{planName}</h2>
  
          <div className="card mb-3 p-3 shadow-sm">
            <h5>Grupo de {ownerName}</h5>
            <p>Precio por miembro: <strong>${price} MXN/mes</strong></p>
            {group.slots && <p>Slots disponibles: {group.slots}</p>}
            {group.service?.description && (
              <p className="text-muted">{group.service.description}</p>
            )}
          </div>
  
          <div className="card mb-3 p-3 shadow-sm bg-warning-subtle">
            <h6>Información importante</h6>
            <p>Al unirte, obtendrás acceso a las credenciales compartidas después del pago.</p>
            {group.notes && (
              <p className="mt-2"><strong>Notas del dueño:</strong> {group.notes}</p>
            )}
          </div>
  
          <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
            Unirse por ${price} MXN/mes
          </button>
        </main>
        <Footer />
  
        <JoinGroupModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          handleAccept={handleAccept}
          group={group}
        />
      </div>
    );
  }