// Interfaccia comune: component
interface FileSystemItem {
  getName(): string;
  getSize(): number;
}

// Oggetto semplice: foglia
class MyFile implements FileSystemItem {
  constructor(private name: string, private size: number) {}

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.size;
  }
}

// Oggetto che contiene oggetti figli: composite
class Folder implements FileSystemItem {
  private children: FileSystemItem[] = [];

  constructor(private name: string) {}

  add(item: FileSystemItem): void {
    this.children.push(item);
  }

  getName(): string {
    return this.name;
  }

  getSize(): number {
    return this.children.reduce((total, item) => total + item.getSize(), 0);
  }
}

// Uso
const file1 = new MyFile("resume.pdf", 120);
const file2 = new MyFile("photo.jpg", 300);
const file3 = new MyFile("notes.txt", 80);

const folder1 = new Folder("Documents");
folder1.add(file1);
folder1.add(file3);

const folder2 = new Folder("Pictures");
folder2.add(file2);

const root = new Folder("Root");
root.add(folder1);
root.add(folder2);

console.log(`${root.getName()} size: ${root.getSize()} KB`); // Output: Root size: 500 KB

// Rende il file un modulo ES6 invece che un file globale
export {};
