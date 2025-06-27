import { ILinkedList, SinglyLinkedListNode } from "./solid-linked-list";

export class SinglyLinkedList<T> implements ILinkedList<T, SinglyLinkedListNode<T>> {
  private head: SinglyLinkedListNode<T> | null = null;

  getHead(): SinglyLinkedListNode<T> | null {
    return this.head;
  }

  setHead(node: SinglyLinkedListNode<T> | null): void {
    this.head = node;
  }

  insertInBegin(data: T): SinglyLinkedListNode<T> {
    const node = new SinglyLinkedListNode(data);
    node.next = this.head;
    this.head = node;
    return node;
  }

  deleteNode(node: SinglyLinkedListNode<T>): void {
    if (this.head === node) {
      this.head = this.head.next;
      return;
    }
    let current = this.head;
    while (current && current.next) {
      if (current.next === node) {
        current.next = current.next.next;
        break;
      }
      current = current.next;
    }
  }

  getNode(position: number): SinglyLinkedListNode<T> | null {
    let node = this.head;
    let count = 0;
    while (node) {
      if (count === position) return node;
      node = node.next;
      count++;
    }
    return null;
  }

  insertNode(node: SinglyLinkedListNode<T>, position: number): void {
    if (position === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      const before = this.getNode(position - 1);
      if (before) {
        node.next = before.next;
        before.next = node;
      }
    }
  }

  search(comparator: (data: T) => boolean): SinglyLinkedListNode<T> | null {
    let node = this.head;
    while (node) {
      if (comparator(node.data)) return node;
      node = node.next;
    }
    return null;
  }

  size(): number {
    let count = 0;
    let node = this.head;
    while (node) {
      count++;
      node = node.next;
    }
    return count;
  }

  traverse(): T[] {
    const result: T[] = [];
    let node = this.head;
    while (node) {
      result.push(node.data);
      node = node.next;
    }
    return result;
  }
}
