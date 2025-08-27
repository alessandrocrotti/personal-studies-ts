// Oggetto che rappresenta un carattere
class Character {
  constructor(private symbol: string, private font: string) {}

  render(positionX: number, positionY: number): void {
    console.log(`Rendering '${this.symbol}' in font '${this.font}' at (${positionX}, ${positionY})`);
  }
}

// Flyweight factory che crea e memorizza i caratteri uguali in una map
class CharacterFactory {
  private characters: Map<string, Character> = new Map();

  getCharacter(symbol: string, font: string): Character {
    const key = `${symbol}_${font}`;
    // Se il carattere non è già stato creato, lo crea e lo memorizza. Questo istanzia un solo oggetto per ogni carattere e font, anche se viene richiesto più volte
    if (!this.characters.has(key)) {
      this.characters.set(key, new Character(symbol, font));
    }
    return this.characters.get(key)!;
  }
}

// Uso
const characterFactory = new CharacterFactory();

const text = "HELLO";
const font = "Arial";

for (let i = 0; i < text.length; i++) {
  const char = characterFactory.getCharacter(text[i], font);
  char.render(i * 10, 0); // posizione variabile
}

// OPPURE

// GESTIONE CACHE ORM PER OGGETTI RUOLO CHE NON VARIANO SPESSO

class Role {
  constructor(public name: string, public permissions: string[]) {}
}

// Flyweight factory che crea e memorizza i ruoli uguali in una map
class RoleFactory {
  private static roles: Map<string, Role> = new Map();

  static getRole(name: string): Role {
    if (!this.roles.has(name)) {
      // Simulazione: in un vero ORM, qui ci sarebbe una query al DB
      const permissions = this.fetchPermissionsFromDB(name);
      const role = new Role(name, permissions);
      this.roles.set(name, role);
    }
    return this.roles.get(name)!;
  }

  private static fetchPermissionsFromDB(name: string): string[] {
    const db = {
      Admin: ["read", "write", "delete"],
      Editor: ["read", "write"],
      Viewer: ["read"],
    };
    return db[name as keyof typeof db] || [];
  }
}

class MyUser {
  constructor(public id: number, public name: string, public role: Role) {}

  describe(): void {
    console.log(`${this.name} has role ${this.role.name} with permissions: ${this.role.permissions.join(", ")}`);
  }
}

// Uso
const users = [
  new MyUser(1, "Alice", RoleFactory.getRole("Admin")),
  new MyUser(2, "Bob", RoleFactory.getRole("Editor")),
  new MyUser(3, "Charlie", RoleFactory.getRole("Admin")),
  new MyUser(4, "Diana", RoleFactory.getRole("Viewer")),
];

users.forEach((user) => user.describe());

// Rende il file un modulo ES6 invece che un file globale
export {};
