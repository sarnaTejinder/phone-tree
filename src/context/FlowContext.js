import { createContext, useCallback, useMemo, useState } from "react";
import TYPES from "../constants/types";

export const FlowContext = createContext({});

const mainNode = {
  id: "0",
  position: { x: 0, y: 0 },
  data: {
    label: "Main Greeting",
  },
  type: "main",
};

export const FlowProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(true);
  const [nodes, setNodes] = useState([
    {
      id: "0",
      label: "Main Greeting",
      children: [1, 2, 3],
      level: 0,
      type: TYPES[0].value,
    },
  ]);
  const [edges, setEdges] = useState([]);
  const isEmpty = useMemo(() => true, []);
  const [showGreetingModal, setShowGreetingModal] = useState(isEmpty);

  const addMain = useCallback(
    (text) => {
      const arr = nodes;
      arr.push({
        id: "0",
        label: "Main Greeting",
        text,
        children: [],
        level: 0,
        type: "main",
      });
      setNodes(arr);
    },
    [nodes]
  );

  const addChild = (parentIndex, nodeData) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const newIndex = arr.length;
    parent.children.push(newIndex);
    let data = { ...nodeData, level: parent.level + 1 };
    arr.push(data);
    setNodes(arr);
  };

  const addChildAtIndex = (parentIndex, index, nodeData) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const newIndex = arr.length;
    parent.children.splice(index, 0, newIndex);
    let data = { ...nodeData, level: parent.level + 1 };
    arr.push(data);
    setNodes(arr);
  };

  const moveChildToIndex = (parentIndex = 0, fromIndex = 0, toIndex = 1) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const element = parent.children[fromIndex];
    parent.children.splice(fromIndex, 1);
    parent.children.splice(toIndex, 0, element);
    setNodes(arr);
  };

  const editData = (index, data) => {
    let arr = nodes;
    let curr = arr[index];
    curr.data = data;
    setNodes(arr);
  };

  const removeChild = (parentIndex, index) => {
    let arr = nodes;
    arr.splice(index, 1);
    const parent = arr[parentIndex];
    const filteredChildren = parent.children.filter((i) => i !== index);
    parent.children = filteredChildren;
    setNodes(arr);
  };

  const removeEdge = (parentIndex, index) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const filteredChildren = parent.children.filter((i) => i !== index);
    parent.children = filteredChildren;
    setNodes(arr);
  };

  const addEdge = (parentIndex, index) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    parent.children.push(index);
    setNodes(arr);
  };

  const updateType = (index, newType) => {
    let arr = nodes;
    let curr = arr[index];
    if (curr.type === newType) return;
    if (
      (newType !== TYPES[1].value || newType !== TYPES[0].value) &&
      curr.children.length > 0
    ) {
      curr.children = [];
    }
    curr.type = newType;
    setNodes(arr);
  };

  return (
    <FlowContext.Provider
      value={{
        enabled,
        setEnabled,
        nodes: isEmpty ? [mainNode] : nodes,
        setNodes,
        edges,
        setEdges,
        isEmpty,
        showGreetingModal,
        setShowGreetingModal,
        addMain,
        addChild,
        addChildAtIndex,
        moveChildToIndex,
        editData,
        removeChild,
        removeEdge,
        addEdge,
        updateType,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};
