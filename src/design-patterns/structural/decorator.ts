// Component interface
interface Notifier {
  send(message: string): void;
}

// Concrete component
class BasicNotifier implements Notifier {
  send(message: string): void {
    console.log(`Notifica base: ${message}`);
  }
}

// abstract decorator (che implementa l'interfaccia del componente e incapsula il componente)
abstract class NotifierDecorator implements Notifier {
  constructor(protected wrappee: Notifier) {}

  send(message: string): void {
    this.wrappee.send(message);
  }
}

// Concrete decorator (che estende il decorator e aggiunge funzionalità al componente)
class EmailNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message);
    console.log(`Inviata email: ${message}`);
  }
}

class SMSNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message);
    console.log(`Inviato SMS: ${message}`);
  }
}

class PushNotifier extends NotifierDecorator {
  send(message: string): void {
    super.send(message);
    console.log(`Inviata notifica push: ${message}`);
  }
}

// Uso
const base = new BasicNotifier();
const email = new EmailNotifier(base);
const sms = new SMSNotifier(email);
const push = new PushNotifier(sms);

push.send("Hai un nuovo messaggio!");

// Rende il file un modulo ES6 invece che un file globale
export {};
