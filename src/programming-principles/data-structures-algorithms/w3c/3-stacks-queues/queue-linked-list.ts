class QueueNode<T> {
  data: T;
  // This is the following element in the queue
  next: QueueNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

class LinkedListQueue<T> {
  // Here we have 2 "head" nodes to keep pointer on last and first element
  private front: QueueNode<T> | null = null;
  private rear: QueueNode<T> | null = null;
  private length: number = 0;

  enqueue(element: T): void {
    const newNode = new QueueNode(element);
    if (this.rear === null) {
      this.front = this.rear = newNode;
    } else {
      this.rear.next = newNode;
      this.rear = newNode;
    }
    this.length++;
  }

  dequeue(): T | string {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    const temp = this.front!;
    this.front = this.front!.next;
    this.length--;
    if (this.front === null) {
      this.rear = null;
    }
    return temp.data;
  }

  peek(): T | string {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.front!.data;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  size(): number {
    return this.length;
  }

  printQueue(): void {
    let temp = this.front;
    const values: T[] = [];
    while (temp) {
      values.push(temp.data);
      temp = temp.next;
    }
    console.log(values.join(" "));
  }
}
