import { countingSort, countingSortW3C } from "./counting-sort";

describe("Check counting sort", () => {
  it("check countingSort() empty", () => {
    expect(countingSort([])).toEqual([]);
  });

  it("check countingSort() single", () => {
    expect(countingSort([1])).toEqual([1]);
  });

  it("check countingSort() two elements sorted", () => {
    expect(countingSort([1, 2])).toEqual([1, 2]);
  });

  it("check countingSort() two elements unsorted", () => {
    expect(countingSort([2, 1])).toEqual([1, 2]);
  });

  it("check countingSort() positives", () => {
    expect(countingSort([1, 3, 2, 2, 1, 3, 4])).toEqual([1, 1, 2, 2, 3, 3, 4]);
  });

  it("check countingSort() positives with gaps", () => {
    expect(countingSort([1, 3, 1, 3, 4])).toEqual([1, 1, 3, 3, 4]);
  });
});

describe("Check counting sort W3C", () => {
  it("check countingSortW3C() empty", () => {
    expect(countingSortW3C([])).toEqual([]);
  });

  it("check countingSortW3C() single", () => {
    expect(countingSortW3C([1])).toEqual([1]);
  });

  it("check countingSortW3C() two elements sorted", () => {
    expect(countingSortW3C([1, 2])).toEqual([1, 2]);
  });

  it("check countingSortW3C() two elements unsorted", () => {
    expect(countingSortW3C([2, 1])).toEqual([1, 2]);
  });

  it("check countingSortW3C() positives", () => {
    expect(countingSortW3C([1, 3, 2, 2, 1, 3, 4])).toEqual([1, 1, 2, 2, 3, 3, 4]);
  });

  it("check countingSortW3C() positives with gaps", () => {
    expect(countingSortW3C([1, 3, 1, 3, 4])).toEqual([1, 1, 3, 3, 4]);
  });
});
