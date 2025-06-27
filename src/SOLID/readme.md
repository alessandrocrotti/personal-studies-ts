# SOLID programming

La programmazione SOLID ha lo scopo di:

- migliorare la qualità del codice in termini di leggibilità e sicurezza
- permettere di evitare modifiche non strettamente necessarie al codice, diminuendo il rischio di bug
- aiuta il testing automatico

Potrebbe avere anche degli effetti negativi, se portata agli estremi:

- una grande proliferazioni di classi e interfacce anche quando non necessarie
- dividere le competenze in classi molto piccole può essere dispersivo
- aumenta la complessità del codice: al contrario di avere classi di utils, si hanno molte classi sparpagliate che potrebbero dover essere raggruppatare per una migliore leggibilità

I principi sono i seguenti:

- **S**ingle Responsibility Principle
- **O**pen-Closed Principle
- **L**iskov Substitution Principle
- **I**nterface Segregation Principle
- **D**ependency Inversion Principle

## **S**ingle Responsibility Principle

**Una classe deve avere una singola responsabilità, cioè una sola ragione per cambiare.** Cioè, si deve occupare di una cosa precisa e se quella precisa logica cambia allora è giusto che la classe sia modificata, ma se la modifica è riguardante ad una logica nello stesso contesto, ma non precisamente quella, allora la classe non dovrebbe essere coinvolta.

Questo significa che le classi devono avere competenze specifiche, anche quando sono inserite nello stesso contesto.
Esempio:

```Typescript
/* CLASSE CHE NON RISPETTA IL VINCOLO DI SINGLE RESPONSABILITY */
class Basket {
    private items: Item[] = [];

    addItem(item: Item) {
        this.items.push(item);
    }

    calculateTotal(): number {
        let total = 0;
        for (const item of this.items) {
            total += item.price;
        }
        if (this.items.length > 3) {
            total *= 0.9; // sconto 10% se più di 3 articoli
        }
        return total;
    }

    validateStock() {
        for (const item of this.items) {
            if (!item.inStock) {
                throw new Error(`Articolo ${item.name} non disponibile`);
            }
        }
    }

    sendConfirmationEmail(userEmail: string) {
        // finta email
        console.log(`Email di conferma inviata a ${userEmail}`);
    }
}
```

```Typescript
/* STRUTTURA CHE RISPETTA IL VINCOLO DI SINGLE RESPONSABILITY */
// Classe specifica: competenza sul contenuto del basket
class Basket {
    private items: Item[] = [];

    addItem(item: Item) {
        this.items.push(item);
    }

    getItems(): Item[] {
        return this.items;
    }
}

// Classe specifica: competenza sulla validazione dello stock
class StockValidator {
    static validate(items: Item[]): void {
        for (const item of items) {
            if (!item.inStock) {
                throw new Error(`Articolo ${item.name} non disponibile`);
            }
        }
    }
}

// Classe specifica: competenza sul calcolo degli sconti
class DiscountCalculator {
    static calculate(items: Item[]): number {
        let total = items.reduce((sum, item) => sum + item.price, 0);
        if (items.length > 3) {
            total *= 0.9;
        }
        return total;
    }
}

// Classe specifica: competenza sulle email
class EmailNotifier {
    static send(userEmail: string): void {
        console.log(`Email inviata a ${userEmail}`);
    }
}

// Classe di utilizzo
class BasketCheckoutService {
    constructor(private basket: Basket) {}

    checkout(userEmail: string): number {
        const items = this.basket.getItems();

        StockValidator.validate(items);
        const total = DiscountCalculator.calculate(items);
        EmailNotifier.send(userEmail);

        return total;
    }
}
```

Un altro modo per rappresentare questo principio è che: **una classe deve fare una cosa e farla bene**. Un po' come UNIX che ha tante CLI specializzate in un singolo compito e si combinano insieme.

L'antipattern di questo principio è quello di avere una classe Utils/Helper che contiene tutto, invece di suddividere quelle funzioni in classi dove la coerenza è più specifica.

Avere questa separazione di classi, anche a livello di file, permette anche una migliore gestione di conflitti e merge.

Questo principio si può applicare anche alle funzioni, cercando di spezzarle in sotto funzioni per logica. In questo modo si dovrà intervenire sulla specifica funzione quando sarà necessario e la si potrà testare separatamente.

## **O**pen-Closed Principle

Questo principio indica che **una classe dovrebbe essere aperta all'estesione e chiusa alle modifiche**.

