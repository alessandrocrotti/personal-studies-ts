import { BinaryTree, BinaryTreeNode } from "./binary-tree";

describe("Check tree", () => {
  let tree: BinaryTree<string>;
  beforeEach(() => {
    tree = new BinaryTree<string>();
    const root = tree.addRoot(new BinaryTreeNode("R"));
    const nodeA = tree.addNode(root, new BinaryTreeNode("A"), "left");
    const nodeB = tree.addNode(root, new BinaryTreeNode("B"), "right");
    const nodeC = tree.addNode(nodeA, new BinaryTreeNode("C"), "left");
    const nodeD = tree.addNode(nodeA, new BinaryTreeNode("D"), "right");
    const nodeE = tree.addNode(nodeB, new BinaryTreeNode("E"), "left");
    const nodeF = tree.addNode(nodeB, new BinaryTreeNode("F"), "right");
    const nodeG = tree.addNode(nodeF, new BinaryTreeNode("G"), "left");
  });

  it("check preOrderTraversal()", () => {
    expect(tree.preOrderTraversal()).toEqual(["R", "A", "C", "D", "B", "E", "F", "G"]);
  });

  it("check inOrderTraversal()", () => {
    expect(tree.inOrderTraversal()).toEqual(["C", "A", "D", "R", "E", "B", "G", "F"]);
  });

  it("check postOrderTraversal()", () => {
    expect(tree.postOrderTraversal()).toEqual(["C", "D", "A", "E", "G", "F", "B", "R"]);
  });
});

describe("Check tree", () => {
  let binarySearchTree: BinaryTree<number>;
  beforeEach(() => {
    binarySearchTree = new BinaryTree<number>();
    const root = binarySearchTree.addRoot(new BinaryTreeNode(13));
    const nodeA = binarySearchTree.addNode(root, new BinaryTreeNode(7), "left");
    const nodeB = binarySearchTree.addNode(root, new BinaryTreeNode(15), "right");
    const nodeC = binarySearchTree.addNode(nodeA, new BinaryTreeNode(3), "left");
    const nodeD = binarySearchTree.addNode(nodeA, new BinaryTreeNode(8), "right");
    const nodeE = binarySearchTree.addNode(nodeB, new BinaryTreeNode(14), "left");
    const nodeF = binarySearchTree.addNode(nodeB, new BinaryTreeNode(19), "right");
    const nodeG = binarySearchTree.addNode(nodeF, new BinaryTreeNode(18), "left");
  });

  it("check binarySearchTree with inOrderTraversal()", () => {
    expect(binarySearchTree.inOrderTraversal()).toEqual([3, 7, 8, 13, 14, 15, 18, 19]);
  });

  it("search into binarySearchTree found 8", () => {
    expect(binarySearchTree.searchIntoBST(8)?.data).toEqual(8);
  });

  it("search into binarySearchTree found 18", () => {
    expect(binarySearchTree.searchIntoBST(18)?.data).toEqual(18);
  });

  it("search into binarySearchTree not found 51", () => {
    expect(binarySearchTree.searchIntoBST(51)).toEqual(null);
  });

  it("insert into binarySearchTree 9", () => {
    binarySearchTree.insertIntoBST(9);
    expect(binarySearchTree.inOrderTraversal()).toEqual([3, 7, 8, 9, 13, 14, 15, 18, 19]);
  });

  it("min value into binarySearchTree", () => {
    expect(binarySearchTree.minValueNodeIntoBST()?.data).toEqual(3);
  });

  it("insert into binarySearchTree 18", () => {
    binarySearchTree.deleteNode(18);
    expect(binarySearchTree.inOrderTraversal()).toEqual([3, 7, 8, 13, 14, 15, 19]);
  });

  it("build balanced binarySearchTree from an unsorted list", () => {
    const binarySearchTree = new BinaryTree<number>();
    binarySearchTree.buildBalancedBSTFromArray([4, 1, 6, 3, 7, 8, 9, 2]);
    expect(binarySearchTree.inOrderTraversal()).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
  });
});
