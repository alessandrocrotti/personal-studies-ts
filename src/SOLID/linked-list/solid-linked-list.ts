// Interfaces for nodes and lists

export interface ILinkedListNode<T> {
  data: T;
  next: ILinkedListNode<T> | null;
}

export interface IDoublyLinkedListNode<T> extends ILinkedListNode<T> {
  prev: IDoublyLinkedListNode<T> | null;
}

export interface ILinkedList<T, N extends ILinkedListNode<T>> {
  getHead(): N | null;
  setHead(node: N | null): void;
  size(): number;
  traverse(): T[];
}

// Singly linked list node
export class SinglyLinkedListNode<T> implements ILinkedListNode<T> {
  next: SinglyLinkedListNode<T> | null = null;
  constructor(public data: T) {}
}

// Doubly linked list node
export class DoublyLinkedListNode<T> implements IDoublyLinkedListNode<T> {
  next: DoublyLinkedListNode<T> | null = null;
  prev: DoublyLinkedListNode<T> | null = null;
  constructor(public data: T) {}
}