Lo scopo è che la richiesta di una modifica non impatti sulla modifica delle classi esistenti. Piuttosto che inserire la modifica richiesta in una classe esistente, si dovrebbe estendere la classe esistente ed utilizzarla nel codice al posto della classe originale. Questo principio si basa sul **POLIMORFISMO** delle classi.In questo modo i test e il funzionamento originale non viene cambiato e si deve verificare solo che funziona ad alto livello la nuova classe.

Questo approccio evita i bug e permette di creare librerie riutilizzabili da altri progetti senza che questi progetti richiedano di modificare il codice originale

Esempio:

```Typescript
/* ESEMPIO DI CLASSE CHE RICHIEDE DI ESSERE MODIFICATA PER AGGIUNGERE UN NUOVO ACCOUNT TYPE */
class CommissionCalculator {
    calculate(accountType: string, amount: number): number {
        if (accountType === 'standard') {
            return amount * 0.02;
        } else if (accountType === 'premium') {
            return amount * 0.01;
        } else if (accountType === 'business') {
            return amount * 0.005;
        } else {
            throw new Error("Tipo di conto non supportato");
        }
    }
}
```

```Typescript
/* ESEMPIO DI GESTIONE OPEN/CLOSE DOVE UN NUOVO ACCOUNT TYPE NON RICHIEDE LE MODIFICHE AGLI ESISTENTI */
// Creare una classe astratta con un metodo comune che viene implementato in ogni classe concreta
abstract class AccountCommission {
    abstract calculate(amount: number): number;
}

// Classe specifica per account type standard
class StandardAccountCommission extends AccountCommission {
    calculate(amount: number): number {
        return amount * 0.02;
    }
}

// Classe specifica per account type premium
class PremiumAccountCommission extends AccountCommission {
    calculate(amount: number): number {
        return amount * 0.01;
    }
}

// Classe specifica per account type business
class BusinessAccountCommission extends AccountCommission {
    calculate(amount: number): number {
        return amount * 0.005;
    }
}

// Classe specifica per il nuovo account type crypto
class CryptoAccountCommission extends AccountCommission {
    calculate(amount: number): number {
        return amount * 0.04;
    }
}

// funzione per stampare la commissione dato un generico AccountCommission usando la classe astratta
function printCommission(account: AccountCommission, amount: number) {
    const fee = account.calculate(amount);
    console.log(`Commissione: €${fee.toFixed(2)}`);
}

// Utilizzo della printCommission con il nuovo account type
const account = new CryptoAccountCommission();
printCommission(account, 1000); // Commissione: €10.00
```

## **L**iskov Substitution Principle

Questo principio indica che **una sottoclasse deve essere sempre utilizzata al posto di una sua superclasse**. Sostanzialmente se io chiami i metodi della superclasse, non devo avere delle eccezioni come UnsupportedOperationException o throw che non avrei chiamando tali metodi nella superclasse.

Inoltre è anche importante che una sottoclasse non aumenti le precondizioni e non diminiusca le postcondizioni:

- **aumento delle precodizioni**: il mio metodo nella superclasse accetta un qualsiasi integer, mentre io ridefinisco il metodo nella sottoclasse lanciando eccezione se il valore è < 10. Questo aumenta le precondizioni, creando dei casi in cui la mia sottoclasse non è intercambiabile con la superclasse senza causare errori

```Typescript
class Pagamento {
    paga(importo: number): string {
        return `Pagamento effettuato: €${importo}`;
    }
}

class PagamentoSicuro extends Pagamento {
    override paga(importo: number): string {
        if (importo < 10) {
            throw new Error("Importo troppo basso per un pagamento sicuro.");
        }
        return `Pagamento sicuro effettuato: €${importo}`;
    }
}
```

- **diminuzioni delle postcondizioni**: se il mio metodo nella superclasse restituisce sempre un numero positivo, ma nella ridefinizione del metodo nella mia sottoclasse restituisco un numero negativo, questo posso considerarla una diminuzione delle postcondizioni che potrebbe causare un errore sostituendo la sottoclasse alla superclasse. Questo è un vincolo logico che io riconosco nel mio contesto.

```Typescript
// Superclasse
class Rettangolo {
    constructor(protected base: number, protected altezza: number) {}

    area(): number {
        return this.base * this.altezza;
    }
}

// Sottoclasse che viola il principio di sostituzione perchè ritorna un negativo
class RettangoloNegativo extends Rettangolo {
    override area(): number {
        return -1; // oppure un valore scorretto
    }
}

// Sottoclasse che rispetta il principio di sostituzione perchè ritorna esattamente lo stesso valore aggiungendo semplicemente un log
class RettangoloConLog extends Rettangolo {
    override area(): number {
        const result = super.area();
        console.log(`Calcolo area: ${result}`);
        return result; // sempre coerente con la logica attesa
    }
}
```

## **I**nterface Segregation Principle

