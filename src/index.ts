import { binarySearch, binarySearchW3C } from "./w3c/dsa/1-arrays/binary-search";
import { bubbleSort, bubbleSortW3C } from "./w3c/dsa/1-arrays/bubble-sort";
import { countingSort } from "./w3c/dsa/1-arrays/counting-sort";
import { insertionSort, insertionSortW3C } from "./w3c/dsa/1-arrays/insertion-sort";
import { mergeSortW3C } from "./w3c/dsa/1-arrays/merge-sort";
import { quickSortW3C } from "./w3c/dsa/1-arrays/quick-sort";
import { radixSort } from "./w3c/dsa/1-arrays/radix-sort";
import { SinglyLinkedList } from "./w3c/dsa/2-linked-lists/singly-linkedlist";
import { ArrayTree } from "./w3c/dsa/5-tree/array-tree";
import { BinaryTree, BinaryTreeNode } from "./w3c/dsa/5-tree/binary-tree";

export function getMessage(): string {
  const message: string = "Hello world!";
  console.log(message);
  return message;
}

// getMessage();

// bubbleSort([29, 3, -12, 45, 1, -321, 22]);
// bubbleSortW3C([29, 3, -12, 45, 1, -321, 22]);

// bubbleSortW3C([7, 3, 9, 12, 11]);
// countingSort([2, 4, 3, 2, 1, 1, 4]);
// mergeSortW3C([12, 29, 3, 12, 45, 1, 321, 22]);

// console.log("result", binarySearchW3C([1, 2, 3, 3, 7, 9, 10], 9));

// const linkedList = new SinglyLinkedList<string>();
// linkedList.insertInBegin("3");
// linkedList.insertInBegin("2");
// linkedList.insertInBegin("1");

// const node = linkedList.search((el) => el === "4");
// console.log("search", node);
// if (node) {
//   linkedList.deleteNode(node);
// }
// console.log(linkedList.traverse());

// const arrayTree = new ArrayTree<string>();
// const rootIndex = arrayTree.addData(0, "R");
// const nodeIndexA = arrayTree.addData(arrayTree.leftChildIndex(rootIndex), "A");
// const nodeIndexB = arrayTree.addData(arrayTree.rightChildIndex(rootIndex), "B");
// const nodeIndexC = arrayTree.addData(arrayTree.leftChildIndex(nodeIndexA), "C");
// const nodeIndexD = arrayTree.addData(arrayTree.rightChildIndex(nodeIndexA), "D");
// const nodeIndexE = arrayTree.addData(arrayTree.leftChildIndex(nodeIndexB), "E");
// const nodeIndexF = arrayTree.addData(arrayTree.rightChildIndex(nodeIndexB), "F");
// const nodeIndexG = arrayTree.addData(arrayTree.leftChildIndex(nodeIndexF), "G");
// for (let index = 0; index < 16; index++) {
//   const element = arrayTree.getData(index);
//   //console.log(element);
// }
// console.log(arrayTree.preOrder());

const binarySearchTree = new BinaryTree<number>();
const root = binarySearchTree.addRoot(new BinaryTreeNode(13));
const nodeA = binarySearchTree.addNode(root, new BinaryTreeNode(7), "left");
const nodeB = binarySearchTree.addNode(root, new BinaryTreeNode(15), "right");
const nodeC = binarySearchTree.addNode(nodeA, new BinaryTreeNode(3), "left");
const nodeD = binarySearchTree.addNode(nodeA, new BinaryTreeNode(8), "right");
const nodeE = binarySearchTree.addNode(nodeB, new BinaryTreeNode(14), "left");
const nodeF = binarySearchTree.addNode(nodeB, new BinaryTreeNode(19), "right");
const nodeG = binarySearchTree.addNode(nodeF, new BinaryTreeNode(18), "left");

console.log(binarySearchTree);
binarySearchTree.insertIntoBST(6);
console.log(binarySearchTree.searchIntoBST(7));
