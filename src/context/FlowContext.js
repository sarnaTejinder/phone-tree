import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import TYPES from "../constants/types";
import { getLayoutedElements } from "../utils/getLayoutedElements";
import getTree from "../utils/tree";
import { convertToTwilioFormat } from "../utils/twilio";
import useDraft from "../utils/useDraft";
import { demo } from "./demo";

export const FlowContext = createContext({});

const init = [
  {
    id: "0",
    label: "Main Greeting",
    text: "Welcome to Fieldpulse!",
    level: 0,
    index: 0,
    value: 0,
    type: "main",
    children: [],
    parent: null,
  },
];

const getEdges = (data) => {
  let nodes = data;
  let edges = [];
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.children.length > 0) {
      for (let j = 0; j < node.children.length; j++) {
        let child = nodes[node.children[j]];
        if (child) {
          child.num = j + 1;
          edges.push({
            id: `e${node.index}-${child.index}`,
            source: `${node.index}`,
            target: `${child.index}`,
            type: "buttonedge",
            animated: true,
          });
        }
      }
    }
  }
  return { nodes, edges };
};

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
  const [nodes, setNodes] = useState(init);
  const [nodesWithEmpty, setNodesWithEmpty] = useState([]);
  const [edges, setEdges] = useState([]);
  const isEmpty = useMemo(() => nodes.length === 0, [nodes]);
  const [flowNodes, setFlowNodes] = useState([]);
  const [flowEdges, setFlowEdges] = useState([]);
  const [random, setRandom] = useState();

  const [currNode, setCurrNode] = useState(null);
  const [showGreetingModal, setShowGreetingModal] = useState(isEmpty);

  const { draft, dirty, changed, updateDraft, resetDraft } = useDraft({
    ...currNode,
  });

  const [hasEmpty, setHasEmpty] = useState(false);

  const addMain = useCallback(
    (text) => {
      const arr = nodes;
      arr.push({
        id: "0",
        label: "Main Greeting",
        text,
        level: 0,
        index: 0,
        value: 0,
        type: "main",
        children: [],
        parent: null,
      });
      setNodes(arr);
      calcNodes();
    },
    [nodes]
  );

  const addChild = (parentIndex, nodeData, incomingData) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const newIndex = arr.length;
    parent.children.push(newIndex);
    let data = {
      children: [],
      ...nodeData,
      level: parent.level + 1,
      id: JSON.stringify(newIndex),
      parent: parentIndex,
      index: newIndex,
      value: TYPES[1].value,
      num: parent.children.length,
      type: "node",
      ...incomingData,
    };
    arr.push(data);
    arr = calcRelIndex(parentIndex, arr);
    setCurrNode(data);
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
      id: JSON.stringify(newIndex),
      parent: parentIndex,
      index: newIndex,
      children: [],
    };
    arr.push(data);
    arr = calcRelIndex(parentIndex, arr);
    // arr.splice();
    setCurrNode(data);
    setNodes(arr);
    calcNodes();
  };

  const moveChildToIndex = (parentIndex = 0, fromIndex = 0, toIndex = 1) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const element = parent.children[fromIndex];
    parent.children.splice(fromIndex, 1);
    parent.children.splice(toIndex, 0, element);
    arr = calcRelIndex(parentIndex, arr);
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

  const editData = (data) => {
    let arr = nodes;
    arr[currNode.index] = { ...arr[currNode.index], ...draft, ...data };
    let newCurrNode = { ...arr[currNode.index], ...draft, ...data };
    if (newCurrNode.parent !== null) {
      arr = calcRelIndex(currNode.parent, arr);
    }
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
    arr = calcRelIndex(parentIndex, arr);

    setNodes(arr);
    calcNodes();
  };

  const removeEdge = (parentIndex, index) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    const filteredChildren = parent.children.filter((i) => i !== index);
    parent.children = filteredChildren;
    delete arr[index].parent;
    arr = calcRelIndex(parentIndex, arr);

    setNodes(arr);
    calcNodes();
  };

  const addEdge = (parentIndex, index) => {
    let arr = nodes;
    const parent = arr[parentIndex];
    parent.children.push(index);
    arr[index].parent = parentIndex;
    arr = calcRelIndex(parentIndex, arr);

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
    // arr = calcRelIndex(curr.parent, arr);
    setNodes(arr);
    setCurrNode(null);
    calcNodes();
  };

  useEffect(() => {
    calcNodes();
  }, [nodes]);

  const calcNodes = () => {
    const { nodes: n, edges: e } = getEdges(nodes);
    const { nodes: formattedNodes, edges } = getLayoutedElements(n, e);

    setHasEmpty(nodes.filter((i) => i.type === "empty").length > 0);
    setFlowNodes(formattedNodes);
    setFlowEdges(edges);
    setRandom(Math.random() * 10000);
  };

  const getNum = (index) => {
    let curr = nodes[index];
  };

  // useEffect(() => {}, [currNode]);

  const getJson = () => {
    convertToTwilioFormat(nodes);
  };

  const calcRelIndex = (parentIndex, arr) => {
    let parent = arr[parentIndex];
    for (let i = 0; i < parent.children.length; i++) {
      let curr = arr[parent.children[i]];
      if (curr) curr.num = i + 1;
    }
    parent?.children?.sort((a, b) => a < b);
    return arr;
  };

  const reArrangeChildren = (parentIndex, children) => {
    let arr = nodes;
    let curr = arr[parentIndex];
    curr.children = children;
    setNodes(arr);
    calcNodes();
  };

  const useDemo = () => {
    setNodes(demo);
    calcNodes();
  };

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
        useDemo,
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
        getJson,
        hasEmpty,
        random,
        reArrangeChildren,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};
