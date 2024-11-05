// ConfirmModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, handleClose, handleConfirm, message }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {
          typeof message === 'string' && message.includes("can't") ? '' : (
            <Button variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          )
        }
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
