import { insertionSort, insertionSortW3C } from "./insertion-sort";

describe("Check insertion sort", () => {
  it("check insertionSort() empty", () => {
    expect(insertionSort([])).toEqual([]);
  });

  it("check insertionSort() single", () => {
    expect(insertionSort([1])).toEqual([1]);
  });

  it("check insertionSort() two elements sorted", () => {
    expect(insertionSort([1, 2])).toEqual([1, 2]);
  });

  it("check insertionSort() two elements unsorted", () => {
    expect(insertionSort([2, 1])).toEqual([1, 2]);
  });

  it("check insertionSort() positives", () => {
    expect(insertionSort([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });

  it("check insertionSort() positives and negatives", () => {
    expect(insertionSort([29, 3, -12, 45, 1, -321, 22])).toEqual([-321, -12, 1, 3, 22, 29, 45]);
  });
});

describe("Check insertion sort W3C", () => {
  it("check insertionSortW3C() empty", () => {
    expect(insertionSortW3C([])).toEqual([]);
  });

  it("check insertionSortW3C() single", () => {
    expect(insertionSortW3C([1])).toEqual([1]);
  });

  it("check insertionSortW3C() two elements sorted", () => {
    expect(insertionSortW3C([1, 2])).toEqual([1, 2]);
  });

  it("check insertionSortW3C() two elements unsorted", () => {
    expect(insertionSortW3C([2, 1])).toEqual([1, 2]);
  });

  it("check insertionSortW3C() positives", () => {
    expect(insertionSortW3C([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });

  it("check insertionSortW3C() positives and negatives", () => {
    expect(insertionSortW3C([29, 3, -12, 45, 1, -321, 22])).toEqual([-321, -12, 1, 3, 22, 29, 45]);
  });
});
