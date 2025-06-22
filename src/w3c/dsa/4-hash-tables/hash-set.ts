class SimpleHashSet {
  private size: number;
  private buckets: string[][];

  constructor(size: number = 100) {
    this.size = size;
    this.buckets = Array.from({ length: size }, () => []);
  }

  private hashFunction(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash += value.charCodeAt(i);
    }
    return hash % this.size;
  }

  add(value: string): void {
    const index = this.hashFunction(value);
    const bucket = this.buckets[index];
    if (!bucket.includes(value)) {
      bucket.push(value);
    }
  }

  contains(value: string): boolean {
    const index = this.hashFunction(value);
    return this.buckets[index].includes(value);
  }

  remove(value: string): void {
    const index = this.hashFunction(value);
    const bucket = this.buckets[index];
    const i = bucket.indexOf(value);
    if (i !== -1) {
      bucket.splice(i, 1);
    }
  }

  printSet(): void {
    console.log("Hash Set Contents:");
    this.buckets.forEach((bucket, index) => {
      console.log(`Bucket ${index}:`, bucket);
    });
  }
}
