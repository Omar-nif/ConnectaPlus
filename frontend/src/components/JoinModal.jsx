import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function JoinGroupModal({ show, handleClose, handleAccept, group }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar unión al grupo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Acepto unirme al grupo de <strong>{group.owner}</strong> por <strong>${group.price} al mes</strong>.
        </p>
        <p>
          Connecta+ no se hace responsable de bloqueos de la cuenta.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Rechazar
        </Button>
        <Button variant="primary" onClick={handleAccept}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
