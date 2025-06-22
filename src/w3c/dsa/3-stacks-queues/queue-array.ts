class Queue<T> {
  private queue: T[] = [];

  enqueue(element: T): void {
    this.queue.push(element);
  }

  dequeue(): T | string {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.queue.shift()!;
  }

  peek(): T | string {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.queue[0];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  size(): number {
    return this.queue.length;
  }
}
