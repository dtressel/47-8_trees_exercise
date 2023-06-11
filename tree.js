/** TreeNode: node for a general tree. */

class TreeNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

class Tree {
  constructor(root = null) {
    this.root = root;
  }

  /** sumValues(): add up all of the values in the tree. */

  sumValues() {
    let sum = 0;
    let nodes = [this.root];
    if (nodes[0]) {
      for (let i = 0; i < nodes.length; i++) {
        sum += nodes[i].val;
        nodes = [...nodes, ...nodes[i].children];
      }
    }
    return sum;
  }

  /** countEvens(): count all of the nodes in the tree with even values. */

  countEvens() {
    let count = 0;
    let nodes = [this.root];
    if (nodes[0]) {
      for (let i = 0; i < nodes.length; i++) {
        if (!(nodes[i].val % 2)) count++;
        nodes = [...nodes, ...nodes[i].children];
      }
    }
    return count;
  }

  /** numGreater(lowerBound): return a count of the number of nodes
   * whose value is greater than lowerBound. */

  numGreater(lowerBound) {
    let count = 0;
    let nodes = [this.root];
    if (nodes[0]) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].val > lowerBound) count++;
        nodes = [...nodes, ...nodes[i].children];
      }
    }
    return count;
  }
}

module.exports = { Tree, TreeNode };
