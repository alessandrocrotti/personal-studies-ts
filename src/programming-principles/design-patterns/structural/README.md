# Structural design

- [Structural design](#structural-design)
  - [Descrizione](#descrizione)
  - [Adapter](#adapter)
  - [Composite](#composite)
  - [Proxy](#proxy)
  - [Flyweight](#flyweight)
  - [Facade](#facade)
  - [Bridge](#bridge)
  - [Decorator](#decorator)

## Descrizione

I pattern strutturali servono a strutturare il codice e le relazioni tra classi e oggetti in modo da nascondere le complessità al client (cioè alla classe che chiama, solitamente tramite interfaccia) e gestirle a basso livello. Questi pattern non agiscono sul comportamento di un oggetto, ma possono strutturarlo in modo che il suo comportamento possa essere ampliato.

## Adapter

**Permette di creare una classe ponte tra classi con interfaccie non compatibili.**

Questa strategia permette di rimappare o adattare una classe vecchia o di terze parti ad una nuova, in modo che si possa utilizzare come se fosse parte della nuova interfaccia.
Nella pratica, se si ha una classe che non si può o non si vuole modificare, ma la si vuole integrare nel proprio codice rispettando le proprie interfacce, si deve;

- Creare una classe adapter che implementa la nuova interfaccia e che abbia il riferimento alla classe che non si può modificare (in una variabile della classe nuova c'è l'istanza della classe vecchia)
- Nella classe adapter si implementano i metodi dell'interfaccia facendo eseguire e rimappando la i metodi della vecchia classe dentro quelli nuovi
- In questo modo si può usare la classe adapter come se fosse parte del proprio codice

Può essere utile anche per creare delle classi ponte tra classi diverse di interfacce diverse, in modo da uniformare la gestione ad alto livello.

**Vantaggi**:

- Isola il codice legacy o di terze parti.
- Favorisce la riusabilità e la manutenibilità.
- Permette di rispettare il principio di Open/Closed (aperto all’estensione, chiuso alla modifica).

## Composite

**Permette di raggruppare sotto una stessa interfaccia oggetti semplici e composti, trattandoli ad alto livello allo stesso modo.**

Questo pattern è molto usato quando si deve gestire una gerarchia ad albero di oggetti, in cui ci sono nodi e foglie.
Si utilizza anche per gestire oggetti che possono essere sia oggetti semplici che collezioni di oggetti.

**Struttura**:

- **Component**: è l'interfaccia comune sia agli oggetti semplici che complessi.
- **Leaf**: oggetti semplici.
- **Composite**: oggetti complessi che possono contenere altri Component (quindi sia altri oggetti semplici che complessi).

Un esempio classico è la struttura del file system, dove si possono avere oggetti semplici come file e complessi come cartelle.

Può essere comodo per semplificare al client di alto livello la gestione.

## Proxy

**Permette di incapsulare la logica di un oggetto in un oggetto sostituto, in modo che tu possa aggiungere logica nell'oggetto sostituto in combinazione con l'esecuzione della logica originale.**

Ci sono vari contesti in cui può essere utile utilizzare un proxy:

- **Virtual Proxy**: ritarda la creazione dell’oggetto.
  - Invece di istanziare l'oggetto, che eventualmente eseguirebbe della logica complessa, lo si istanzia solo nel momento in cui si richiama il metodo che effettivamente avrà necessità dell'istanza
- **Protection Proxy**: controlla l’accesso in base a permessi.
  - Posso incapsulare una classe in una classe proxy con la stessa interfaccia, in modo che prima di chiamare un metodo effettuo dei controlli sulle condizioni che mi permettono di eseguire quel metodo
- **Remote Proxy**: rappresenta un oggetto in un altro spazio di memoria o rete.
  - Creo un oggetto che si comporta come un oggetto con metodi locali, ma sotto chiama i metodi remoti per ottenere quei valori, semplificando al client di alto livello l'interazione con l'oggetto
  - Spesso questo tipo di logica è implicitamente presente nelle architetture moderne, senza essere esplicitamente chiamati Proxy, ma eventualmente Service
- **Smart Proxy**: aggiunge logica extra (es. logging, caching).

Utile per aggiungere una sovragestione ad un certo tipo di oggetto.

**IMPORTANTE**: lo scopo del proxy non varia il comportamento dei metodi della classe originale, ma gestisce l’accesso a essi. La logica aggiuntiva (come caching, logging, sicurezza) non altera il risultato o il significato del metodo. A differenza del Decorator, il Proxy non arricchisce il comportamento, ma lo incapsula. Inoltre, di solito si utilizza un solo Proxy per oggetto, e non si impilano più Proxy uno sopra l’altro, come invece accade spesso con i Decorator.

## Flyweight

**Permette di riutilizzare istanze già create invece di crearne sempre di nuove, in modo da diminuire il consumo della memoria.**

Quando certe istanze possono essere riutilizzate in un certo contesto perchè hanno lo stesso stato intrinseco, si possono creare delle mappe di cache che, a fronte dello stesso stato intrinseco di un oggetto, l'istanza si crea se non esiste altrimenti si restituisce dalla cache se già creata precedentemente.
Nei casi in cui ci sono milioni di istanze o tante istanze che si ripetono uguali, se non è necessario avere una diversa istanza per ogni caso, si può utilizzare questo pattern per risparmiare memoria.

Per chiarire cosa si intende per "stesso stato intrinseco": un oggetto `{ "importo" : 100, "Valuta": "EUR" }` sarà sempre uguale ad un altro oggetto con le stesse proprietà, perchè è il set di valori che ne identifica lo stato. Inoltre se tali oggetti sono immutabili (cioè le proprietà sono readonly e assegnate solo al momento dell'istanzia) potranno essere riutilizzati e condivisi nel contesto del Flywieght. Al contrario, un oggetto `{ "id": 1, "name": "Alessandro" }` è identificata dall'id e non dal set di valori che può cambiare nel tempo, quindi rappresenta una identità propria. Si può vedere una analogia con i **Value Object** nel contesto del **Domain Driven Design** dove l'uguaglianza è basata sul contenuto e non sull'identità.

Questo concetto è utilizzato in parte nel contesto di ORM: quando richiamo uno stesso oggetto dal DB di cui non ho bisogno sia refreshato, recupero la sua istanza dal flyweight factory e la riuso, piuttosto che avere molteplici istanze separate. Altri contesti in cui viene usato sono editor o grafica, dove ci sono molti elementi ripetuti.

## Facade

**Permette di creare una "interfaccia" (classe) unificata e semplificata per nascondere l'insieme complesso di classi e funzionalità sottostanti.**

**Concetti chiave**:

- **Subsystems**: tutte le classi complesse che fanno il lavoro vero a basso livello
- **Facade**: classe che espone dei metodi chiari e semplici per orchestrare il lavoro del basso livello
- **Client**: classe o sistema che usa la Facade senza preoccuparsi del comportamento a basso livello

Utile per disaccoppiare il client dai sistemi complessi sottostanti, semplificando l'utilizzo.

Può rischiare di crescere troppo come oggetto e di nascondere funzionalità dei sistemi di basso livello che non vengono esposte o sfruttate dal facade. Per evitare questi casi, in sistemi complessi si possono avere anche più facade specifiche.

## Bridge

**Ha lo scopo di separare l'astrazione dalla sua implementazione in modo che le due possano variare indipendentemente. Usando le interfacce e passando le implementazioni specifiche ai livelli di astrazione, si evita di creare classi specifiche per le varie combinazioni di implementazione possibili. Quindi, invece di legare rigidamente un’astrazione a una specifica implementazione tramite ereditarietà, il Bridge utilizza la "composizione" invece che l'ereditarietà: l’astrazione per mantiene un riferimento ad una interfaccia, delegando a essa parte del comportamento (che verrà definito dalla sua implementazione).**

Cosa significa "composizione": avere nella classe astratta di alto livello una logica che è "composta" dai vari metodi dell'oggetto che gli viene passato tramite interfaccia. Quindi quando io chiami la logica di alto livello con una determinata implementazione di quella interfaccia, si ottiene il comportamento finale.

Quando si hanno vari livelli di combinazione di oggetti e configurazioni, si potrebbero dover creare molte classi diverse che rappresentano quelle combinazioni. Per ovviare a questa proliferazione di classi, usando il bridge pattern si possono passare alle classi di alto livello, le classi di basso livello che fanno le operazioni.
In questo modo, una classe di alto livello chiama le funzioni della specifica classe di basso livello che gli è stata passata.

Esempio:

- Abbiamo vari dispositivi (Tv, Radio) con le loro funzionalità. Questo è il basso livello
- Abbiamo la gestione astratta del telecomando la cui istanza deve poter interagire correttamente con tutti i dispositivi.
- Si potrebbe fare un telecomando per dispositivo, ma invece si può usare il bridge e passare il dispositivo al telecomando, nelle funzioni di telecomando si chiamano le funzioni del dispositivo che abbiamo passato

## Decorator

**Permette di incapsulare un componente in una classe con la stessa interfaccia del componente, in modo da arricchire i metodi con una logica più complessa, aggiungendo comportamenti prima o dopo la delega al comportamento originale.**

**Concetti chiave**:

- **Component**: interfaccia comune per oggetti e decoratori
- **ConcreteComponent**: oggetto base a cui aggiungere funzionalità
- **Decorator**: classe astratta che implementa Component e contiene un riferimento a un Component
- **ConcreteDecorator**: aggiunge comportamenti specifici

Utile per arricchire modificare il comportamento di un oggetto esistente senza modificarlo. I decorator possono essere impilati per arricchire i comportamenti in maniera modulare.

**IMPORTANTE**: lo scopo di questo pattern è di arricchire o modificare il comportamento dell’oggetto originale; nonostante sembri simile al proxy pattern (perchè entrambi implementano la stessa interfaccia dell'oggetto che estendono), il Decorator interviene attivamente sul comportamento, mentre il Proxy si limita a controllare l’accesso.
