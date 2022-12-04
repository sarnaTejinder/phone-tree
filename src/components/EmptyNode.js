import { useContext } from "react";
import { Handle, Position } from "reactflow";
import { FlowContext } from "../context/FlowContext";

export default function EmptyNode({ data }) {
  const { setCurrNode } = useContext(FlowContext);
  return (
    <div
      style={{
        minHeight: 50,
        maxHeight: 200,
        minWidth: 200,
        maxWidth: 200,
        border: "2px dashed #9FA6B2",
        padding: 5,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        fontSize: 24,
      }}
      className="btn btn-light text-muted"
      onClick={() => {
        setCurrNode(data);
      }}
    >
      <Handle type="target" position={Position.Top} />+
    </div>
  );
}
