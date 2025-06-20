import { binarySearch, binarySearchW3C } from "./w3c/dsa/1-arrays/binary-search";
import { bubbleSort, bubbleSortW3C } from "./w3c/dsa/1-arrays/bubble-sort";
import { countingSort } from "./w3c/dsa/1-arrays/counting-sort";
import { insertionSort, insertionSortW3C } from "./w3c/dsa/1-arrays/insertion-sort";
import { mergeSortW3C } from "./w3c/dsa/1-arrays/merge-sort";
import { quickSortW3C } from "./w3c/dsa/1-arrays/quick-sort";
import { radixSort } from "./w3c/dsa/1-arrays/radix-sort";
import { LinkedList } from "./structures/linkedlist";

export function getMessage(): string {
  const message: string = "Hello world!";
  console.log(message);
  return message;
}

// getMessage();

function linkedListTest() {
  const linkedList = new LinkedList<String>();
  linkedList.insertAtEnd("1");
  linkedList.insertAtEnd("2");
  linkedList.insertAtEnd("3");
}
// linkedListTest();

// bubbleSort([29, 3, -12, 45, 1, -321, 22]);
// bubbleSortW3C([29, 3, -12, 45, 1, -321, 22]);

// bubbleSortW3C([7, 3, 9, 12, 11]);
// countingSort([2, 4, 3, 2, 1, 1, 4]);
// mergeSortW3C([12, 29, 3, 12, 45, 1, 321, 22]);

console.log("result", binarySearchW3C([1, 2, 3, 3, 7, 9, 10], 9));
