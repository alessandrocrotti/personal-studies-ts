import { ArrayTree } from "./array-tree";

describe("Check tree", () => {
  let arrayTree: ArrayTree<string>;
  beforeEach(() => {
    arrayTree = new ArrayTree<string>();
    const rootIndex = arrayTree.addData(0, "R");
    const nodeIndexA = arrayTree.addData(arrayTree.leftChildIndex(rootIndex), "A");
    const nodeIndexB = arrayTree.addData(arrayTree.rightChildIndex(rootIndex), "B");
    const nodeIndexC = arrayTree.addData(arrayTree.leftChildIndex(nodeIndexA), "C");
    const nodeIndexD = arrayTree.addData(arrayTree.rightChildIndex(nodeIndexA), "D");
    const nodeIndexE = arrayTree.addData(arrayTree.leftChildIndex(nodeIndexB), "E");
    const nodeIndexF = arrayTree.addData(arrayTree.rightChildIndex(nodeIndexB), "F");
    const nodeIndexG = arrayTree.addData(arrayTree.leftChildIndex(nodeIndexF), "G");
  });

  it("check preOrder()", () => {
    expect(arrayTree.preOrder()).toEqual(["R", "A", "C", "D", "B", "E", "F", "G"]);
  });

  it("check inOrder()", () => {
    expect(arrayTree.inOrder()).toEqual(["C", "A", "D", "R", "E", "B", "G", "F"]);
  });

  it("check postOrder()", () => {
    expect(arrayTree.postOrder()).toEqual(["C", "D", "A", "E", "G", "F", "B", "R"]);
  });
});
