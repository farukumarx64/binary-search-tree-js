class BinaryTree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    let sortedUniqueArray = this.sortArray(array);
    console.log(sortedUniqueArray);
    const length = sortedUniqueArray.length;

    // Base case: If the array is empty, return null.
    if (length === 0) {
      return null;
    }

    // Find the middle index of the array.
    const middleIndex = Math.floor(length / 2);

    // Create the root node using the middle element.
    const rootNode = new TreeNode(sortedUniqueArray[middleIndex]);

    // Recursively build the left subtree with elements before the middle.
    rootNode.left = this.buildTree(sortedUniqueArray.slice(0, middleIndex));

    // Recursively build the right subtree with elements after the middle.
    rootNode.right = this.buildTree(sortedUniqueArray.slice(middleIndex + 1));

    // Return the root node of the tree.
    prettyPrint(rootNode);
    return rootNode;
  }

  insert(value) {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (current) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else if (value > current.value) {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      } else {
        // Value already exists, no duplicates allowed
        return;
      }
    }
  }

  delete(value) {
    rebalance;
    if (!this.root) {
      return;
    }

    let current = this.root;
    let parent = null;

    while (current) {
      if (value < current.value) {
        parent = current;
        current = current.left;
      } else if (value > current.value) {
        parent = current;
        current = current.right;
      } else {
        // Node with the matching value found

        // Node with only one child or no child
        if (!current.left) {
          if (!parent) {
            this.root = current.right;
          } else if (current === parent.left) {
            parent.left = current.right;
          } else {
            parent.right = current.right;
          }
          return;
        } else if (!current.right) {
          if (!parent) {
            this.root = current.left;
          } else if (current === parent.left) {
            parent.left = current.left;
          } else {
            parent.right = current.left;
          }
          return;
        }

        // Node with two children: Get the in order successor (smallest in the right subtree)
        let successorParent = current;
        let successor = current.right;
        while (successor.left) {
          successorParent = successor;
          successor = successor.left;
        }

        // Copy the in order successor's value to the current node
        current.value = successor.value;

        // Delete the in order successor
        if (successor === successorParent.left) {
          successorParent.left = successor.right;
        } else {
          successorParent.right = successor.right;
        }

        return;
      }
    }
  }

  find(value) {
    let current = this.root;

    while (current) {
      if (value === current.value) {
        return current; // Found the node with the given value
      } else if (value < current.value) {
        current = current.left; // Move left in the BST
      } else {
        current = current.right; // Move right in the BST
      }
    }

    return null; // Value not found in the tree
  }

  levelOrder(callback) {
    if (!this.root) {
      return [];
    }

    const result = [];
    const queue = [this.root];

    while (queue.length > 0) {
      const current = queue.shift();

      if (callback) {
        callback(current);
      } else {
        result.push(current.value);
      }

      if (current.left) {
        queue.push(current.left);
      }
      if (current.right) {
        queue.push(current.right);
      }
    }

    return result;
  }

  inOrder(callback, node = this.root) {
    const result = [];
    if (!node) {
      return result;
    }

    if (node.left) {
      result.push(...this.inOrder(callback, node.left));
    }

    if (callback) {
      callback(node);
    } else {
      result.push(node.value);
    }

    if (node.right) {
      result.push(...this.inOrder(callback, node.right));
    }

    return result;
  }

  preOrder(callback, node = this.root) {
    const result = [];
    if (!node) {
      return result;
    }

    if (callback) {
      callback(node);
    } else {
      result.push(node.value);
    }

    if (node.left) {
      result.push(...this.preOrder(callback, node.left));
    }

    if (node.right) {
      result.push(...this.preOrder(callback, node.right));
    }

    return result;
  }

  postOrder(callback, node = this.root) {
    const result = [];
    if (!node) {
      return result;
    }

    if (node.left) {
      result.push(...this.postOrder(callback, node.left));
    }

    if (node.right) {
      result.push(...this.postOrder(callback, node.right));
    }

    if (callback) {
      callback(node);
    } else {
      result.push(node.value);
    }

    return result;
  }

  height(node) {
    if (!node) {
      return -1; // Height of a null node is -1 (considering edges)
    }

    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    // Return the height of the taller subtree plus one (for the current node)
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node) {
    if (!node) {
      return -1; // Depth of a null node is -1 (considering edges)
    }

    let current = node;
    let depth = 0;

    while (current !== this.root) {
      current = this.parent(current);
      depth++;
    }

    return depth;
  }

  isBalanced() {
    if (!this.root) {
      return true; // An empty tree is considered balanced
    }

    const stack = [this.root];
    const depths = new Map(); // Map to store depths of nodes

    while (stack.length > 0) {
      const node = stack.pop();

      // Calculate depths of left and right subtrees
      const leftDepth = this.depth(node.left);
      const rightDepth = this.depth(node.right);

      // Check if the difference in depths is more than 1
      if (Math.abs(leftDepth - rightDepth) > 1) {
        return false; // Tree is unbalanced
      }

      // Store the depth of the current node
      depths.set(node, Math.max(leftDepth, rightDepth) + 1);

      // Push child nodes onto the stack
      if (node.left) {
        stack.push(node.left);
      }
      if (node.right) {
        stack.push(node.right);
      }
    }

    return true; // Tree is balanced
  }

  reBalance() {
    // Step 1: Extract all elements in sorted order
    const sortedValues = this.inOrder();

    // Step 2: Build a balanced BST using the sorted array
    this.root = this.buildTree(sortedValues);
  }

  // Helper function to find the parent of a node
  parent(childNode, parentNode = this.root) {
    if (!parentNode || parentNode === childNode) {
      return null;
    }

    if (parentNode.left === childNode || parentNode.right === childNode) {
      return parentNode;
    }

    const leftParent = this.parent(childNode, parentNode.left);
    if (leftParent) {
      return leftParent;
    }

    return this.parent(childNode, parentNode.right);
  }
  sortArray(arr) {
    if (!Array.isArray(arr)) {
      throw new Error("Input is not an array");
    }

    // Sort the array in ascending order
    arr.sort((a, b) => a - b);

    // Use a Set to store unique values
    const uniqueValues = new Set();

    // Iterate through the sorted array and add unique values to the Set
    for (const item of arr) {
      uniqueValues.add(item);
    }

    // Convert the Set back to an array
    const sortedUniqueArray = Array.from(uniqueValues);

    return sortedUniqueArray;
  }
}

