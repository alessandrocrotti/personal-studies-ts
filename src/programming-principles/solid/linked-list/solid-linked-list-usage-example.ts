import { SinglyLinkedList } from "./solid-singly-linked-list";
import { DoublyLinkedList } from "./solid-doubly-linked-list";

// Singly Linked List Example
const singly = new SinglyLinkedList<number>();
singly.insertInBegin(3);
singly.insertInBegin(2);
singly.insertInBegin(1);
console.log("Singly Linked List traverse:", singly.traverse());

const foundSingly = singly.search((data) => data === 2);
console.log("Singly Linked List search for 2:", foundSingly ? foundSingly.data : "Not found");

if (foundSingly) singly.deleteNode(foundSingly);
console.log("Singly Linked List after deleting 2:", singly.traverse());

// Doubly Linked List Example
const doubly = new DoublyLinkedList<number>();
doubly.insertInBegin(2);
doubly.insertAtEnd(3);
doubly.insertInBegin(1);
console.log("Doubly Linked List traverse:", doubly.traverse());

const foundDoubly = doubly.search((data) => data === 3);
console.log("Doubly Linked List search for 3:", foundDoubly ? foundDoubly.data : "Not found");

doubly.delete((data) => data === 2);
console.log("Doubly Linked List after deleting 2:", doubly.traverse());
