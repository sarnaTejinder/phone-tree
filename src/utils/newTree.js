class Node {
  constructor(x, y, parent, prevSibling, dataNode) {
    this.x = x;
    this.y = x;
    this.finalX = 0;
    this.modifier = 0;
    this.id = dataNode.id;
    this.parent = parent;
    this.prevSibling = prevSibling;
    this.children = [];
    this.last = dataNode?.children?.length === 0;

    this.dataNode = dataNode;
  }
}
