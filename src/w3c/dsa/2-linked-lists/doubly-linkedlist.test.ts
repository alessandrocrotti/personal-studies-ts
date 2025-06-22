import { DoublyLinkedList } from "./doubly-linkedlist";

describe("Check doubly linked list", () => {
  let linkedList: DoublyLinkedList<string>;
  beforeEach(() => {
    linkedList = new DoublyLinkedList<string>();
    linkedList.insertAtEnd("1");
    linkedList.insertAtEnd("2");
    linkedList.insertAtEnd("3");
  });

  it("check size() ", () => {
    expect(linkedList.size()).toBe(3);
  });

  it("check traverse()", () => {
    expect(linkedList.traverse()).toEqual(["1", "2", "3"]);
  });

  it("check insertInBegin() ", () => {
    linkedList.insertInBegin("0");
    expect(linkedList.traverse()).toEqual(["0", "1", "2", "3"]);
  });

  it("check insertAtEnd() ", () => {
    linkedList.insertAtEnd("4");
    expect(linkedList.traverse()).toEqual(["1", "2", "3", "4"]);
  });

  it("check search() ", () => {
    expect(linkedList.search((el) => el === "2")?.data).toBe("2");
  });

  it("check delete() ", () => {
    linkedList.delete((el) => el === "2");
    expect(linkedList.traverse()).toEqual(["1", "3"]);
  });

  it("check deleteNode() ", () => {
    linkedList.deleteNode(linkedList.search((el) => el === "2")!);
    expect(linkedList.traverse()).toEqual(["1", "3"]);
  });
});
