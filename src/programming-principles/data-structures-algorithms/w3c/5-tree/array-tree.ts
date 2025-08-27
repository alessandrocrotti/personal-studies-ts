export class ArrayTree<T> {
  array: T[] = [];

  public addData(index: number, data: T) {
    this.array[index] = data;
    return index;
  }

  public getData(index: number): T | null {
    if (index >= 0 && index < this.array.length) {
      return this.array[index];
    }
    return null;
  }

  public leftChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 1;
  }

  public rightChildIndex(parentIndex: number): number {
    return 2 * parentIndex + 2;
  }

  public preOrder(): T[] {
    const sortedTree: T[] = [];
    const innerFunction = (index: number): void => {
      if (index >= this.array.length || this.array[index] === null) {
        return;
      }
      if (this.array[index]) {
        sortedTree.push(this.array[index]);
      }
      innerFunction(this.leftChildIndex(index));
      innerFunction(this.rightChildIndex(index));
    };
    innerFunction(0);
    return sortedTree;
  }

  public inOrder(): T[] {
    const sortedTree: T[] = [];
    const innerFunction = (index: number): void => {
      if (index >= this.array.length || this.array[index] === null) {
        return;
      }
      innerFunction(this.leftChildIndex(index));
      if (this.array[index]) {
        sortedTree.push(this.array[index]);
      }
      innerFunction(this.rightChildIndex(index));
    };
    innerFunction(0);
    return sortedTree;
  }

  public postOrder(): T[] {
    const sortedTree: T[] = [];
    const innerFunction = (index: number): void => {
      if (index >= this.array.length || this.array[index] === null) {
        return;
      }
      innerFunction(this.leftChildIndex(index));
      innerFunction(this.rightChildIndex(index));
      if (this.array[index]) {
        sortedTree.push(this.array[index]);
      }
    };
    innerFunction(0);
    return sortedTree;
  }
}
