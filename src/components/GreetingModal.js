import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FlowContext } from "../context/FlowContext";

const GreetingModal = ({ onClose, show }) => {
  const [greeting, setGreeting] = useState("");
  const { addMain, setShowGreetingModal } = useContext(FlowContext);

  const handleSubmit = () => {
    addMain(greeting);
    setShowGreetingModal(false);
  };

  return (
    <Modal size="md" centered show={show}>
      <Modal.Header>
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
