// Oggetto da costruire
class Computer {
  private parts: string[] = [];

  addPart(part: string): void {
    this.parts.push(part);
  }

  describe(): void {
    console.log("Computer assemblato con:", this.parts.join(", "));
  }
}

// Interfaccia builder
interface ComputerBuilder {
  reset(): void;
  addCPU(): void;
  addRAM(): void;
  addStorage(): void;
  addGPU(): void;
  getResult(): Computer;
}

// Implementazioni builder
class OfficeComputerBuilder implements ComputerBuilder {
  private computer: Computer = new Computer();

  reset(): void {
    this.computer = new Computer();
  }

  addCPU(): void {
    this.computer.addPart("CPU Intel i5");
  }

  addRAM(): void {
    this.computer.addPart("8GB RAM");
  }

  addStorage(): void {
    this.computer.addPart("256GB SSD");
  }

  addGPU(): void {
    // Nessuna GPU dedicata per l'office PC
  }

  getResult(): Computer {
    return this.computer;
  }
}

class GamingComputerBuilder implements ComputerBuilder {
  private computer: Computer = new Computer();

  reset(): void {
    this.computer = new Computer();
  }

  addCPU(): void {
    this.computer.addPart("CPU AMD Ryzen 9");
  }

  addRAM(): void {
    this.computer.addPart("32GB RAM");
  }

  addStorage(): void {
    this.computer.addPart("1TB NVMe SSD");
  }

  addGPU(): void {
    this.computer.addPart("NVIDIA RTX 4090");
  }

  getResult(): Computer {
    return this.computer;
  }
}

// Director
class ComputerDirector {
  constructor(private builder: ComputerBuilder) {}

  constructBasicPC(): void {
    this.builder.reset();
    this.builder.addCPU();
    this.builder.addRAM();
    this.builder.addStorage();
  }

  constructGamingPC(): void {
    this.builder.reset();
    this.builder.addCPU();
    this.builder.addRAM();
    this.builder.addStorage();
    this.builder.addGPU();
  }
}

// Uso
const officeBuilder = new OfficeComputerBuilder();
const director = new ComputerDirector(officeBuilder);

director.constructBasicPC();
const officePC = officeBuilder.getResult();
officePC.describe();

const gamingBuilder = new GamingComputerBuilder();
director["builder"] = gamingBuilder; // cambio builder a runtime
director.constructGamingPC();
const gamingPC = gamingBuilder.getResult();
gamingPC.describe();

// Rende il file un modulo ES6 invece che un file globale
export {};
