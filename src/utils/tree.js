const NODE_WIDTH = 200;

class Node {
  constructor(x, y, parent, prevSibling, dataNode) {
    this.x = x;
    this.y = x;
    this.finalY = 0;
    this.modifier = 0;
    this.id = dataNode.id;
    this.parent = parent;
    this.prevSibling = prevSibling;
    this.lines = [];
    this.last = dataNode?.lines?.length === 0;

    this.dataNode = dataNode;
  }
}

function calculateInitialValues(node) {
  for (let i = 0; i < node.lines.length; i++) {
    calculateInitialValues(node.lines[i]);
  }

  if (node.prevSibling) {
    node.x = node.prevSibling.x + 250;
  } else {
    node.x = 0;
  }

  if (node.lines.length === 1) {
    node.modifier = node.x;
  } else if (node.lines.length >= 2) {
    let minY = Infinity;
    let maxY = -minY;
    for (let i = 0; i < node.lines.length; i++) {
      minY = Math.min(minY, node.lines[i].x);
      maxY = Math.max(maxY, node.lines[i].x);
    }
    node.modifier = node.x - (maxY - minY) / 2;
  }
}

function calculateFinalValues(node, modSum) {
  node.finalY = node.x + modSum;
  for (let i = 0; i < node.lines.length; i++) {
    calculateFinalValues(node.lines[i], node.modifier + modSum);
  }
}

function getContour(root, val, func) {
  let nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node.lines);
    val = func(val, node.finalY);
  }
  return val;
}

function shiftDown(root, shiftValue) {
  let nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node.lines);
    node.finalY += shiftValue;
  }
}

function fixNodeConflicts(root) {
  for (let i = 0; i < root.lines.length; i++) {
    fixNodeConflicts(root.lines[i]);
  }
  for (let i = 0; i < root.lines.length - 1; i++) {
    // Get the bottom-most contour position of the current node
    let botContour = getContour(root.lines[i], -Infinity, Math.max);
    // Get the topmost contour position of the node underneath the current one
    let topContour = getContour(root.lines[i + 1], Infinity, Math.min);
    // console.log(botContour, topContour, root.lines[i + 1].dataNode.nickName);

    if (Math.abs(topContour - botContour) <= 200 || botContour >= topContour) {
      root.finalY += (botContour + 200 - topContour + 50) / root.lines.length;
      shiftDown(root.lines[i + 1], botContour + 200 - topContour + 50);
    }
  }
}

function buildTree(dataNode, parent, prevSibling, level) {
  let root = new Node(level, 0, parent, prevSibling, dataNode);
  for (let i = 0; i < dataNode?.lines?.length; i++) {
    root.lines.push(
      buildTree(
        dataNode.lines[i],
        root,
        i >= 1 ? root.lines[i - 1] : null,
        level + 1
      )
    );
  }
  return root;
}

function updateYVals(root) {
  let minYVal = Infinity;
  let nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node.lines);
    if (node.finalY < minYVal) {
      minYVal = node.finalY;
    }
  }

  nodes = [root];
  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node.lines);
    node.finalY += Math.abs(minYVal);
  }
}

function assignSiblingCounts(root) {
  let nodes = [root, null];
  let level = [];

  let siblings = 0;
  while (nodes.length) {
    let node = nodes.shift();
    if (!node) {
      for (let i = 0; i < level.length; i++) {
        level[i].siblings = siblings;
      }
      level = [];
      siblings = 0;
      if (nodes.length) {
        nodes.push(null);
      }
    } else {
      nodes = nodes.concat(node.lines);
      siblings++;
      level.push(node);
    }
  }
}

export const convertToList = (root) => {
  let nodes = [root];
  let edges = [];
  let finalNodes = [];

  while (nodes.length) {
    let node = nodes.shift();
    nodes = nodes.concat(node.lines);
    const { id, y, finalY, dataNode } = node;
    const { value, nickName, num } = dataNode;
    finalNodes.push({
      id: JSON.stringify(id),
      position: {
        x: finalY,
        y: y * 250,
      },
      data: {
        value,
        label: nickName,
        num,
        last: node.last,
        data: node.dataNode,
      },
      type: node.dataNode.type,
    });
    if (node.parent) {
      edges.push({
        id: `e${node.parent.id}-${node.id}`,
        source: `${node.parent.id}`,
        target: `${node.id}`,
        animated: true,
        type: node.dataNode.type === "new" ? "" : "buttonedge",
      });
    }
  }
  return { nodes: finalNodes, edges };
};

const fixMain = (root) => {
  let minYVal = Infinity;
  let maxYVal = -Infinity;
  for (let i = 0; i < root.lines.length; i++) {
    const node = root.lines[i];
    if (node.finalY < minYVal) {
      minYVal = node.finalY;
    }
    if (node.finalY > maxYVal) {
      maxYVal = node.finalY;
    }
  }
  root.finalY = (minYVal + maxYVal) / 2;
};

export function getTree(data) {
  let root = buildTree(data, null, null, 0, 0);

  calculateInitialValues(root);
  calculateFinalValues(root, 0);
  updateYVals(root);
  fixNodeConflicts(root);
  assignSiblingCounts(root);

  fixMain(root);
  return root;
}
