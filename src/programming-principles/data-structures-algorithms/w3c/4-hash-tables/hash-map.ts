class SimpleHashMap {
  private size: number;
  private buckets: [string, any][][];

  constructor(size: number = 100) {
    this.size = size;
    this.buckets = Array.from({ length: size }, () => []);
  }

  private hashFunction(key: string): number {
    const numericSum = key
      .split("")
      .filter((c) => /\d/.test(c))
      .reduce((sum, char) => sum + parseInt(char, 10), 0);
    return numericSum % 10;
  }

  put(key: string, value: any): void {
    const index = this.hashFunction(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      const [k, _] = bucket[i];
      if (k === key) {
        bucket[i] = [key, value];
        return;
      }
    }
    bucket.push([key, value]);
  }

  get(key: string): any | null {
    const index = this.hashFunction(key);
    const bucket = this.buckets[index];
    for (const [k, v] of bucket) {
      if (k === key) {
        return v;
      }
    }
    return null;
  }

  remove(key: string): void {
    const index = this.hashFunction(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      const [k, _] = bucket[i];
      if (k === key) {
        bucket.splice(i, 1);
        return;
      }
    }
  }

  printMap(): void {
    console.log("Hash Map Contents:");
    this.buckets.forEach((bucket, index) => {
      console.log(`Bucket ${index}:`, bucket);
    });
  }
}
