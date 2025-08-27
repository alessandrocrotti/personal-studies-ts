interface MyDocument {
  read(): void;
}

class MySecretDocument implements MyDocument {
  read(): void {
    console.log("Reading top secret content...");
  }
}

class MySecureProxy implements MyDocument {
  constructor(private realDoc: MySecretDocument, private userRole: string) {}

  read(): void {
    if (this.userRole === "admin") {
      this.realDoc.read();
    } else {
      console.log("Access denied.");
    }
  }
}

// Uso
const secret = new MySecretDocument();
const proxy = new MySecureProxy(secret, "guest");

proxy.read(); // Output: Access denied.

// Rende il file un modulo ES6 invece che un file globale
export {};
