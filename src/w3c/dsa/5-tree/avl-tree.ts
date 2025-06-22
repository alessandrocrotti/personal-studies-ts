export class AVLTreeNode<T> {
  data: T;
  height: number = 1;
  left: AVLTreeNode<T> | null = null;
  right: AVLTreeNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class AVLTree<T> {
  root: AVLTreeNode<T> | null = null;

  private getHeight(node: AVLTreeNode<T> | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: AVLTreeNode<T> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private rightRotate(y: AVLTreeNode<T>): AVLTreeNode<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

    return x;
  }

  private leftRotate(x: AVLTreeNode<T>): AVLTreeNode<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    return y;
  }

  private minValueNode(node: AVLTreeNode<T>): AVLTreeNode<T> {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  private deleteNode(node: AVLTreeNode<T> | null, data: T): AVLTreeNode<T> | null {
    if (!node) return null;

    if (data < node.data) {
      node.left = this.deleteNode(node.left, data);
    } else if (data > node.data) {
      node.right = this.deleteNode(node.right, data);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      const temp = this.minValueNode(node.right);
      node.data = temp.data;
      node.right = this.deleteNode(node.right, temp.data);
    }

    if (!node) return null;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    // Left Left
    if (balance > 1 && this.getBalance(node.left) >= 0) {
      return this.rightRotate(node);
    }

    // Left Right
    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }

    // Right Right
    if (balance < -1 && this.getBalance(node.right) <= 0) {
      return this.leftRotate(node);
    }

    // Right Left
    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  public insert(data: T): void {
    this.root = this.insertNode(this.root, data);
  }

  private insertNode(node: AVLTreeNode<T> | null, data: T): AVLTreeNode<T> {
    if (!node) return new AVLTreeNode(data);

    if (data < node.data) {
      node.left = this.insertNode(node.left, data);
    } else if (data > node.data) {
      node.right = this.insertNode(node.right, data);
    } else {
      return node;
    }

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && data < node.left!.data) return this.rightRotate(node);
    if (balance < -1 && data > node.right!.data) return this.leftRotate(node);
    if (balance > 1 && data > node.left!.data) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    if (balance < -1 && data < node.right!.data) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  public delete(data: T): void {
    this.root = this.deleteNode(this.root, data);
  }

  public inOrderTraversal(): T[] {
    const result: T[] = [];
    const traverse = (node: AVLTreeNode<T> | null): void => {
      if (node) {
        traverse(node.left);
        result.push(node.data);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }
}
