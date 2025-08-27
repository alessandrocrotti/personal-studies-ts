class StackArray<T> {
  private stack: T[] = [];

  push(element: T): void {
    this.stack.push(element);
  }

  pop(): T | string {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.stack.pop()!;
  }

  peek(): T | string {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.stack[this.stack.length - 1];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }

  size(): number {
    return this.stack.length;
  }
}
