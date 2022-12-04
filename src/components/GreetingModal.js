import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const GreetingModal = ({ onClose, show }) => {
  const [greeting, setGreeting] = useState("");
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {};

  return (
    <Modal size="lg" centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Main Greeting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Greeting Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Welcome to Fieldpulse!"
              value={greeting}
              onInput={(e) => setGreeting(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={greeting.length < 1}
        >
          Start Building Phone Tree
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GreetingModal;
