import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const GreetingModal = ({ onClose, show }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal size="lg" centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Main Greeting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Greeting Message</Form.Label>
            <Form.Control as="textarea" rows={2} placeholder="Enter message" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Start Building Phone Tree
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GreetingModal;
