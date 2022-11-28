import { useContext, useState } from "react";
import { Handle, Position } from "reactflow";
import { FlowContext } from "../context/FlowContext";

const MainNode = ({ data }) => {
  const { setShowGreetingModal } = useContext(FlowContext);
  return (
    <div
      style={{
        minHeight: 50,
        maxHeight: 200,
        minWidth: 200,
        maxWidth: 200,
        border: "1px solid #eee",
        padding: 5,
        borderRadius: 5,
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
      onClick={() => {
        data.text ? console.log() : setShowGreetingModal(true);
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontSize: 12 }}>{data.label}</span>
        <span style={{ fontSize: 10 }} className="text-muted">
          {data.text}
        </span>
      </div>
      {!data.last && <Handle type="source" position={Position.Bottom} id="a" />}
    </div>
  );
};

export default MainNode;
