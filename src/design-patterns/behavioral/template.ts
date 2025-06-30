abstract class Beverage {
  // Template method
  prepare(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
  }

  private boilWater(): void {
    console.log("Bollire l'acqua");
  }

  protected abstract brew(): void;

  private pourInCup(): void {
    console.log("Versare nella tazza");
  }

  protected abstract addCondiments(): void;
}

// Sottoclassi che implementano i metodi astratti
class Tea extends Beverage {
  protected brew(): void {
    console.log("Infondere la bustina di tè");
  }

  protected addCondiments(): void {
    console.log("Aggiungere limone");
  }
}

class Coffee extends Beverage {
  protected brew(): void {
    console.log("Filtrare il caffè");
  }

  protected addCondiments(): void {
    console.log("Aggiungere zucchero e latte");
  }
}

// Uso
const tea = new Tea();
console.log("Preparazione del tè:");
tea.prepare();

console.log("\nPreparazione del caffè:");
const coffee = new Coffee();
coffee.prepare();

// Rende il file un modulo ES6 invece che un file globale
export {};
