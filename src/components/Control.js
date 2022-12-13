import { useContext } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { FlowContext } from "../context/FlowContext";

export default function Control() {
  const { getJson } = useContext(FlowContext);
  return (
    <ButtonGroup>
      <Button style={{ marginRight: 10 }} className="mr-2">
        Save
      </Button>
      <Button style={{ marginRight: 10 }} variant="success" onClick={getJson}>
        Get JSON
      </Button>
      <Button variant="light">Undo</Button>
    </ButtonGroup>
  );
}
