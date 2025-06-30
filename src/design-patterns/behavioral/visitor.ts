// Interfaccia Visitor
interface EmployeeVisitor {
  visitDeveloper(dev: Developer): void;
  visitManager(manager: Manager): void;
}

// Interfaccia Element
interface Employee {
  accept(visitor: EmployeeVisitor): void;
}

// Classi concrete
class Developer implements Employee {
  constructor(public name: string, public linesOfCode: number) {}

  accept(visitor: EmployeeVisitor): void {
    visitor.visitDeveloper(this);
  }
}

class Manager implements Employee {
  constructor(public name: string, public teamSize: number) {}

  accept(visitor: EmployeeVisitor): void {
    visitor.visitManager(this);
  }
}

// Visitor
class ReportVisitor implements EmployeeVisitor {
  visitDeveloper(dev: Developer): void {
    console.log(`👨‍💻 Developer: ${dev.name}, LOC: ${dev.linesOfCode}`);
  }

  visitManager(manager: Manager): void {
    console.log(`👩‍💼 Manager: ${manager.name}, Team size: ${manager.teamSize}`);
  }
}

// Visitor Aggiuntivo
class EvaluationVisitor implements EmployeeVisitor {
  visitDeveloper(dev: Developer): void {
    const score = dev.linesOfCode > 10000 ? "Eccellente" : "Buono";
    console.log(`📊 Valutazione ${dev.name}: ${score}`);
  }

  visitManager(manager: Manager): void {
    const score = manager.teamSize > 5 ? "Leader" : "Coordinatore";
    console.log(`📊 Valutazione ${manager.name}: ${score}`);
  }
}

// Uso
const employees: Employee[] = [new Developer("Alice", 12000), new Manager("Bob", 5), new Developer("Carol", 8000)];

const report = new ReportVisitor();
const evaluation = new EvaluationVisitor();

console.log("📋 Generazione report:");
for (const emp of employees) {
  // Accept ha un comportamento diverso a seconda del visitor
  emp.accept(report);
  emp.accept(evaluation);
}
