import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import TYPES from "../constants/types";
import getTree from "../utils/tree";
import useDraft from "../utils/useDraft";

export const FlowContext = createContext({});

const mainNode = {
  id: "0",
  label: "Main Greeting",
  level: 0,
  index: 0,
  value: TYPES[0].value,
  type: 0,
  children: [1],
};

export const FlowProvider = ({ children }) => {
  const [enabled, setEnabled] = useState(true);
  const [nodes, setNodes] = useState([
    {
      id: "0",
      label: "Main Greeting",
      text: "Welcome to Fieldpulse!",
      level: 0,
      index: 0,
      value: TYPES[0].value,
      relIndex: 0,
      type: 0,
      nodeType: "main",
      children: [1],
      parent: null,
    },
    {
      id: "1",
      label: "English",
      level: 1,
      index: 1,
      value: TYPES[1].value,
      type: 1,
      text: "Welcome to Fieldpulse!",
      children: [3, 4],
      nodeType: "node",
      relIndex: 0,
      parent: 0,
      num: 1,
    },
    {
      id: "2",
      label: "Spanish",
      level: 1,
      index: 2,
      value: TYPES[1].value,
      type: 1,
      text: "Welcome to Fieldpulse!",
      children: [],
      nodeType: "node",
      relIndex: 1,
      parent: null,
      num: 2,
    },
    {
      id: "3",
      label: "hmm",
      level: 2,
      index: 3,
      value: TYPES[3].value,
      type: 1,
      text: "Welcome to Fieldpulse!",
      children: [],
      nodeType: "node",
      parent: 1,
      num: 1,
      relIndex: 0,
    },
    {
      id: "4",
      label: "English",
      level: 2,
      index: 4,
      value: TYPES[3].value,
      type: 1,
      text: "Welcome to Fieldpulse!",
      children: [],
      nodeType: "node",
      parent: 1,
      num: 1,
      relIndex: 1,
    },
  ]);
  const [nodesWithEmpty, setNodesWithEmpty] = useState([]);
  const [edges, setEdges] = useState([]);
  const isEmpty = useMemo(() => true, []);
  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);
  const [random, setRandom] = useState();

  const [currNode, setCurrNode] = useState(null);
  const [showGreetingModal, setShowGreetingModal] = useState(false);

  const { draft, dirty, changed, updateDraft, resetDraft } = useDraft({
    ...currNode,
  });

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
    let data = {
      ...nodeData,
      level: parent.level + 1,
      id: newIndex,
      parent: parentIndex,
    };
    arr.push(data);
    setNodes(arr);
    calcNodes();
  };

  const addChildAtIndex = (parentIndex, index, nodeData) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const newIndex = arr.length;
    parent.children.splice(index, 0, newIndex);
    let data = {
      ...nodeData,
      level: parent.level + 1,
      id: newIndex,
      parent: parentIndex,
    };
    arr.push(data);
    setNodes(arr);
    calcNodes();
  };

  const moveChildToIndex = (parentIndex = 0, fromIndex = 0, toIndex = 1) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const element = parent.children[fromIndex];
    parent.children.splice(fromIndex, 1);
    parent.children.splice(toIndex, 0, element);
    setNodes(arr);
    calcNodes();
  };

  // const editData = (index, data) => {
  //   let arr = nodes;
  //   let curr = arr[index];
  //   curr.data = { ...curr.data, ...data };
  //   setNodes(arr);
  //   setRandom(Math.random() * 10000);
  // };

  const editData = () => {
    let arr = nodes;
    arr[currNode.index] = { ...arr[currNode.index], ...draft };
    setNodes(arr);
    resetDraft();
    setCurrNode(nodes[currNode.index]);
    calcNodes();
  };

  const removeChild = (parentIndex, index) => {
    let arr = nodes;
    arr.splice(index, 1);
    const parent = arr[parentIndex];
    const filteredChildren = parent.children.filter((i) => i !== index);
    parent.children = filteredChildren;
    setNodes(arr);
    calcNodes();
  };

  const removeEdge = (parentIndex, index) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const filteredChildren = parent.children.filter((i) => i !== index);
    parent.children = filteredChildren;
    delete arr[index].parent;
    setNodes(arr);
    calcNodes();
  };

  const addEdge = (parentIndex, index) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    parent.children.push(index);
    arr[index].parent = parentIndex;
    setNodes(arr);
    calcNodes();
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
    calcNodes();
  };

  const removeNode = (index) => {
    let arr = nodes;
    let curr = arr[index];
    for (let i = 0; i < curr.children.length; i++) {
      let child = curr.children[i];
      arr[child].parent = null;
    }
    if (curr.parent !== null) {
      arr[curr.parent].children = arr[curr.parent].children.filter(
        (node) => node !== index
      );
    }
    arr.splice(index, 1);

    setNodes(arr);
    setCurrNode(null);
    calcNodes();
  };

  useEffect(() => {
    calcNodes();
  }, [nodes]);

  const calcNodes = () => {
    const { nodes: formattedNodes, edges } = getTree(nodes);
    setFlowNodes(formattedNodes);
    setFlowEdges(edges);
  };

  const getNum = (index) => {
    let curr = nodes[index];
  };

  // useEffect(() => {}, [currNode]);

  return (
    <FlowContext.Provider
      value={{
        enabled,
        setEnabled,
        nodes: flowNodes,
        setNodes,
        edges: flowEdges,
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
        currNode: { ...currNode, ...draft },
        setCurrNode,
        nodesWithEmpty,
        setNodesWithEmpty,
        nextId: nodes.length,
        removeNode,
        updateData: updateDraft,
        dirty,
        getNum,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};
