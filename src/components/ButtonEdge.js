import React, { useContext } from "react";
import { getBezierPath, MarkerType } from "reactflow";
import { FlowContext } from "../context/FlowContext";

import "./index.css";

const foreignObjectSize = 40;

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd = MarkerType.ArrowClosed,
  source,
  target,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { addChildAtIndex, hasEmpty, nodes } = useContext(FlowContext);

  const onEdgeClick = (evt) => {
    let x = nodes[parseInt(source)].data.children.indexOf(parseInt(target));
    addChildAtIndex(parseInt(source), x + 1, { type: "empty" });
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={MarkerType.ArrowClosed}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button
            className="edgebutton"
            onClick={(event) => onEdgeClick(event, id)}
            disabled={hasEmpty}
          >
            <span>+</span>
          </button>
        </div>
      </foreignObject>
    </>
  );
}