Lo scopo di questo principio è che **è meglio avere tante interfacce specifiche piuttosto che una interfaccia con tanti possibili metodi dichiarati**. L'obiettivo è quello di evitare di implementare una interfaccia per poi essere forzati a definire dei metodi che non verranno usati da quella classe, quindi mettendo delle eccezioni NotImplementedError.
I client (classi) non devono dipendere da intefacce che non utilizzano.

Simile al punto precedente, questo principio permette di sapere esattamente cosa una classe può o non può fare. Utilizzando l'interfaccia ad alto livello nel codice, si potrà gestire meglio il codice.

Spezzare in tante interfacce potrebbe comportare la necessità di utilizzare in certi contesti numerose implementazioni per una classe. Si possono raggruppare le interfacce comuni in una unica interfaccia:

```Typescript
interface Stampabile {
    stampa(): void;
}

interface Salvabile {
    salva(): void;
}

interface Documento extends Stampabile, Salvabile {}
```

Questo è un esempio:

```Typescript
/* INTERFACCIA GENERALE CHE COSTRINGE IMPLEMENTAZIONI NON UTILIZZATE */
interface Worker {
  work(): void;
  eat(): void;
}

class HumanWorker implements Worker {
  work() {
    console.log('Working');
  }
  eat() {
    console.log('Eating');
  }
}

// classe che usa solo parte dell'interfaccia
class RobotWorker implements Worker {
  work() {
    console.log('Working');
  }
  eat() {
    throw new Error('Robots do not eat'); // Viola il principio
  }
}
```

```Typescript
/* INTERFACCE SPECIFICHE E RIDOTTE */
interface Worker {
  work(): void;
}

interface Eater {
  eat(): void;
}

// Classe che implementa entrambe le interfacce
class HumanWorker implements Worker, Eater {
  work() {
    console.log('Working');
  }

  eat() {
    console.log('Eating');
  }
}

// Classe che implementa solo una interfaccia, quella che effettivamente usa
class RobotWorker implements Worker {
  work() {
    console.log('Working');
  }
}
```

## **D**ependency Inversion Principle

Questo principio dice che una classe di alto livello non deve dipendere da classi di basso livello. Tutto deve dipendere da astrazioni. Le astrazioni non devono dipendere da dettagli di basso livello.

Sostanzialmente lo scopo è quello di utilizzare interfacce o classi astratte come variabili e parametri, in modo che in cascata io possa definire quale classe concreta uso in un certo contesto. Se definissi delle variabili come classi concrete, sarei strettamente legato a quelle e non potrei definirne delle altre versioni di quel tipo di classe per contesti diversi.

Vantaggi:

- decoupling,
- facilità nei test (mocking),
- riusabilità,
- maggiore flessibilità per modifiche future.

<u>La Dependency Injection è una tecnica per implementare il Dependency Inversion principle.</u>

```Typescript
/* CLASSI STRETTAMENTE LEGATE DOVE UNA CLASSE DEVE FORZATAMENTE USARE L'ALTRA */
class EmailService {
    send(email: string, message: string) {
        console.log(`Invio email a ${email}: ${message}`);
    }
}

class NotificaUtente {
    private emailService = new EmailService(); // dipendenza con classe concreta

    notifica(email: string) {
        this.emailService.send(email, "Benvenuto!");
    }
}
```

```Typescript
/* CLASSI DEBOLMENTE LEGATE DOVE UNA CLASSE SI BASA SULL'ASTRAZIONE DATA DALL'INTERFACCIA SU CUI SI COSTRUISCONO LE CLASSI */
interface IMessaggistica {
    invia(destinatario: string, contenuto: string): void;
}

class EmailService implements IMessaggistica {
    invia(destinatario: string, contenuto: string): void {
        // Invia l'email
        console.log(`Email a ${destinatario}: ${contenuto}`);
    }
}

class SmsService implements IMessaggistica {
    invia(destinatario: string, contenuto: string): void {
        // Invio SMS
        console.log(`SMS a ${destinatario}: ${contenuto}`);
    }
}

class NotificaUtente {
    // Depencency Injection utilizzata per mettere tramite il costruttore una classe concreta in una variabile globale astratta
    constructor(private messaggistica: IMessaggistica) {}

    notifica(email: string) {
        this.messaggistica.invia(email, "Benvenuto!");
    }
}

// Utilizzo di NotificaUtente indipendente dal Service utilizzato, in quanto è un parametro
const sms = new SmsService();
const notificaSms = new NotificaUtente(sms);
notificaSms.notifica("+393331234567");
const email = new EmailService();
const notificaEmail = new NotificaUtente(email);
notificaEmail.notifica("test@test.com");
```
