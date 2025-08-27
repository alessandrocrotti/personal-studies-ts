class MySingleton {
  private static instance: MySingleton;

  private constructor() {
    // Costruttore privato: impedisce l'uso di `new` dall'esterno
    console.log("MySingleton creato");
  }

  static getInstance(): MySingleton {
    // Lazy initialization
    if (!this.instance) {
      this.instance = new MySingleton();
    }
    return this.instance;
  }

  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

// Uso
const logger1 = MySingleton.getInstance();
const logger2 = MySingleton.getInstance();

logger1.log("Ciao mondo!");
console.log(logger1 === logger2); // true

// Rende il file un modulo ES6 invece che un file globale
export {};
