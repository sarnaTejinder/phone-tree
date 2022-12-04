import { useContext, useEffect, useState } from "react";
import { Handle, Position, useStore } from "reactflow";
import TYPES from "../constants/types";
import { FlowContext } from "../context/FlowContext";

const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function Node({ data, id, className }) {
  const { setCurrNode, getNum } = useContext(FlowContext);
  useEffect(() => {
    getNum(data.index);
  });
  const connectionNodeId = useStore(connectionNodeIdSelector);
  console.log(connectionNodeId);
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };
  const label =
    isTarget ||
    (data.value === TYPES[1].value && data.className === "highlight")
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
          data.value === TYPES[1].value && data.className === "highlight"
            ? "2px solid #3B71CA"
            : "1px #eee",
        borderStyle: isTarget ? "dashed" : "solid",
        padding: 5,
        borderRadius: 5,
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        // position: "relative",
      }}
      onClick={() => {
        setCurrNode(data);
      }}
    >
      {data.num && (
        <>
          <Handle type="target" position={Position.Top} />
          {/* <label
            htmlFor="text"
            className=" btn btn-primary"
            style={{
              position: "absolute",
              top: -16,
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 5,
              zIndex: 2000,
            }}
          >
            Press {data.num}
          </label> */}
        </>
      )}
      <div>
        <span style={{ fontSize: 12 }}>{label}</span>
      </div>
      {data.value === TYPES[1].value && (
        <Handle
          type="source"
          style={targetHandleStyle}
          position={Position.Bottom}
          id="a"
        />
      )}
    </div>
  );
}
