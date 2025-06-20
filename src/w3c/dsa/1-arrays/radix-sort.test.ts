import { radixSort, radixSortW3C } from "./radix-sort";

describe("Check radix sort", () => {
  it("check radixSort() empty", () => {
    expect(radixSort([])).toEqual([]);
  });

  it("check radixSort() single", () => {
    expect(radixSort([1])).toEqual([1]);
  });

  it("check radixSort() two elements sorted", () => {
    expect(radixSort([1, 2])).toEqual([1, 2]);
  });

  it("check radixSort() two elements unsorted", () => {
    expect(radixSort([2, 1])).toEqual([1, 2]);
  });

  it("check radixSort() positives", () => {
    expect(radixSort([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });
});

describe("Check radix sort W3C", () => {
  it("check radixSortW3C() empty", () => {
    expect(radixSortW3C([])).toEqual([]);
  });

  it("check radixSortW3C() single", () => {
    expect(radixSortW3C([1])).toEqual([1]);
  });

  it("check radixSortW3C() two elements sorted", () => {
    expect(radixSortW3C([1, 2])).toEqual([1, 2]);
  });

  it("check radixSortW3C() two elements unsorted", () => {
    expect(radixSortW3C([2, 1])).toEqual([1, 2]);
  });

  it("check radixSortW3C() positives", () => {
    expect(radixSortW3C([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });
});
