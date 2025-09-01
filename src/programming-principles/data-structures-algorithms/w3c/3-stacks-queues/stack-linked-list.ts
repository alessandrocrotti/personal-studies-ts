class StackNode<T> {
  value: T;
  // Next element is the element before/under this in the stack
  next: StackNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class LinkedListStack<T> {
  // In this case, head is always the last element of the stack
  private head: StackNode<T> | null = null;
  private _size: number = 0;

  // Create a new node and set it has new head
  push(value: T): void {
    const newNode = new StackNode(value);
    if (this.head) {
      newNode.next = this.head;
    }
    this.head = newNode;
    this._size++;
  }

  // Remove head node and reassign head to the next node
  pop(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    const poppedNode = this.head!;
    this.head = this.head!.next;
    this._size--;
    return poppedNode.value;
  }

  // Get head value
  peek(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.head!.value;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  stackSize(): number {
    return this._size;
  }
}
