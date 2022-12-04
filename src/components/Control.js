import { Button, ButtonGroup } from "react-bootstrap";

export default function Control() {
  return (
    <ButtonGroup>
      <Button style={{ marginRight: 10 }} className="mr-2">
        Save
      </Button>
      {/* <Button style={{ marginRight: 10 }} variant="dark">
        Light Mode
      </Button> */}
      <Button variant="light">Undo</Button>
    </ButtonGroup>
  );
}
