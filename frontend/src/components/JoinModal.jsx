import React, { useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function JoinGroupModal({ show, handleClose, group }) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const serviceName = group.service?.name || group.platformName || "Servicio";
  const ownerName = group.owner?.name || "el propietario";
  const price = group.pricePerMember || group.basePriceMXN || 0;
  const planInfo = group.planKey ? ` (Plan ${group.planKey})` : "";

  // Función para manejar el pago
  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      console.log("Iniciando proceso de pago para grupo:", group.id);

      // 1. Validar que el usuario esté autenticado
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Debes iniciar sesión para unirte a un grupo');
      }

      // 2. Crear sesión de checkout en el backend
      const response = await fetch('http://localhost:4000/api/stripe/checkout/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ groupId: group.id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Error del servidor');
      }

      console.log("Sesión creada:", data.data.sessionId);

      // 3. Redirigir a Stripe Checkout
      const stripe = await stripePromise;
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.data.sessionId
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

    } catch (error) {
      console.error('Error en el pago:', error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar unión al grupo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <p>
          ¿Deseas unirte al grupo de <strong>{ownerName}</strong> para <strong>{serviceName}{planInfo}</strong>?
        </p>
        
        <div className="alert alert-info">
          <strong>Precio:</strong> ${price} MXN al mes
          {group.slots && <><br /><strong>Slots disponibles:</strong> {group.slots}</>}
        </div>

        <p className="text-muted">
          <small>
             <strong>Importante:</strong> Al aceptar, serás redirigido al proceso de pago. 
            Una vez confirmado el pago, obtendrás acceso a las credenciales compartidas.
          </small>
        </p>

        <div className="alert alert-warning">
          <small>
             <strong>Conecta+ no se hace responsable</strong> de bloqueos de la cuenta 
            por parte del proveedor del servicio. Te recomendamos seguir las reglas del grupo 
            y mantener la confidencialidad de las credenciales.
          </small>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={processing}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Procesando...
            </>
          ) : (
            `Pagar $${price} MXN/mes`
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
/*import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function JoinGroupModal({ show, handleClose, handleAccept, group }) {

  const serviceName = group.service?.name || group.platformName || "Servicio";
  const ownerName = group.owner?.name || group.ownerName || "el propietario";
  const price = group.pricePerMember || group.price || group.basePriceMXN || 0;
  const planInfo = group.planKey ? ` (Plan ${group.planKey})` : "";

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar unión al grupo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          ¿Deseas unirte al grupo de <strong>{ownerName}</strong> para <strong>{serviceName}{planInfo}</strong>?
        </p>
        
        <div className="alert alert-info">
          <strong>Precio:</strong> ${price} MXN al mes
          {group.slots && <><br /><strong>Slots disponibles:</strong> {group.slots}</>}
        </div>

        <p className="text-muted">
          <small>
             <strong>Importante:</strong> Al aceptar, serás redirigido al proceso de pago. 
            Una vez confirmado el pago, obtendrás acceso a las credenciales compartidas.
          </small>
        </p>

        <div className="alert alert-warning">
          <small>
             <strong>Conecta+ no se hace responsable</strong> de bloqueos de la cuenta 
            por parte del proveedor del servicio. Te recomendamos seguir las reglas del grupo 
            y mantener la confidencialidad de las credenciales.
          </small>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAccept}>
          Aceptar y proceder al pago
        </Button>
      </Modal.Footer>
    </Modal>
  );
}*/