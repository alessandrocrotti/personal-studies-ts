# Design Patterns creazionali

Gestiscono la creazione degli oggetti, rendendo il sistema indipendente da come gli oggetti vengono creati, composti e rappresentati.

## Singleton

**Permette di creare una sola istanza di in certo oggetto e sempre quella istanza verrà utilizzata.**

Come si ottiene:

- Private constructor: in modo che solo la classe stessa possa inizializzare una istanze e nessun'altro
- Private static variable (instance): variabile statica che conterrà l'istanza unica della classe
- Public static method (getInstance()): metodo statico per accedere alla variabile statica in cui è presente l'oggetto

Variante thread-safe per Java:

- La creazione e solo la creazione dell'istanza deve essere in un blocco synchronized per evitare che il multithreading possa istanzare 2 oggetti in parallelo

Variante lazy initialization:

- l'istanza viene creata solamente quando si richiama per la prima volta getInstance() e instance non è stato ancora istanziato

## Factory

### Factory Method

**Invece di istanziare gli oggetti direttamente dalle classi, si crea una classe che si occupa di istanziare le classi appartenenti ad una certa interfaccia.**

La versione più semplice:

- Creo una interfaccia comune
- Creo una classe Factory, con un metodo `create(type)`, dove passo il type che distingue quale tipo di classe viene istanziata.
  - All'interno del metodo `create(type)` ho uno switch/ifelse che sulla base del type richiama il costruttore giusto

Questa versione rispetta la richiesta del design pattern, ma non rispetta i principi SOLID. Il factory richiederebbe di essere modificato se creo un nuovo type da aggiungere al factory.

Per avere un factory che soddisfi i principi SOLID, si deve:

- Creare nel factory un metody `registry(type, class)` che salva questa coppia in una chiave
- Prima di chiamare il metodo `create(type)`, si deve registrare quel type tramite `registry(type, class)`
- Questo rende il factory totalmente indipendente dall'aggiunta di nuovi type in futuro

### Abstract Factory

**Invece di istanziare gli FAMIGLIE di oggetti direttamente dalle classi, si crea una classe che si occupa di istanziare le FAMIGLIE di classi relative.**

Non si occupa quindi di creare le varie istanze di oggetti con una stessa interfaccia, ma ha veri metodi per vari tipi di oggetti che verranno a monte distinti da un contesto differente. Per esempio: voglio creare degli oggetti nel contesto Windows e nel contesto Mac; avrò una abstract factory che rappresenta Windows e una che rappresenta Mac e al suo interno ci saranno saranno i metodi per istanzare vari tipi di oggetti che hanno classi distinte per contesto.

- Creo le interfacce comuni degli oggetti che vorrò utilizzare
- Creo le implementazioni degli oggetti nei vari contesti (i.e.: Windows e Mac)
- Creo una classe astratta che rappresenta l'Abstract Factory, questa indica tutti i metodi di creazione che le factory concrete devono avere
- Creo le factory concrete per contesto (i.e.: Windows e Mac)
- Analogamente a come si è fatto per il factory method, si crea una classe `FactoryGenerator` con il registry, dove si registrano tutti i possibili Factory che estendono l'Abstract Factory
- Tramite `FactoryGenerator` posso poi creare il mio factory di contesto e dal factory i miei oggetti specifici del contesto scelto

## Builder

**Creare una classe Builder che semplifica o raccoglie le istruzioni per costruire un oggetto e solo alla fine tramite la funzione build() si ottiene l'istanaza era e propria dell'oggetto voluto**

## Build Orchestrator

Questa è una versione più classica del builder che si appoggia ad un `director`.
Quandop si ha un oggetto complesso composto da tante proprietà complesse che solitamente hanno configurazioni precise, si può creare un Builder che crei automaticamente quelle configurazioni di proprietà e quindi restituisca l'oggetto.

Probabilmente meno utilizzato nei contesti moderni

## Build fluent

Questa è una versione più moderna del builder che valorizza i parametri dell'oggetto da costruire passo a passo.
Il builder è una classe che raccoglie tutti i parametri della classe che deve costruire e ogni volta che setti un parametro, fai `return this;` per poter concatenare i comandi. Alla fine il `build();` passerà i parametri per creare la classe originale restituendola.

Questa versione può essere comoda per creare oggetti immutabili, cioè con proprietà `readonly` che si possono settare solo alla costruzione del builder.

## Prototype

**Invece di creare un oggetto nuovo da zero, si clona un oggetto esistente, il prototipo, e si applicano le modifiche sull'oggetto clonato**

Utile quando:

- la creazione di quell'oggetto è molto costosa
- Vuoi duplicare gli oggetti mantenendo la configurazione interna
- Hai molto parametri nel costruttore

Per fare questo devi avere una interfaccia `Clonable` che definisce un metodo `clone()` che viene implementato nella classe dell'oggetto.
