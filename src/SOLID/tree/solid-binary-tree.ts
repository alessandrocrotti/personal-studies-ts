// Interfaces for tree structure and traversal

export interface IBinaryTreeNode<T> {
  data: T;
  left: IBinaryTreeNode<T> | null;
  right: IBinaryTreeNode<T> | null;
}

export interface IBinaryTree<T> {
  getRoot(): IBinaryTreeNode<T> | null;
  setRoot(node: IBinaryTreeNode<T> | null): void;
}

// Node class
export class BinaryTreeNode<T> implements IBinaryTreeNode<T> {
  data: T;
  left: IBinaryTreeNode<T> | null = null;
  right: IBinaryTreeNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

// Basic tree structure
export class BinaryTree<T> implements IBinaryTree<T> {
  protected root: IBinaryTreeNode<T> | null = null;

  getRoot(): IBinaryTreeNode<T> | null {
    return this.root;
  }

  setRoot(node: IBinaryTreeNode<T> | null): void {
    this.root = node;
  }

  addRoot(node: IBinaryTreeNode<T>): IBinaryTreeNode<T> {
    this.root = node;
    return this.root;
  }

  addNode(parentNode: IBinaryTreeNode<T>, childNode: IBinaryTreeNode<T>, position: "left" | "right"): IBinaryTreeNode<T> {
    parentNode[position] = childNode;
    return childNode;
  }
}
