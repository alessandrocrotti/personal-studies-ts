interface IDoublyLinkedList<T> {
  insertInBegin(data: T): DoublyLinkedListNode<T>;
  deleteNode(node: DoublyLinkedListNode<T>): void;
  insertAtEnd(data: T): DoublyLinkedListNode<T>;
  search(comparator: (data: T) => boolean): DoublyLinkedListNode<T> | null;
  delete(comparator: (data: T) => boolean): void;
  size(): number;
  traverse(): T[];
}

export class DoublyLinkedListNode<T> {
  public next: DoublyLinkedListNode<T> | null = null;
  public prev: DoublyLinkedListNode<T> | null = null;
  constructor(public data: T) {}
}

export class DoublyLinkedList<T> implements IDoublyLinkedList<T> {
  private head: DoublyLinkedListNode<T> | null = null;

  public insertInBegin(data: T): DoublyLinkedListNode<T> {
    const node = new DoublyLinkedListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    return node;
  }

  public deleteNode(node: DoublyLinkedListNode<T>): void {
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

  public insertAtEnd(data: T): DoublyLinkedListNode<T> {
    const node = new DoublyLinkedListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      const getLast = (node: DoublyLinkedListNode<T>): DoublyLinkedListNode<T> => {
        return node.next ? getLast(node.next) : node;
      };

      const lastNode = getLast(this.head);
      lastNode.next = node;
      node.prev = lastNode;
    }

    return node;
  }

  public search(comparator: (data: T) => boolean): DoublyLinkedListNode<T> | null {
    if (!this.head) {
      return null;
    }

    const find = (node: DoublyLinkedListNode<T>): DoublyLinkedListNode<T> | null => {
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

    const elementCount = (node: DoublyLinkedListNode<T>, count = 0) => {
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

    const putNodeDataIntoArray = (node: DoublyLinkedListNode<T>) => {
      array.push(node.data);
      if (node.next) {
        putNodeDataIntoArray(node.next);
      }
      return array;
    };

    return putNodeDataIntoArray(this.head);
  }
}
