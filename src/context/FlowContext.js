import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  const [isScratch, setIsScratch] = useState(true);
  const [nodes, setNodes] = useState([
    {
      id: "0",
      label: "Main Greeting",
      children: [1, 2, 3],
      type: "main",
    },
    "hello",
    "world",
    "nigga",
  ]);
  const [edges, setEdges] = useState([]);
  const isEmpty = useMemo(() => true, []);
  const [showGreetingModal, setShowGreetingModal] = useState(isEmpty);

  const addMain = useCallback(
    (text) => {
      const arr = nodes;
      arr.push({
        id: "0",
        data: {
          label: "Main Greeting",
          text,
          children: [],
        },
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
    arr.push(nodeData);
    setNodes(arr);
  };

  const addChildAtIndex = (parentIndex, index, nodeData) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const newIndex = arr.length;
    parent.children.splice(index, 0, newIndex);
    arr.push(nodeData);
    setNodes(arr);
  };

  const moveChildToIndex = (parentIndex = 0, fromIndex = 0, toIndex = 1) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const element = parent.children[fromIndex];
    parent.children.splice(fromIndex, 1);
    console.log(parent.children);
    parent.children.splice(toIndex, 0, element);
    console.log(parent.children);
    setNodes(arr);
  };

  const editData = (index, data) => {
    let arr = nodes;
    let curr = arr[index];
    curr.data = data;
    setNodes(arr);
  };

  return (
    <FlowContext.Provider
      value={{
        enabled,
        setEnabled,
        isScratch,
        setIsScratch,
        nodes: isEmpty ? [mainNode] : nodes,
        setNodes,
        edges,
        setEdges,
        isEmpty,
        showGreetingModal: showGreetingModal,
        setShowGreetingModal,
        addMain,
        addChild,
        addChildAtIndex,
        editData,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};
