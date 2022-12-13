import { useContext, useEffect, useState } from "react";
import { Handle, Position, useStore } from "reactflow";
import TEAM_MEMBERS from "../constants/teamMembers";
import TYPES from "../constants/types";
import { FlowContext } from "../context/FlowContext";

const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function Node({ data, id }) {
  const { setCurrNode, getNum, currNode, addChild } = useContext(FlowContext);
  useEffect(() => {
    getNum(data.index);
  });
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };
  const label =
    isTarget ||
    (data.value === TYPES[1].value && data.className === "highlight")
      ? "Drop here"
      : data.label;

  const addNewChild = () => {
    addChild(data.index, {}, { type: "empty" });
  };

  return (
    <div>
      <div
        style={{
          minHeight: 50,
          maxHeight: 200,
          minWidth: 200,
          maxWidth: 200,
          border:
            currNode.index === data.index ||
            (data.value === TYPES[1].value && data.className === "highlight")
              ? "2px solid #3B71CA"
              : "1px solid #eee",
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
            <label
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
              <Handle type="target" position={Position.Top} />
              Press {data.num}
            </label>
          </>
        )}
        <div
          style={{ display: "flex", flexDirection: "column", paddingTop: 10 }}
        >
          <span style={{ fontSize: 12 }}>{label}</span>
          <span style={{ fontSize: 10 }} className="text-muted">
            {data.value === TYPES[2].value
              ? `${TEAM_MEMBERS[data.user].name} - ${
                  TEAM_MEMBERS[data.user].number
                }`
              : data.text}
          </span>
        </div>
      </div>
      {data.value === TYPES[1].value && (
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
      )}
    </div>
  );
}
