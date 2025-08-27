import { selectionSort } from "./selection-sort";

describe("Check selection sort", () => {
  it("check selectionSort() empty", () => {
    expect(selectionSort([])).toEqual([]);
  });

  it("check selectionSort() single", () => {
    expect(selectionSort([1])).toEqual([1]);
  });

  it("check selectionSort() two elements sorted", () => {
    expect(selectionSort([1, 2])).toEqual([1, 2]);
  });

  it("check selectionSort() two elements unsorted", () => {
    expect(selectionSort([2, 1])).toEqual([1, 2]);
  });

  it("check selectionSort() positives", () => {
    expect(selectionSort([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });

  it("check selectionSort() positives and negatives", () => {
    expect(selectionSort([29, 3, -12, 45, 1, -321, 22])).toEqual([-321, -12, 1, 3, 22, 29, 45]);
  });
});
