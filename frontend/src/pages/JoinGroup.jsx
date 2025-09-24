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
  
    return (
      <div className="site">
        <Navbar />
        <main className="container py-5" style={{ maxWidth: 600 }}>
          <h2>{group.service} - Plan {group.plan}</h2>
  
          <div className="card mb-3 p-3 shadow-sm">
            <h5>Grupo de {group.ownerName}</h5>
            <p>Precio: ${group.price} al mes</p>
          </div>
  
          <div className="card mb-3 p-3 shadow-sm bg-warning-subtle">
            <h6>Información importante</h6>
            <p>{group.accessInfo || "Acceso mediante credenciales"}</p>
          </div>
  
          <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>
            Unirse
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