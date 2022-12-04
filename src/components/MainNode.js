import { useContext } from "react";
import { Handle, Position } from "reactflow";
import TYPES from "../constants/types";
import { FlowContext } from "../context/FlowContext";

const MainNode = ({ data, id }) => {
  const { setShowGreetingModal, setCurrNode, currNode } =
    useContext(FlowContext);

  const label =
    data.value === TYPES[0].value && data.className === "highlight"
      ? "Drop here"
      : data.label;

  return (
    <div
      style={{
        minHeight: 50,
        maxHeight: 200,
        minWidth: 200,
        maxWidth: 200,
        border:
          currNode.index === data.index ||
          (data.value === TYPES[0].value && data.className === "highlight")
            ? "2px solid #3B71CA"
            : "1px solid #eee",
        padding: 5,
        borderRadius: 5,
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
      onClick={() => {
        data.text ? setCurrNode(data) : setShowGreetingModal(true);
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 12 }}>{label}</span>
        <span style={{ fontSize: 10 }} className="text-muted">
          {data.text}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default MainNode;
