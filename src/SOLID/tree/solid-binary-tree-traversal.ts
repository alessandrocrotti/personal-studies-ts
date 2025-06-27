import { IBinaryTreeNode, IBinaryTree } from "./solid-binary-tree";

export interface IBinaryTreeTraversal<T> {
  traverse(tree: IBinaryTree<T>): T[];
}

export class PreOrderTraversal<T> implements IBinaryTreeTraversal<T> {
  traverse(tree: IBinaryTree<T>): T[] {
    const result: T[] = [];
    const visit = (node: IBinaryTreeNode<T> | null) => {
      if (!node) return;
      result.push(node.data);
      visit(node.left);
      visit(node.right);
    };
    visit(tree.getRoot());
    return result;
  }
}

export class InOrderTraversal<T> implements IBinaryTreeTraversal<T> {
  traverse(tree: IBinaryTree<T>): T[] {
    const result: T[] = [];
    const visit = (node: IBinaryTreeNode<T> | null) => {
      if (!node) return;
      visit(node.left);
      result.push(node.data);
      visit(node.right);
    };
    visit(tree.getRoot());
    return result;
  }
}

export class PostOrderTraversal<T> implements IBinaryTreeTraversal<T> {
  traverse(tree: IBinaryTree<T>): T[] {
    const result: T[] = [];
    const visit = (node: IBinaryTreeNode<T> | null) => {
      if (!node) return;
      visit(node.left);
      visit(node.right);
      result.push(node.data);
    };
    visit(tree.getRoot());
    return result;
  }
}
