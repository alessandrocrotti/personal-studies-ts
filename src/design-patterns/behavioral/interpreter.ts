// Interfaccia dell'espressione
interface Expression {
  interpret(): boolean;
}

// Espressioni terminali
class BooleanLiteral implements Expression {
  constructor(private value: boolean) {}

  interpret(): boolean {
    return this.value;
  }
}

// Espressioni non terminali
class AndExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  interpret(): boolean {
    return this.left.interpret() && this.right.interpret();
  }
}

class OrExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}

  interpret(): boolean {
    return this.left.interpret() || this.right.interpret();
  }
}

class NotExpression implements Expression {
  constructor(private expr: Expression) {}

  interpret(): boolean {
    return !this.expr.interpret();
  }
}

// Uso
const trueExpr = new BooleanLiteral(true);
const falseExpr = new BooleanLiteral(false);

const expr1 = new AndExpression(trueExpr, falseExpr); // true AND false
const expr2 = new OrExpression(trueExpr, falseExpr); // true OR false
const expr3 = new NotExpression(trueExpr); // NOT true

console.log("true AND false =", expr1.interpret()); // false
console.log("true OR false =", expr2.interpret()); // true
console.log("NOT true =", expr3.interpret()); // false

// OPPURE

// INTERPRETIAMO QUESTA ESPRESSIONE
// role == "admin" AND active == true
// department == "sales" OR role == "manager"

type User = {
  name: string;
  role: string;
  department: string;
  active: boolean;
};

// Interfaccia dell'espressione
interface Expression2 {
  interpret(user: User): boolean;
}

// Espressione terminale: confronto campo-valore
class EqualsExpression2 implements Expression2 {
  constructor(private field: keyof User, private value: any) {}

  interpret(user: User): boolean {
    return user[this.field] === this.value;
  }
}

// Espressione terminale: booleano
class BooleanExpression2 implements Expression2 {
  constructor(private field: keyof User, private expected: boolean) {}

  interpret(user: User): boolean {
    return user[this.field] === this.expected;
  }
}

// Espressioni logiche
class AndExpression2 implements Expression2 {
  constructor(private left: Expression2, private right: Expression2) {}

  interpret(user: User): boolean {
    return this.left.interpret(user) && this.right.interpret(user);
  }
}

class OrExpression2 implements Expression2 {
  constructor(private left: Expression2, private right: Expression2) {}

  interpret(user: User): boolean {
    return this.left.interpret(user) || this.right.interpret(user);
  }
}

// Uso
const users: User[] = [
  { name: "Alice", role: "admin", department: "IT", active: true },
  { name: "Bob", role: "manager", department: "sales", active: false },
  { name: "Carol", role: "employee", department: "sales", active: true },
  { name: "Dave", role: "admin", department: "HR", active: false },
];

// Filtro: role == "admin" AND active == true
const isAdmin = new EqualsExpression2("role", "admin");
const isActive = new BooleanExpression2("active", true);
const adminAndActive = new AndExpression2(isAdmin, isActive);

// Filtro: department == "sales" OR role == "manager"
const inSales = new EqualsExpression2("department", "sales");
const isManager = new EqualsExpression2("role", "manager");
const salesOrManager = new OrExpression2(inSales, isManager);

// Applichiamo i filtri
console.log("🔍 Admin attivi:");
users.filter((user) => adminAndActive.interpret(user)).forEach((u) => console.log(u.name));

console.log("\n🔍 Sales o Manager:");
users.filter((user) => salesOrManager.interpret(user)).forEach((u) => console.log(u.name));

// OPPURE

// Costruzione di un interprete per espressioni matematiche con variabili e valori di variabili

// Interfaccia base per tutte le espressioni
interface Expression3 {
  interpret(context: Record<string, number>): number;
}

// Terminale: numero costante
class NumberLiteral implements Expression3 {
  constructor(private value: number) {}

  interpret(_: Record<string, number>): number {
    return this.value;
  }
}

// Terminale: variabile
class Variable implements Expression3 {
  constructor(private name: string) {}

  interpret(context: Record<string, number>): number {
    return context[this.name] ?? 0;
  }
}

// Non-terminale: somma
class Add implements Expression3 {
  constructor(private left: Expression3, private right: Expression3) {}

  interpret(context: Record<string, number>): number {
    return this.left.interpret(context) + this.right.interpret(context);
  }
}

// Non-terminale: sottrazione
class Subtract implements Expression3 {
  constructor(private left: Expression3, private right: Expression3) {}

  interpret(context: Record<string, number>): number {
    return this.left.interpret(context) - this.right.interpret(context);
  }
}

// Costruzione dell’espressione: (x + 5) - (y - 2)
const expression: Expression3 = new Subtract(new Add(new Variable("x"), new NumberLiteral(5)), new Subtract(new Variable("y"), new NumberLiteral(2)));

// Contesto con i valori delle variabili
const context = {
  x: 10,
  y: 4,
};

// Interpretazione
const result = expression.interpret(context);
console.log("Risultato:", result); // Output: 13

// Rende il file un modulo ES6 invece che un file globale
export {};
