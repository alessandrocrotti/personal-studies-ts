import { BinaryTree, BinaryTreeNode, IBinaryTreeNode } from "./solid-binary-tree";

export class BinarySearchTree<T> extends BinaryTree<T> {
  insert(data: T): IBinaryTreeNode<T> {
    const insertNode = (node: IBinaryTreeNode<T> | null): IBinaryTreeNode<T> => {
      if (node === null) {
        return new BinaryTreeNode(data);
      }
      if (data < node.data) {
        node.left = insertNode(node.left);
      } else if (data > node.data) {
        node.right = insertNode(node.right);
      }
      return node;
    };
    this.setRoot(insertNode(this.getRoot()));
    return this.getRoot()!;
  }

  search(target: T): IBinaryTreeNode<T> | null {
    const searchNode = (node: IBinaryTreeNode<T> | null): IBinaryTreeNode<T> | null => {
      if (node === null) return null;
      if (node.data === target) return node;
      if (target < node.data) return searchNode(node.left);
      return searchNode(node.right);
    };
    return searchNode(this.getRoot());
  }

  minValueNode(node: IBinaryTreeNode<T> | null = this.getRoot()): IBinaryTreeNode<T> | null {
    let current = node;
    while (current && current.left !== null) {
      current = current.left;
    }
    return current;
  }

  delete(data: T): IBinaryTreeNode<T> | null {
    const deleteNode = (node: IBinaryTreeNode<T> | null, data: T): IBinaryTreeNode<T> | null => {
      if (node === null) return null;
      if (data < node.data) {
        node.left = deleteNode(node.left, data);
      } else if (data > node.data) {
        node.right = deleteNode(node.right, data);
      } else {
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;
        const successor = this.minValueNode(node.right)!;
        node.data = successor.data;
        node.right = deleteNode(node.right, successor.data);
      }
      return node;
    };
    this.setRoot(deleteNode(this.getRoot(), data));
    return this.getRoot();
  }
}
