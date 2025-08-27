import { quickSortW3C } from "./quick-sort";

describe("Check quick sort W3C", () => {
  it("check quickSortW3C() empty", () => {
    expect(quickSortW3C([])).toEqual([]);
  });

  it("check quickSortW3C() single", () => {
    expect(quickSortW3C([1])).toEqual([1]);
  });

  it("check quickSortW3C() two elements sorted", () => {
    expect(quickSortW3C([1, 2])).toEqual([1, 2]);
  });

  it("check quickSortW3C() two elements unsorted", () => {
    expect(quickSortW3C([2, 1])).toEqual([1, 2]);
  });

  it("check quickSortW3C() positives", () => {
    expect(quickSortW3C([29, 3, 12, 45, 1, 321, 22])).toEqual([1, 3, 12, 22, 29, 45, 321]);
  });

  it("check quickSortW3C() positives and negatives", () => {
    expect(quickSortW3C([29, 3, -12, 45, 1, -321, 22])).toEqual([-321, -12, 1, 3, 22, 29, 45]);
  });
});
