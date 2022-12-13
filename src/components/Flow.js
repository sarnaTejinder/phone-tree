import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Panel,
  updateEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { FlowContext } from "../context/FlowContext";
import { calculateCenter } from "../utils/tree";
import ButtonEdge from "./ButtonEdge";
import Control from "./Control";
import EmptyNode from "./EmptyNode";
import GreetingModal from "./GreetingModal";
import MainNode from "./MainNode";
import Node from "./Node";
import NodesLogger from "./NodesLogger";
import SidePanel from "./SidePanel";

const nodeTypes = { main: MainNode, empty: EmptyNode, node: Node };
const edgeTypes = { buttonedge: ButtonEdge };

const Flow = () => {
  const {
    isEmpty,
    showGreetingModal,
    setShowGreetingModal,
    nodes: initialNodes,
    setNodes: setNodesCtx,
    edges: initialEdges,
    setEdges: setEdgesCtx,
    nextId,
    setCurrNode,
    hasEmpty,
    random: initRandom,
  } = useContext(FlowContext);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([initialEdges]);
  const [random, setRandom] = useState();

  useEffect(() => {
    setNodes(initialNodes);
    setRandom(Math.random() * 10000);
  }, [initialNodes, setNodes, initRandom]);

  useEffect(() => {
    setEdges(initialEdges);
    setRandom(Math.random() * 10000);
  }, [initialEdges, setEdges, initRandom]);

  const { project, fitView, getIntersectingNodes, setCenter } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      // if (!reactFlowWrapper.current) return;
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane && !hasEmpty) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = `${nextId}`;

        const newNode = {
          id,
          // we are removing the half of the node width (75) to center the new node
          position: project({
            x: event.clientX - left - 200,
            y: event.clientY - top,
          }),
          data: {
            index: nextId,
            parent: JSON.parse(connectingNodeId.current),
            type: "empty",
          },
          type: "empty",
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id,
            source: connectingNodeId.current,
            target: id,
            animated: true,
          })
        );
        setCurrNode({
          index: nextId,
          type: "empty",
          parent: JSON.parse(connectingNodeId.current),
        });
      }
    },
    [project, nextId, setEdges, setNodes, setCurrNode, hasEmpty]
  );

  const deleteEmptyNode = (index) => {
    const filteredNodes = nodes.filter((node) => node.id !== `${index}`);
    // const filteredEdges = edges.filter(edge=>edge.id )
    setNodes(filteredNodes);
    setCurrNode(null);
  };

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  const onNodeDrag = useCallback((_, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        data: {
          ...n.data,
          className: intersections.includes(n.id) ? "highlight" : "",
        },
      }))
    );
  }, []);

  useEffect(() => {
    let t = setTimeout(() => {
      fitView({ padding: 0.2, duration: 800 });
    }, 200);

    return () => clearTimeout(t);
    // if (!isEmpty) {
    //   setCenter(nodes[0]?.position?.x || 0);
    // } else {
    //   setCenter(0);
    // }
  }, [nodes, edges, fitView, initRandom]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <GreetingModal
        onClose={() => setShowGreetingModal(false)}
        show={showGreetingModal}
      />
      <NodesLogger />
      <SidePanel
        deleteEmptyNode={deleteEmptyNode}
        setCenter={() => fitView({ duration: 800 })}
      />
      <div style={{ height: "100%", width: "100%" }} ref={reactFlowWrapper}>
        <ReactFlow
          style={{ background: "#E5E5E5" }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          // onNodesChange={customOnNodeChange}
          // onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeDrag={onNodeDrag}
          edgeTypes={edgeTypes}
          // onConnect={onConnect}
          // snapToGrid
          onEdgeUpdate={onEdgeUpdate}
          fitView
          deleteKeyCode={null}
        >
          <Panel position="top-center">
            <Control />
          </Panel>
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default Flow;
