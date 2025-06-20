import { mergeSortW3C } from "./merge-sort";

describe("Check merge sort W3C", () => {
  it("check mergeSortW3C() empty", () => {
    expect(mergeSortW3C([])).toEqual([]);
  });

  it("check mergeSortW3C() single", () => {
    expect(mergeSortW3C([1])).toEqual([1]);
  });

  it("check mergeSortW3C() two elements sorted", () => {
    expect(mergeSortW3C([1, 2])).toEqual([1, 2]);
  });

  it("check mergeSortW3C() two elements unsorted", () => {
    expect(mergeSortW3C([2, 1])).toEqual([1, 2]);
  });

  it("check mergeSortW3C() positives", () => {
    expect(mergeSortW3C([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });

  it("check mergeSortW3C() positives and negatives", () => {
    expect(mergeSortW3C([29, 3, -12, 45, 1, -321, 22])).toEqual([-321, -12, 1, 3, 22, 29, 45]);
  });
});
