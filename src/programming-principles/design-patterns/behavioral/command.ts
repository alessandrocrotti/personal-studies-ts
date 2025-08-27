// Interfaccia del comando
interface OrderCommand {
  execute(): void;
  undo(): void;
}

// Receiver: la cucina
class Kitchen {
  prepareDish(dish: string): void {
    console.log(`👨‍🍳 Preparazione in corso: ${dish}`);
  }

  cancelDish(dish: string): void {
    console.log(`❌ Ordine annullato: ${dish}`);
  }
}

// Comandi concreti
class PreparePizzaCommand implements OrderCommand {
  constructor(private kitchen: Kitchen) {}

  execute(): void {
    this.kitchen.prepareDish("Pizza Margherita");
  }

  undo(): void {
    this.kitchen.cancelDish("Pizza Margherita");
  }
}

class PreparePastaCommand implements OrderCommand {
  constructor(private kitchen: Kitchen) {}

  execute(): void {
    this.kitchen.prepareDish("Pasta alla Carbonara");
  }

  undo(): void {
    this.kitchen.cancelDish("Pasta alla Carbonara");
  }
}

// Invoker: il cameriere
class Waiter {
  private history: OrderCommand[] = [];

  takeOrder(command: OrderCommand): void {
    command.execute();
    this.history.push(command);
  }

  cancelLastOrder(): void {
    const last = this.history.pop();
    if (last) {
      last.undo();
    }
  }
}

// Uso
const kitchen = new Kitchen();
const waiter = new Waiter();

const pizzaOrder = new PreparePizzaCommand(kitchen);
const pastaOrder = new PreparePastaCommand(kitchen);

waiter.takeOrder(pizzaOrder); // 👨‍🍳 Preparazione in corso: Pizza Margherita
waiter.takeOrder(pastaOrder); // 👨‍🍳 Preparazione in corso: Pasta alla Carbonara

waiter.cancelLastOrder(); // ❌ Ordine annullato: Pasta alla Carbonara

// Rende il file un modulo ES6 invece che un file globale
export {};
