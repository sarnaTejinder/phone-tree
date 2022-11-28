import { useContext, useMemo, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { FlowContext } from "../context/FlowContext";
import GreetingModal from "./GreetingModal";
import MainNode from "./MainNode";

const Flow = () => {
  const {
    isEmpty,
    showGreetingModal,
    setShowGreetingModal,
    nodes,
    setNodes,
    edges,
    setEdges,
  } = useContext(FlowContext);
  const nodeTypes = useMemo(() => ({ main: MainNode }), [nodes]);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GreetingModal
        onClose={() => setShowGreetingModal(false)}
        show={showGreetingModal}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // onNodesChange={customOnNodeChange}
        // onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        // edgeTypes={edgeTypes}
        // onConnect={onConnect}
        snapToGrid
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flow;
