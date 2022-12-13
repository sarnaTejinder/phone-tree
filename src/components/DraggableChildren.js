import { useContext, useMemo } from "react";
import { Button } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FlowContext } from "../context/FlowContext";
import { Container } from "./Container";

export default function DraggableChildren() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
    </div>
  );
}
