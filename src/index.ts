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
import { Graph } from "./w3c/dsa/6-graphs/graph";
import { WeightedGraph } from "./w3c/dsa/6-graphs/weighted-graph";

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

// const binarySearchTree = new BinaryTree<number>();
// const root = binarySearchTree.addRoot(new BinaryTreeNode(13));
// const nodeA = binarySearchTree.addNode(root, new BinaryTreeNode(7), "left");
// const nodeB = binarySearchTree.addNode(root, new BinaryTreeNode(15), "right");
// const nodeC = binarySearchTree.addNode(nodeA, new BinaryTreeNode(3), "left");
// const nodeD = binarySearchTree.addNode(nodeA, new BinaryTreeNode(8), "right");
// const nodeE = binarySearchTree.addNode(nodeB, new BinaryTreeNode(14), "left");
// const nodeF = binarySearchTree.addNode(nodeB, new BinaryTreeNode(19), "right");
// const nodeG = binarySearchTree.addNode(nodeF, new BinaryTreeNode(18), "left");

// console.log(binarySearchTree);
// binarySearchTree.insertIntoBST(6);
// console.log(binarySearchTree.searchIntoBST(7));

// let graph = new Graph(7, "undirected");
// graph.addVertexData(0, "A");
// graph.addVertexData(1, "B");
// graph.addVertexData(2, "C");
// graph.addVertexData(3, "D");
// graph.addVertexData(4, "E");
// graph.addVertexData(5, "F");
// graph.addVertexData(6, "G");
// // Undirected graph example
// graph.addEdge(3, 0); // D -> A
// graph.addEdge(0, 2); // A -> C
// graph.addEdge(0, 3); // A -> D
// graph.addEdge(0, 4); // A -> E
// graph.addEdge(4, 2); // E -> C
// graph.addEdge(2, 5); // C -> F
// graph.addEdge(2, 1); // C -> B
// graph.addEdge(2, 6); // C -> G
// graph.addEdge(1, 5); // B -> F

// // Directed graph example
// // graph.addEdge(3, 0); // D -> A
// // graph.addEdge(3, 4); // D -> E
// // graph.addEdge(0, 2); // A -> C
// // graph.addEdge(4, 0); // E -> A
// // graph.addEdge(2, 5); // C -> F
// // graph.addEdge(2, 4); // C -> E
// // graph.addEdge(2, 6); // C -> G
// // graph.addEdge(1, 2); // B -> C
// // graph.addEdge(5, 1); // F -> B

// graph.printGraph();

// graph.dfs("D");
// graph.bfs("D");

// console.log("isCycling", graph.isCyclic(), graph.isCyclicUnionForUndirected());

const weightedGraph = new WeightedGraph(7, "directed");
weightedGraph.addVertexData(0, "A");
weightedGraph.addVertexData(1, "B");
weightedGraph.addVertexData(2, "C");
weightedGraph.addVertexData(3, "D");
weightedGraph.addVertexData(4, "E");
weightedGraph.addVertexData(5, "F");
weightedGraph.addVertexData(6, "G");

weightedGraph.addEdge(3, 0, 4); // D - A, weight 4
weightedGraph.addEdge(3, 4, 2); // D - E, weight 2
weightedGraph.addEdge(0, 2, 3); // A - C, weight 3
weightedGraph.addEdge(0, 4, 4); // A - E, weight 4
weightedGraph.addEdge(4, 2, 4); // E - C, weight 4
weightedGraph.addEdge(4, 6, 5); // E - G, weight 5
weightedGraph.addEdge(2, 5, 5); // C - F, weight 5
weightedGraph.addEdge(1, 2, 2); // B - C, weight 2
weightedGraph.addEdge(1, 5, 2); // B - F, weight 2
weightedGraph.addEdge(6, 5, 5); // G - F, weight 5

weightedGraph.printGraph();
weightedGraph.printDijkstra(weightedGraph.dijkstra("D"));
console.log("Dijkstra with destination");
console.log(weightedGraph.dijkstraWithDestination("D", "G"));
