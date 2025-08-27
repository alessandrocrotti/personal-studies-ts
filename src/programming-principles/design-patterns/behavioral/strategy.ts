// Interfaccia della strategia
interface OperationStrategy {
  execute(a: number, b: number): number;
}

// Strategie concrete
class AdditionStrategy implements OperationStrategy {
  execute(a: number, b: number): number {
    return a + b;
  }
}

class SubtractionStrategy implements OperationStrategy {
  execute(a: number, b: number): number {
    return a - b;
  }
}

class MultiplicationStrategy implements OperationStrategy {
  execute(a: number, b: number): number {
    return a * b;
  }
}

class DivisionStrategy implements OperationStrategy {
  execute(a: number, b: number): number {
    if (b === 0) throw new Error("Divisione per zero!");
    return a / b;
  }
}

// Contesto che usa la strategia
class Calculator {
  constructor(private strategy: OperationStrategy) {}

  setStrategy(strategy: OperationStrategy): void {
    this.strategy = strategy;
  }

  calculate(a: number, b: number): number {
    return this.strategy.execute(a, b);
  }
}

// Uso
const calculator = new Calculator(new AdditionStrategy());
console.log("Somma:", calculator.calculate(10, 5)); // 15

calculator.setStrategy(new MultiplicationStrategy());
console.log("Moltiplicazione:", calculator.calculate(10, 5)); // 50

calculator.setStrategy(new DivisionStrategy());
console.log("Divisione:", calculator.calculate(10, 2)); // 5

// OPPURE IN UN CONTESTO DI PAGAMENTO

// Interfaccia della strategia di pagamento
interface PaymentStrategy {
  pay(amount: number): void;
}

// Strategie concrete
class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string) {}

  pay(amount: number): void {
    console.log(`💳 Pagamento di €${amount} con carta ${this.cardNumber}`);
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  pay(amount: number): void {
    console.log(`📧 Pagamento di €${amount} tramite PayPal (${this.email})`);
  }
}

class CryptoPayment implements PaymentStrategy {
  constructor(private walletAddress: string) {}

  pay(amount: number): void {
    console.log(`🪙 Pagamento di €${amount} in crypto dal wallet ${this.walletAddress}`);
  }
}

// Contesto: il checkout
class Checkout {
  constructor(private paymentStrategy: PaymentStrategy) {}

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  processOrder(amount: number): void {
    this.paymentStrategy.pay(amount);
  }
}

// Uso
const checkout = new Checkout(new CreditCardPayment("1234-5678-9876-5432"));
checkout.processOrder(49.99);

checkout.setPaymentStrategy(new PayPalPayment("utente@email.com"));
checkout.processOrder(19.99);

checkout.setPaymentStrategy(new CryptoPayment("0xABCDEF1234567890"));
checkout.processOrder(99.99);

// Rende il file un modulo ES6 invece che un file globale
export {};
