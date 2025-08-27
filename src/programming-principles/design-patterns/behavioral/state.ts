// Interfaccia dello stato
interface ATMState {
  insertCard(): void;
  enterPin(pin: number): void;
  withdraw(amount: number): void;
}

// Contesto: il bancomat
class ATM {
  private state: ATMState;
  // Inizializzo lo stato corrente con il primo stato
  constructor() {
    this.state = new NoCardState(this);
  }

  setState(state: ATMState): void {
    this.state = state;
  }

  // Metodi che delegano allo stato corrente il comportamento
  insertCard(): void {
    this.state.insertCard();
  }

  enterPin(pin: number): void {
    this.state.enterPin(pin);
  }

  withdraw(amount: number): void {
    this.state.withdraw(amount);
  }
}

// Stati concreti
class NoCardState implements ATMState {
  // Stato inizializzato con il contesto
  constructor(private atm: ATM) {}

  // Definizione dei metodi per questo stato
  insertCard(): void {
    console.log("💳 Carta inserita.");
    this.atm.setState(new HasCardState(this.atm));
  }

  enterPin(): void {
    console.log("❌ Inserisci prima la carta.");
  }

  withdraw(): void {
    console.log("❌ Inserisci prima la carta.");
  }
}

class HasCardState implements ATMState {
  // Stato inizializzato con il contesto
  constructor(private atm: ATM) {}

  // Definizione dei metodi per questo stato
  insertCard(): void {
    console.log("❌ Carta già inserita.");
  }

  enterPin(pin: number): void {
    if (pin === 1234) {
      console.log("✅ PIN corretto.");
      this.atm.setState(new AuthenticatedState(this.atm));
    } else {
      console.log("❌ PIN errato.");
    }
  }

  withdraw(): void {
    console.log("❌ Inserisci il PIN prima di prelevare.");
  }
}

class AuthenticatedState implements ATMState {
  // Stato inizializzato con il contesto
  constructor(private atm: ATM) {}

  // Definizione dei metodi per questo stato
  insertCard(): void {
    console.log("❌ Carta già inserita.");
  }

  enterPin(): void {
    console.log("❌ PIN già inserito.");
  }

  withdraw(amount: number): void {
    console.log(`💵 Prelievo di €${amount} effettuato.`);
    this.atm.setState(new NoCardState(this.atm));
  }
}

// Uso
const atm = new ATM();

atm.withdraw(100); // ❌ Inserisci prima la carta.
atm.enterPin(1234); // ❌ Inserisci prima la carta.
atm.insertCard(); // 💳 Carta inserita.
// dopo aver inserito la carta, lo stato passa a HasCardState
atm.enterPin(1111); // ❌ PIN errato.
atm.enterPin(1234); // ✅ PIN corretto.
// dopo aver inserito il PIN corretto, lo stato passa a AuthenticatedState
atm.withdraw(100); // 💵 Prelievo di €100 effettuato.

// Rende il file un modulo ES6 invece che un file globale
export {};
