import { BinaryTreeNode } from "./solid-binary-tree";
import { BinarySearchTree } from "./solid-binary-search-tree";
import { PreOrderTraversal, InOrderTraversal, PostOrderTraversal } from "./solid-binary-tree-traversal";

// Create a Binary Search Tree and insert values
const bst = new BinarySearchTree<number>();
[50, 30, 70, 20, 40, 60, 80].forEach((value) => bst.insert(value));

console.log("BST after insertion:");
console.log("Root:", bst.getRoot()?.data);

// Traversal examples
const preOrder = new PreOrderTraversal<number>();
const inOrder = new InOrderTraversal<number>();
const postOrder = new PostOrderTraversal<number>();

console.log("Pre-order traversal:", preOrder.traverse(bst));
console.log("In-order traversal:", inOrder.traverse(bst));
console.log("Post-order traversal:", postOrder.traverse(bst));

// Search for a value
const searchValue = 60;
const foundNode = bst.search(searchValue);
console.log(`Search for ${searchValue}:`, foundNode ? `Found node with data ${foundNode.data}` : "Not found");

// Delete a value
const deleteValue = 30;
bst.delete(deleteValue);
console.log(`BST after deleting ${deleteValue}:`);
console.log("In-order traversal:", inOrder.traverse(bst));

// Find minimum value node
const minNode = bst.minValueNode();
console.log("Minimum value in BST:", minNode ? minNode.data : "Tree is empty");
