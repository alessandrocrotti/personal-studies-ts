import { SinglyLinkedList, SinglyLinkedListNode } from "./singly-linkedlist";

describe("Check doubly linked list", () => {
  let linkedList: SinglyLinkedList<string>;
  beforeEach(() => {
    linkedList = new SinglyLinkedList<string>();
    linkedList.insertInBegin("3");
    linkedList.insertInBegin("2");
    linkedList.insertInBegin("1");
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

  it("check getNode() by position", () => {
    expect(linkedList.getNode(1)?.data).toBe("2");
  });

  it("check insertNode() in position", () => {
    linkedList.insertNode(new SinglyLinkedListNode("1,5"), 1);
    expect(linkedList.traverse()).toEqual(["1", "1,5", "2", "3"]);
  });

  it("check search() ", () => {
    expect(linkedList.search((el) => el === "2")?.data).toBe("2");
  });

  it("check deleteNode() first", () => {
    linkedList.deleteNode(linkedList.search((el) => el === "1")!);
    expect(linkedList.traverse()).toEqual(["2", "3"]);
  });

  it("check deleteNode(2) middle", () => {
    linkedList.deleteNode(linkedList.search((el) => el === "2")!);
    expect(linkedList.traverse()).toEqual(["1", "3"]);
  });

  it("check deleteNode(3) last", () => {
    linkedList.deleteNode(linkedList.search((el) => el === "3")!);
    expect(linkedList.traverse()).toEqual(["1", "2"]);
  });
});
