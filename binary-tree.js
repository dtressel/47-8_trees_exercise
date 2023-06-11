/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth() {
    let treeArr = [[this.root]];
    if (treeArr[0][0] === null) return 0;
    for (let i = 0; i < treeArr.length; i++) {
      treeArr = [...treeArr, []];
      while (treeArr[i].length > 0) {
        const node = treeArr[i].pop()
        if (node.left !== null) {
          treeArr[i + 1].push(node.left);
          if (node.right !== null) {
            treeArr[i + 1].push(node.right);
          }
        } 
        else {
          if (node.right === null) {
            return i + 1;
          }
          else {
            treeArr[i + 1].push(node.right);
          }
        }
      }
    }
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth() {
    let treeArr = [[this.root]];
    if (treeArr[0][0] === null) return 0;
    for (let i = 0; i < treeArr.length; i++) {
      if (treeArr[i].length === 0) return i; 
      treeArr = [...treeArr, []];
      while (treeArr[i].length > 0) {
        const node = treeArr[i].pop()
        if (node.left !== null) {
          treeArr[i + 1].push(node.left);
        }
        if (node.right !== null) {
          treeArr[i + 1].push(node.right);
        }
      }
    }
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. 
   * Solution: Start at any non-leaf node and figure out all of the paths from that node */

  maxSum() {
    // ******* When coming back to this later, redo. There is much simpler recursive solution. *************************************
    function findTwoChildNodes(root) {
      const toVisitStack = [root];
      const twoChildNodes = [];
      while (toVisitStack.length) {
        const testNode = toVisitStack.pop();
        // push testNode to twoChildNodes if it has a child
        // push any children to toVisitStack
        if (testNode.left !== null) {
          toVisitStack.push(testNode.left);
          if (testNode.right !== null) {
            toVisitStack.push(testNode.right);
            twoChildNodes.push(testNode);
          }
        }
        else {
          if (testNode.right !== null) {
            toVisitStack.push(testNode.right);
          }
        }
      }
      return twoChildNodes;
    }

    function findValuesOfPathsDown(node) {
      const valuesOfPaths = [];
      const path = [];

      // travel path while summing values, and then look for new children and summing values when found
      // alter path: get rid of trailing rights and change last left to right (if right exists else remove)
      do {
        let currentNode = node;
        let currentPathValues = [currentNode.val];
        let broken = false;
        for (const direction of path) {
          currentNode = currentNode[direction];
          // some right directions may not point to a new node so if null break and skip to trimming
          if (currentNode === null) {
            broken = true;
            break;
          }
          currentPathValues.push(currentNode.val);
        }
        // paths that are broken (above) because they are trying to test a non-existent right 
        // are redundant and should not be counted, so skip to trimming
        if (!broken) {
          while (currentNode.left !== null || currentNode.right !== null) {
            if (currentNode.left !== null) {
              path.push("left");
              currentNode = currentNode.left;
            }
            else {
              path.push("right");
              currentNode = currentNode.right;
            }
            currentPathValues.push(currentNode.val);
          }
          valuesOfPaths.push(currentPathValues);
        }
        // Trim trailing rights and change last left to right
        while (path[path.length - 1] === "right") {
          path.pop();
        }
        if (path.length) {
          path[path.length - 1] = "right";
        }
      } 
      while (path.length > 0);
      return valuesOfPaths;
    }

    function combinePaths(leftPaths, rightPaths, hubVal) {
      const combinedPaths = [];
      for (const leftPath of leftPaths) {
        // reverse left side so path starts at left leaf and moves to right leaf
        leftPath.reverse();
        for (const rightPath of rightPaths) {
          combinedPaths.push([...leftPath, hubVal, ...rightPath]);
        }
      }
      return combinedPaths;
    }

    function findMaxSum(paths, runningMaxSum = 0) {
      // find max sum of all full paths
      const fullPathsMaxSum = paths.reduce((maxSum, path) => {
        const pathSum = path.reduce((sum, val) => sum + val);
        if (pathSum > maxSum) return pathSum;
        return maxSum;
      }, 0);
      if (fullPathsMaxSum > runningMaxSum) {
        runningMaxSum = fullPathsMaxSum;
      }
      // figure out if any sub paths of full path may result in a larger sum
      // it does this by summing numbers in path without including negatives to calculate potential
      const pathsToTrySubPaths = paths.filter((path) => {
        const maxSubPathPotentialSum = path.reduce((sumExcludeNegatives, val) => {
          return val > 0 ? sumExcludeNegatives + val : sumExcludeNegatives;
        }, 0);
        return maxSubPathPotentialSum > runningMaxSum;
      })
      // if there are no promising sub paths then return current running max sum
      if (pathsToTrySubPaths.length === 0) return runningMaxSum;
      // break down promising sub paths to 2 sub paths of one smaller length
      const subPathsLessOneNode = pathsToTrySubPaths.reduce((newPathArray, path) => {
        return [...newPathArray, path.slice(0, -1), path.slice(1)];
      }, []);
      // call function again (recursive) on sub paths passing in runningMaxSum
      // final runningMaxSum will be passed through returns to original calling
      return findMaxSum(subPathsLessOneNode, runningMaxSum);
    }

    // On Call:

    // if empty tree, return 0
    if (!this.root) return 0;
    // Find all the two child nodes
    // Two child nodes are the pivots (hubs) for all max length paths
    const twoChildNodes = findTwoChildNodes(this.root);
    const allFullPaths = [];
    for (const node of twoChildNodes) {
      // create arrays of all paths down from the two child nodes
      const valuesOfPathsLeft = findValuesOfPathsDown(node.left);
      const valuesOfPathsRight = findValuesOfPathsDown(node.right);
      // build all full paths from every leaf to every possible leaf using the node as a pivot
      const fullPaths = combinePaths(valuesOfPathsLeft, valuesOfPathsRight, node.val);
      allFullPaths.push(...fullPaths);
    }
    // use FindMaxSum to find the max sum between all full paths and then promising sub paths
    // as it calls itself recursively
    return findMaxSum(allFullPaths);
  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound) {
    let smallestValue = null;
    function findNextLarger(root) {
      if (!root) return;
      if (root.val > lowerBound && (smallestValue === null || root.val < smallestValue)) {
        smallestValue = root.val;
      }
      findNextLarger(root.left);
      findNextLarger(root.right);
    }
    findNextLarger(this.root);
    return smallestValue;
  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {

  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize() {

  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize() {

  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
