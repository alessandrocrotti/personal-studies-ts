// Interfaccia del gestore
abstract class Approver {
  protected nextApprover?: Approver;

  setNext(approver: Approver): Approver {
    this.nextApprover = approver;
    return approver;
  }

  handleRequest(amount: number): void {
    if (this.nextApprover) {
      this.nextApprover.handleRequest(amount);
    } else {
      console.log("Nessuno può approvare questa richiesta.");
    }
  }
}

// Implementazioni concrete
class TeamLead extends Approver {
  handleRequest(amount: number): void {
    if (amount <= 1000) {
      console.log(`Team Lead approva la richiesta di €${amount}`);
    } else {
      super.handleRequest(amount);
    }
  }
}

class Manager extends Approver {
  handleRequest(amount: number): void {
    if (amount <= 5000) {
      console.log(`Manager approva la richiesta di €${amount}`);
    } else {
      super.handleRequest(amount);
    }
  }
}

class Director extends Approver {
  handleRequest(amount: number): void {
    if (amount <= 10000) {
      console.log(`Director approva la richiesta di €${amount}`);
    } else {
      console.log(`Richiesta di €${amount} rifiutata: supera il limite massimo.`);
    }
  }
}

// Uso
const teamLead = new TeamLead();
const manager = new Manager();
const director = new Director();

teamLead.setNext(manager).setNext(director);

teamLead.handleRequest(500); // Team Lead approva
teamLead.handleRequest(3000); // Manager approva
teamLead.handleRequest(8000); // Director approva
teamLead.handleRequest(15000); // Nessuno approva

// Rende il file un modulo ES6 invece che un file globale
export {};
