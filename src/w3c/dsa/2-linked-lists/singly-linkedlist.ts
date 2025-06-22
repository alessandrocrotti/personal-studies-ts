interface ISinglyLinkedList<T> {
  insertInBegin(data: T): SinglyLinkedListNode<T>;
  deleteNode(node: SinglyLinkedListNode<T>): void;
  getNode(position: number): SinglyLinkedListNode<T> | null;
  insertNode(node: SinglyLinkedListNode<T>, position: number): void;
  search(comparator: (data: T) => boolean): SinglyLinkedListNode<T> | null;
  size(): number;
  traverse(): T[];
}

export class SinglyLinkedListNode<T> {
  public next: SinglyLinkedListNode<T> | null = null;
  constructor(public data: T) {}
}

export class SinglyLinkedList<T> implements ISinglyLinkedList<T> {
  private head: SinglyLinkedListNode<T> | null = null;

  public insertInBegin(data: T): SinglyLinkedListNode<T> {
    const node = new SinglyLinkedListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    return node;
  }

  public deleteNode(node: SinglyLinkedListNode<T>): void {
    // Remove head
    if (this.head === node) {
      this.head = this.head.next;
      return;
    }

    let currentNode = this.head;
    while (currentNode) {
      console.log(currentNode.next, node, currentNode.next === node);
      if (currentNode.next === node) {
        console.log(currentNode.data, currentNode.next.data);
        // Remove the node changing the value of the pointer
        currentNode.next = currentNode.next.next;
        console.log(currentNode.data, currentNode.next?.data);
        break;
      }
      currentNode = currentNode.next;
    }
  }

  public getNode(position: number): SinglyLinkedListNode<T> | null {
    let node = this.head;
    let count = 0;
    while (node) {
      if (count == position) {
        return node;
      }
      node = node.next;
      count++;
    }
    return null;
  }

  public insertNode(node: SinglyLinkedListNode<T>, position: number): void {
    if (position === 0) {
      // Insert at beginning
      node.next = this.head;
      this.head = node;
    } else {
      const beforePositionNode = this.getNode(position - 1);
      if (beforePositionNode) {
        node.next = beforePositionNode.next;
        beforePositionNode.next = node;
      }
    }
  }

  public search(comparator: (data: T) => boolean): SinglyLinkedListNode<T> | null {
    if (!this.head) {
      return null;
    }

    const find = (node: SinglyLinkedListNode<T>): SinglyLinkedListNode<T> | null => {
      if (comparator(node.data)) {
        return node;
      } else {
        return node.next ? find(node.next) : null;
      }
    };
    return find(this.head);
  }

  public size(): number {
    if (!this.head) {
      return 0;
    }

    const elementCount = (node: SinglyLinkedListNode<T>, count = 0) => {
      count++;
      if (node.next) {
        count = elementCount(node.next, count);
      }
      return count;
    };

    return elementCount(this.head);
  }

  public traverse(): T[] {
    const array: T[] = [];

    if (!this.head) {
      return array;
    }

    const putNodeDataIntoArray = (node: SinglyLinkedListNode<T>) => {
      array.push(node.data);
      if (node.next) {
        putNodeDataIntoArray(node.next);
      }
      return array;
    };

    return putNodeDataIntoArray(this.head);
  }
}
