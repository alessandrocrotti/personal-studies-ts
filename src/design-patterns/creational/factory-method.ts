// Interfaccia generica per ogni tipo di notifica
interface MyNotification {
  send(message: string): void;
}

// Tipo per la creazione di una notifica (generica classe che ha un costruttore che ritorna un oggetto che implementa l'interfaccia MyNotification)

type MyNotificationConstructor = new () => MyNotification;

// Factory per la creazione di una notifica
class MyNotificationFactory {
  // Questo tipo è usato per registrare le classi, non gli oggetti. Per questo motivo non si può utilizzare direttamete MyNotification
  private static registry = new Map<string, MyNotificationConstructor>();

  static register(type: string, ctor: MyNotificationConstructor): void {
    this.registry.set(type, ctor);
  }

  static create(type: string): MyNotification {
    const ctor = this.registry.get(type);
    if (!ctor) throw new Error(`Tipo "${type}" non registrato`);
    return new ctor();
  }
}

// Implementazioni
class EmailMyNotification implements MyNotification {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}
MyNotificationFactory.register("email", EmailMyNotification);

class SMSMyNotification implements MyNotification {
  send(message: string): void {
    console.log(`SMS: ${message}`);
  }
}
MyNotificationFactory.register("sms", SMSMyNotification);

// Uso
const notif = MyNotificationFactory.create("email");
notif.send("Messaggio SOLID!");

// Rende il file un modulo ES6 invece che un file globale
export {};
