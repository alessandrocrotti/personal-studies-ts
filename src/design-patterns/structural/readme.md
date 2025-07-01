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

Generalmente i pattern strutturali hanno il compito di nascondere le complessità al client (cioè alla classe che chiama, solitamente tramite interfaccia) e gestirle a basso livello.

## Adapter

**Permette di creare una classe ponte tra classi con interfaccie non compatibili.**

Questa strategia permette di rimappare o adattare una classe vecchia o di terze parti ad una nuova, in modo che si possa utilizzare come se fosse parte della nuova interfaccia.
Nella pratica, se si ha una classe che non si può modificare, ma la si vuole integrare nel proprio codice rispettando le interfacce del proprio codice, si deve;

- Creare una classe adapter che implementa la nuova interfaccia e che abbia il riferimento alla classe che non si può modificare
- Si implementano i metodi dell'interfaccia facendo eseguire e rimappando la i metodi della vecchia classe
- In questo modo si può usare la classe adapter come se fosse parte del proprio codice

Può essere utile anche per creare delle classi ponte tra classi diverse di interfacce diverse, in modo da uniformare la gestione ad alto livello.

**Vantaggi**:

- Isola il codice legacy o di terze parti.
- Favorisce la riusabilità e la manutenibilità.
- Permette di rispettare il principio di Open/Closed (aperto all’estensione, chiuso alla modifica).

## Composite

**Permette di raggruppare sotto una stessa interfaccia oggetti semplici e composti, trattandoli ad alto livello allo stesso modo.**

Questo pattern è molto usato quando si deve gestire una gerarchia ad albero di oggetti, in cui ci sono nodi e foglie.
Si utilizza anche per gestire oggetti che possono essere sia oggetti semplice che collezioni di oggetti

**Struttura**:

- **Component**: è l'interfaccia comunque agli oggetti semplici e complessi
- **Leaf**: oggetti semplici
- **Composite**: oggetti complessi che possono contenere altri Component (quindi sia altri oggetti semplici che complessi)

Un esempio classico è la struttura del file system, dove si possono avere oggetti semplici come file e complessi come cartelle.

Può essere comodo per semplificare al client di alto livello la gestione.

## Proxy

**Permette di incapsulare la logica di un oggetto in un oggetto sostituto, in modo che tu possa aggiungere logica a questo.**

Ci sono vari contesti in cui può essere utile utilizzare un proxy:

- **Virtual Proxy**: ritarda la creazione dell’oggetto.
- **Protection Proxy**: controlla l’accesso in base a permessi.
- **Remote Proxy**: rappresenta un oggetto in un altro spazio di memoria o rete.
- **Smart Proxy**: aggiunge logica extra (es. logging, caching).

Utile per agggiungere una sovragestione ad un certo tipo di oggetto.

## Flyweight

**Permette di riutilizzare istanze già create invece di crearne sempre di nuove, in modo da diminuire il consumo della memoria.**

Quando certe istanze possono essere riutilizzate in un certo contesto, si possono creare delle mappe che, a fronte degli stessi parametri di creazione di un oggetto, lo crea se non esiste oppure ti restituisce l'oggetto se già creato precedentemente.
Nei casi in cui ci sono milioni di istanze o tante istanze che si ripetono uguali, se non è necessario avere una diversa istanza per ogni caso, si può utilizzare questo pattern per risparmiare memoria.

Un utilizzo molto chiaro è quello nel caso di ORM: quando richiamo uno stesso oggetto dal DB di cui non ho bisogno sia refreshato, recupero la sua istanza dal flyweight proxy e la riuso, piuttosto che avere molteplici istanze separate.

## Facade

\*\*Permette di creare una "interfaccia" (classe) semplificata per accedere un un insieme complesso di classi e funzionalità sottostanti."

**Concetti chiave**:

- **Subsystems**: tutte le classi complesse che fanno il lavoro vero a basso livello
- **Facate**: classe che espone dei metodi chiari e semplici per orchestrare il lavoro del basso livello
- **Client**: classe o sistema che usa la Facade senza preoccuparsi del comportamento a basso livello

Utile per disaccoppiare il client dai sistemi complessi sottostanti, semplificando l'utilizzo.

Può rischiare di crescere troppo come oggetto e di nascondere funzionalità dei sistemi di basso livello che non vengono esposte o sfruttate dal facade.

## Bridge

**Ha lo scopo di separare l'astrazione dalla sua implementazione. Usando le interfacce e passando le implementazioni specifiche ai livelli di astrazione, si evita di creare classi specifiche per le varie combinazioni di implementazione possibile**

Quando si hanno vari livelli di combinazione di oggetti e configurazioni, si potrebbero dover creare molte classi diverse che rappresentano quelle combinazioni. Per ovviare a questa proliferazione di classi, usando il bridge pattern si possono passare alle classi di alto livello, le classi di basso livello che fanno le operazioni.
In questo modo, una classe di alto livello chiama le funzioni della specifica classe di basso livello che gli è stata passata.

Esempio:

- Abbiamo vari dispositivi (Tv, Radio) con le loro funzionalità. Questo è il basso livello
- Abbiamo la gestione astratta del telecomando che deve interagire correttamente con tutti i dispositivi.
- Si potrebbe fare un telecomando per dispositivo, ma invece si può usare il bridge e passare il dispositivo al telecomando, nelle funzioni di telecomando si chiamano le funzioni del dispositivo che abbiamo passato

## Decorator

**Permette di incapsulare un componente in una classe con la stessa interfaccia del componente, in modo da ridefinire i metodi o aggiungerne altri**

**Concetti chiave**:

- **Component**: interfaccia comune per oggetti e decoratori
- **ConcreteComponent**: oggetto base a cui aggiungere funzionalità
- **Decorator**: classe astratta che implementa Component e contiene un riferimento a un Component
- **ConcreteDecorator**: aggiunge comportamenti specifici

Utile per aggiungere comportamenti ad un oggetto esistente senza modificarlo.
