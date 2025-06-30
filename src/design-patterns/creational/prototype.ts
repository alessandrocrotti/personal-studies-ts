interface Drawable {
  draw(): void;
}

interface Clonable<T> {
  clone(): T;
}

interface Shape extends Drawable, Clonable<Shape> {}

class Circle implements Shape {
  constructor(public radius: number, public color: string) {}

  clone(): Shape {
    return new Circle(this.radius, this.color);
  }

  draw(): void {
    console.log(`Cerchio di raggio ${this.radius} e colore ${this.color}`);
  }
}

// Prototype
const original = new Circle(10, "red");
// Clonazione
const copy = original.clone();

original.draw(); // Cerchio di raggio 10 e colore red
copy.draw(); // Cerchio di raggio 10 e colore red

console.log(original === copy); // false → sono due oggetti distinti

// Rende il file un modulo ES6 invece che un file globale
export {};
