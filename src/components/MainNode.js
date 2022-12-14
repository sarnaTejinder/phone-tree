import { useContext } from "react";
import { Handle, Position } from "reactflow";
import TYPES from "../constants/types";
import { FlowContext } from "../context/FlowContext";

const MainNode = ({ id, data }) => {
  const { setShowGreetingModal, setCurrNode, currNode, addChild, nextId } =
    useContext(FlowContext);

  const label =
    data.value === TYPES[0].value && data.className === "highlight"
      ? "Drop here"
      : data.label;

  const addNewChild = () => {
    addChild(data.index, {}, { type: "empty" });
  };

  return (
    <>
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
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{
          background: "#fff",
          border: "1px solid black",
          bottom: -7,
          width: 15,
          height: 15,
          fontSize: 12,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 2,
        }}
        onClick={addNewChild}
      >
        +
      </Handle>
    </>
  );
};

export default MainNode;
