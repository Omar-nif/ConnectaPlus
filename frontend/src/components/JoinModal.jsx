import React, { useState } from "react";
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
}