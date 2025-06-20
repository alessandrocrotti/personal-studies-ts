import { bubbleSort, bubbleSortW3C } from "./bubble-sort";

describe("Check bubble sort", () => {
  it("check bubbleSort() empty", () => {
    expect(bubbleSort([])).toEqual([]);
  });

  it("check bubbleSort() single", () => {
    expect(bubbleSort([1])).toEqual([1]);
  });

  it("check bubbleSort() two elements sorted", () => {
    expect(bubbleSort([1, 2])).toEqual([1, 2]);
  });

  it("check bubbleSort() two elements unsorted", () => {
    expect(bubbleSort([2, 1])).toEqual([1, 2]);
  });

  it("check bubbleSort() positives", () => {
    expect(bubbleSort([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });

  it("check bubbleSort() positives and negatives", () => {
    expect(bubbleSort([29, 3, -12, 45, 1, -321, 22])).toEqual([-321, -12, 1, 3, 22, 29, 45]);
  });
});

describe("Check bubble sort W3C", () => {
  it("check bubbleSortW3C() empty", () => {
    expect(bubbleSortW3C([])).toEqual([]);
  });

  it("check bubbleSortW3C() single", () => {
    expect(bubbleSortW3C([1])).toEqual([1]);
  });

  it("check bubbleSortW3C() two elements sorted", () => {
    expect(bubbleSortW3C([1, 2])).toEqual([1, 2]);
  });

  it("check bubbleSortW3C() two elements unsorted", () => {
    expect(bubbleSortW3C([2, 1])).toEqual([1, 2]);
  });

  it("check bubbleSortW3C() positives", () => {
    expect(bubbleSortW3C([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });

  it("check bubbleSortW3C() positives and negatives", () => {
    expect(bubbleSortW3C([29, 3, -12, 45, 1, -321, 22])).toEqual([-321, -12, 1, 3, 22, 29, 45]);
  });
});
