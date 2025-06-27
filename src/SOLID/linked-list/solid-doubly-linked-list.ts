import { ILinkedList, DoublyLinkedListNode } from "./solid-linked-list";

export class DoublyLinkedList<T> implements ILinkedList<T, DoublyLinkedListNode<T>> {
  private head: DoublyLinkedListNode<T> | null = null;

  getHead(): DoublyLinkedListNode<T> | null {
    return this.head;
  }

  setHead(node: DoublyLinkedListNode<T> | null): void {
    this.head = node;
  }

  insertInBegin(data: T): DoublyLinkedListNode<T> {
    const node = new DoublyLinkedListNode(data);
    if (this.head) {
      this.head.prev = node;
      node.next = this.head;
    }
    this.head = node;
    return node;
  }

  insertAtEnd(data: T): DoublyLinkedListNode<T> {
    const node = new DoublyLinkedListNode(data);
    if (!this.head) {
      this.head = node;
    } else {
      let last = this.head;
      while (last.next) {
        last = last.next;
      }
      last.next = node;
      node.prev = last;
    }
    return node;
  }

  deleteNode(node: DoublyLinkedListNode<T>): void {
    if (!node.prev) {
      this.head = node.next;
    }
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    node.next = null;
    node.prev = null;
  }

  search(comparator: (data: T) => boolean): DoublyLinkedListNode<T> | null {
    let node = this.head;
    while (node) {
      if (comparator(node.data)) return node;
      node = node.next;
    }
    return null;
  }

  delete(comparator: (data: T) => boolean): void {
    const node = this.search(comparator);
    if (node) this.deleteNode(node);
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
