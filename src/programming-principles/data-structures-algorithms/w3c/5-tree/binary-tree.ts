export class BinaryTreeNode<T> {
  data: T;
  left: BinaryTreeNode<T> | null = null;
  right: BinaryTreeNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class BinaryTree<T> {
  root: BinaryTreeNode<T> | null = null;

  addRoot(node: BinaryTreeNode<T>) {
    this.root = node;
    return this.root;
  }

  addNode(parentNode: BinaryTreeNode<T>, childNode: BinaryTreeNode<T>, position: "left" | "right") {
    parentNode[position] = childNode;
    return childNode;
  }

  /**
   * Go through the tree following the left branch as first and add the node before calling recursive functions on the next node ("pre" order).
   * @returns
   */
  public preOrderTraversal(): T[] {
    const sortedTree: T[] = [];
    const innerFunction = (node: BinaryTreeNode<T> | null): void => {
      if (node === null) {
        return;
      }
      sortedTree.push(node.data);
      innerFunction(node.left);
      innerFunction(node.right);
    };
    innerFunction(this.root);
    return sortedTree;
  }

  /**
   * Go through the tree following the left branch as first and add the node after calling recursive function on the left node, but before calling recursive function on right node ("in" order).
   * This traversal is mainly used for Binary Search Trees where it returns values in ascending order.
   * @returns
   */
  public inOrderTraversal(): T[] {
    const sortedTree: T[] = [];
    const innerFunction = (node: BinaryTreeNode<T> | null): void => {
      if (node === null) {
        return;
      }
      innerFunction(node.left);
      sortedTree.push(node.data);
      innerFunction(node.right);
    };
    innerFunction(this.root);
    return sortedTree;
  }

  /**
   * Go through the tree following the left branch as first and add the node after calling recursive functions on the next node ("post" order).
   * It is used for deleting a tree, post-fix notation of an expression tree, etc.
   * @returns
   */
  public postOrderTraversal(): T[] {
    const sortedTree: T[] = [];
    const innerFunction = (node: BinaryTreeNode<T> | null): void => {
      if (node === null) {
        return;
      }
      innerFunction(node.left);
      innerFunction(node.right);
      sortedTree.push(node.data);
    };
    innerFunction(this.root);
    return sortedTree;
  }

  /**
   * Similar to BinarySearch for trees already sorted as BinarySearchTree. This has high performance on search elements
   * @param target
   * @returns
   */
  searchIntoBST(target: T): BinaryTreeNode<T> | null {
    const innerFunction = (node: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null => {
      if (node === null) {
        return null;
      } else if (node.data === target) {
        return node;
      } else if (target < node.data) {
        return innerFunction(node.left);
      } else {
        return innerFunction(node.right);
      }
    };
    return innerFunction(this.root);
  }

  insertIntoBST(data: T): BinaryTreeNode<T> {
    const innerFunction = (node: BinaryTreeNode<T> | null): BinaryTreeNode<T> => {
      // Create new node and return it
      if (node === null) {
        return new BinaryTreeNode(data);
      }

      // Get returned node and assign it to the left/right position
      if (data < node.data) {
        node.left = innerFunction(node.left);
      } else if (data > node.data) {
        node.right = innerFunction(node.right);
      }
      return node;
    };
    return innerFunction(this.root);
  }

  minValueNodeIntoBST(node: BinaryTreeNode<T> | null = this.root): BinaryTreeNode<T> | null {
    const innerFunction = (node: BinaryTreeNode<T> | null): BinaryTreeNode<T> | null => {
      if (node === null) return null;

      let current: BinaryTreeNode<T> = node;
      while (current.left !== null) {
        current = current.left;
      }
      return current;
    };
    return innerFunction(node);
  }

  deleteNode(data: T): BinaryTreeNode<T> | null {
    const innerFunction = (node: BinaryTreeNode<T> | null, data: T): BinaryTreeNode<T> | null => {
      if (node === null) {
        return null;
      }

      if (data < node.data) {
        node.left = innerFunction(node.left, data);
      } else if (data > node.data) {
        node.right = innerFunction(node.right, data);
      } else {
        // Node with one or no child: assign the only child to the deleted parent node
        if (node.left === null) {
          return node.right;
        } else if (node.right === null) {
          return node.left;
        }

        // Node with two children: get in-order successor
        // Assign the lowest node value on the right branch in the same position of the deleted node and deleted this node
        // It is a sort of "swap" values between the deleted node and successor, then delete the node that had the successor value
        // It's not a true swap, because you don't need to assign deleted node value to the successor node, since you will delete it
        const successor = this.minValueNodeIntoBST(node.right)!;
        node.data = successor.data;
        node.right = innerFunction(node.right, successor.data);
      }

      return node;
    };
    return innerFunction(this.root, data);
  }

  public buildBalancedBSTFromArray(values: T[]): void {
    if (values.length === 0) {
      this.root = null;
      return;
    }

    const sorted = [...values].sort((a, b) => (a < b ? -1 : 1));

    const build = (start: number, end: number): BinaryTreeNode<T> | null => {
      if (start > end) return null;

      const mid = Math.floor((start + end) / 2);
      const node = new BinaryTreeNode(sorted[mid]);
      node.left = build(start, mid - 1);
      node.right = build(mid + 1, end);
      return node;
    };

    this.root = build(0, sorted.length - 1);
  }
}