class TreeNode {
  constructor(value) {
    this.value = value || null;
    this.left = null;
    this.right = null;
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// Helper function to generate an array of random numbers < 100
function generateRandomNumbers(count) {
  const randomNumbers = [];
  for (let i = 0; i < count; i++) {
    randomNumbers.push(Math.floor(Math.random() * 100));
  }
  return randomNumbers;
}

// Create a binary search tree from an array of random numbers < 100
const randomNumbers = generateRandomNumbers(10);
const tree = new BinaryTree(randomNumbers);

// Confirm that the tree is balanced
const isTreeBalanced = tree.isBalanced();
console.log("Is the tree balanced?", isTreeBalanced);

// Print out elements in level, pre, post, and in order
console.log("Level Order Traversal:");
tree.levelOrder((node) => console.log(node.value));
console.log("Preorder Traversal:");
console.log(tree.preOrder());
console.log("Postorder Traversal:");
console.log(tree.postOrder());
console.log("Inorder Traversal:");
console.log(tree.inOrder());

// Unbalance the tree by adding several numbers > 100
tree.insert(105);
tree.insert(110);
tree.insert(120);

// Confirm that the tree is unbalanced
const isTreeUnbalanced = tree.isBalanced();
console.log("Is the tree unbalanced?", isTreeUnbalanced);

// Balance the tree by calling rebalance
tree.reBalance();

// Confirm that the tree is balanced
const isTreeBalancedAfterRebalance = tree.isBalanced();
console.log(
  "Is the tree balanced after rebalance?",
  isTreeBalancedAfterRebalance
);

// Print out elements in level, pre, post, and in order after rebalance
console.log("Level Order Traversal (after rebalance):");
tree.levelOrder((node) => console.log(node.value));
console.log("Preorder Traversal (after rebalance):");
console.log(tree.preOrder());
console.log("Postorder Traversal (after rebalance):");
console.log(tree.postOrder());
console.log("Inorder Traversal (after rebalance):");
console.log(tree.inOrder());
