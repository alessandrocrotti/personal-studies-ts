// Memento: salva lo stato
class TextMemento {
  constructor(private readonly content: string) {}

  getContent(): string {
    return this.content;
  }
}

// Originator: l'editor
class TextEditor {
  private content: string = "";

  write(text: string): void {
    this.content += text;
  }

  getContent(): string {
    return this.content;
  }

  save(): TextMemento {
    return new TextMemento(this.content);
  }

  restore(memento: TextMemento): void {
    this.content = memento.getContent();
  }
}

// Caretaker: gestisce gli stati salvati
class History {
  private mementos: TextMemento[] = [];

  push(memento: TextMemento): void {
    this.mementos.push(memento);
  }

  pop(): TextMemento | undefined {
    return this.mementos.pop();
  }
}

// Uso

const editor = new TextEditor();
const history = new History();

editor.write("Ciao");
history.push(editor.save());

editor.write(" mondo!");
history.push(editor.save());

editor.write(" Come va?");
console.log("📝 Contenuto attuale:", editor.getContent()); // Ciao mondo! Come va?

editor.restore(history.pop()!);
console.log("↩️ Undo:", editor.getContent()); // Ciao mondo!

editor.restore(history.pop()!);
console.log("↩️ Undo:", editor.getContent()); // Ciao

// Rende il file un modulo ES6 invece che un file globale
export {};
