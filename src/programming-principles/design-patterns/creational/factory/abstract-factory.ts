// Interfacce
interface Button {
  render(): void;
}

interface Checkbox {
  check(): void;
}

// Implementazioni Windows
class WindowsButton implements Button {
  render(): void {
    console.log("Rendering bottone stile Windows");
  }
}

class WindowsCheckbox implements Checkbox {
  check(): void {
    console.log("Checkbox Windows selezionata");
  }
}

// Implementazioni Mac
class MacButton implements Button {
  render(): void {
    console.log("Rendering bottone stile Mac");
  }
}

class MacCheckbox implements Checkbox {
  check(): void {
    console.log("Checkbox Mac selezionata");
  }
}

// Abstract Factory
abstract class GUIFactory {
  abstract createButton(): Button;
  abstract createCheckbox(): Checkbox;

  logCreation(): void {
    console.log("Factory in uso:", this.constructor.name);
  }
}

// Implementazioni factory windows
class WindowsFactory extends GUIFactory {
  createButton(): Button {
    return new WindowsButton();
  }

  createCheckbox(): Checkbox {
    return new WindowsCheckbox();
  }
}

// Implementazioni factory mac
class MacFactory extends GUIFactory {
  createButton(): Button {
    return new MacButton();
  }

  createCheckbox(): Checkbox {
    return new MacCheckbox();
  }
}

// Analogamente a quanto fatto per la factory method, si può creare una factory che genera le factory

// Tipo per la creazione di una factory
type GUIFactoryConstructor = new () => GUIFactory;

// Factory che genera le factory
class FactoryGenerator {
  private static registry = new Map<string, GUIFactoryConstructor>();

  static register(type: string, factory: GUIFactoryConstructor): void {
    this.registry.set(type, factory);
  }

  static getFactory(type: string): GUIFactory {
    const ctor = this.registry.get(type);
    if (!ctor) throw new Error(`Factory "${type}" non registrata`);
    return new ctor();
  }
}

// Uso

// Registrazione delle factory
FactoryGenerator.register("mac", MacFactory);
FactoryGenerator.register("windows", WindowsFactory);

const factory = FactoryGenerator.getFactory("mac");
factory.logCreation();
const button = factory.createButton();
button.render();

// Rende il file un modulo ES6 invece che un file globale
export {};
