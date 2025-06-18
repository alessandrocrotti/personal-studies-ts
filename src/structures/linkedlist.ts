interface ILinkedList<T> {
  insertInBegin(data: T): LinkedListNode<T>;
  insertAtEnd(data: T): LinkedListNode<T>;
  deleteNode(node: LinkedListNode<T>): void;
  traverse(): T[];
  size(): number;
  search(comparator: (data: T) => boolean): LinkedListNode<T> | null;
}

export class LinkedListNode<T> {
  public next: LinkedListNode<T> | null = null;
  public prev: LinkedListNode<T> | null = null;
  constructor(public data: T) {}
}

export class LinkedList<T> implements ILinkedList<T> {
  private head: LinkedListNode<T> | null = null;

  public insertInBegin(data: T): LinkedListNode<T> {
    const node = new LinkedListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    return node;
  }

  public deleteNode(node: LinkedListNode<T>): void {
    if (!node.prev) {
      this.head = node.next;
    }
    const prevNode = node.prev;
    const nextNode = node.next;
    if (prevNode) prevNode.next = nextNode;
    if (nextNode) nextNode.prev = prevNode;
    node.next = null;
    node.prev = null;
  }

  public insertAtEnd(data: T): LinkedListNode<T> {
    const node = new LinkedListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      const getLast = (node: LinkedListNode<T>): LinkedListNode<T> => {
        return node.next ? getLast(node.next) : node;
      };

      const lastNode = getLast(this.head);
      lastNode.next = node;
      node.prev = lastNode;
    }

    return node;
  }

  public search(comparator: (data: T) => boolean): LinkedListNode<T> | null {
    if (!this.head) {
      return null;
    }

    const find = (node: LinkedListNode<T>): LinkedListNode<T> | null => {
      if (comparator(node.data)) {
        return node;
      } else {
        return node.next ? find(node.next) : null;
      }
    };
    return find(this.head);
  }

  public delete(comparator: (data: T) => boolean): void {
    const node = this.search(comparator);
    if (node) {
      this.deleteNode(node);
    }
  }

  public size(): number {
    if (!this.head) {
      return 0;
    }

    const elementCount = (node: LinkedListNode<T>, count = 0) => {
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

    const putNodeDataIntoArray = (node: LinkedListNode<T>) => {
      array.push(node.data);
      if (node.next) {
        putNodeDataIntoArray(node.next);
      }
      return array;
    };

    return putNodeDataIntoArray(this.head);
  }
}
