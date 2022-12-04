import TYPES from "../constants/types";

const NODE_WIDTH = 200;

class Node {
  constructor(data) {
    this.x = data.relIndex * 250;
    this.y = data.level * 250;
    this.finalX = 0;
    this.modifier = 0;
    this.id = data.id;
    this.parent = data.parent;
    this.children = data.children;
    this.last = data.value !== TYPES[0].value || data.value !== TYPES[1].value;

    this.data = data;
  }
}

function calculateInitialValues(data) {
  let nodes = data;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.children.length === 1) {
      node.modifier = node.x;
    } else if (node.children.length >= 2) {
      let minX = nodes[node.children[0]].x;
      let maxX = nodes[node.children[node.children.length - 1]].x;

      node.modifier = node.x + (maxX - minX) / 2;
    }
  }
  return nodes;
}

function calculateFinalValues(data) {
  let nodes = data;
  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    node.x += node.modifier;
  }
  return nodes;
}

function getContour(node, val, func, dataNodes) {
  let nodes = [node];
  while (nodes.length) {
    let node = nodes.shift();
    // nodes = nodes.concat(node.lines);
    if (node.children.length > 0) {
      node.children.forEach((child) => {
        nodes.push(dataNodes[child]);
      });
    }
    val = func(val, node.x);
  }
  return val;
}

function shiftRight(node, shiftValue, dataNodes) {
  let nodes = [node];
  while (nodes.length) {
    let node = nodes.shift();
    if (node.children.length > 0) {
      node.children.forEach((child) => {
        nodes.push(dataNodes[child]);
      });
    }
    node.x += shiftValue;
  }
}

function fixNodeConflicts(nodes) {
  let arr = nodes;
  arr.forEach((node) => {
    for (let i = 0; i < node.children.length - 1; i++) {
      let botContour = getContour(
        arr[node.children[i]],
        -Infinity,
        Math.max,
        arr
      );
      let topContour = getContour(
        arr[node.children[i + 1]],
        Infinity,
        Math.min,
        arr
      );

      if (
        Math.abs(topContour - botContour) <= 200 ||
        botContour >= topContour
      ) {
        node.x += (botContour + 200 - topContour + 50) / node.children.length;
        shiftRight(
          arr[node.children[i + 1]],
          botContour + 200 - topContour + 50,
          arr
        );
      }
    }
  });

  return arr;
}

function updateXVals(data) {
  let nodes = data;
  let minXVal = Infinity;
  nodes.forEach((node) => {
    if (node.x < minXVal) {
      minXVal = node.x;
    }
  });

  nodes.forEach((node) => {
    node.x += Math.abs(minXVal);
  });

  return nodes;
}

export const convert = (list) => {
  let nodes = [];
  let edges = [];

  for (let i = 0; i < list.length; i++) {
    const node = list[i];
    const { id, x, y, data } = node;
    nodes.push({
      id: id,
      position: {
        x,
        y,
      },
      data: { ...data, label: `${x},${y}` },
      type: data.nodeType,
    });
    if (node.parent !== null) {
      edges.push({
        id: `e${node.parent}-${node.id}`,
        source: `${node.parent}`,
        target: `${node.id}`,
        animated: true,
        type: data.nodeType === "empty" ? "" : "buttonedge",
      });
    }
  }

  return { nodes, edges };
};

const fixMain = (data) => {
  let nodes = data;
  let curr = nodes[0];
  if (curr.children.length > 1) {
    curr.x =
      (nodes[curr.children[0]].x +
        nodes[curr.children[curr.children.length - 1]].x) /
      2;
  } else if (curr.children.length === 1) {
    curr.x = nodes[curr.children[0]].x;
  }
  return nodes;
};

export const calculateDimensions = (data) => {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (let i = 0; i < data.length; i++) {
    let curr = data[i];

    if (
      curr.data.level === 0 ||
      (curr.data.level !== 0 && curr.parent !== null)
    ) {
      let position = curr.position;

      if (position.x < minX) {
        minX = position.x;
      }
      if (position.x > maxX) {
        maxX = position.x;
      }

      if (position.y < minY) {
        minY = position.y;
      }
      if (position.y > maxY) {
        maxY = position.y;
      }
    }
  }
  return { minX, maxX, minY, maxY };
};

const fixNoParentNodes = (nodes) => {
  let arr = nodes;
  const { maxX } = calculateDimensions(arr);
  for (let i = 0; i < arr.length; i++) {
    let curr = arr[i];
    if (curr.data.level !== 0 && curr.data.parent === null) {
      curr.position.x += maxX + 250 - curr.position.x;
    }
  }
  return arr;
};

export default function getTree(data) {
  let dataNodes = [];
  for (let i = 0; i < data.length; i++) {
    dataNodes.push(new Node(data[i]));
  }

  dataNodes = calculateInitialValues(dataNodes);
  dataNodes = calculateFinalValues(dataNodes);
  dataNodes = updateXVals(dataNodes);
  dataNodes = fixNodeConflicts(dataNodes);

  dataNodes = fixMain(dataNodes);
  const { nodes, edges } = convert(dataNodes);
  const fixedNodes = fixNoParentNodes(nodes);

  return { nodes: fixedNodes, edges };
}
