import { LinkedList } from "./structures/linkedlist";

export function getMessage(): string {
  const message: string = "Hello world!";
  console.log(message);
  return message;
}

getMessage();

function linkedListTest() {
  const linkedList = new LinkedList<String>();
  linkedList.insertAtEnd("1");
  linkedList.insertAtEnd("2");
  linkedList.insertAtEnd("3");
}
linkedListTest();
