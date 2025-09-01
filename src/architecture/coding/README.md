# Code

- [Code](#code)
  - [Descrizione](#descrizione)
  - [MVC](#mvc)
  - [Layered Architecture](#layered-architecture)
  - [Clean / Hexagonal / Onion Architecture](#clean--hexagonal--onion-architecture)
    - [Hexagonal (port/adapter)](#hexagonal-portadapter)
      - [Folder structure](#folder-structure)
        - [Orizzontale](#orizzontale)
        - [Verticale](#verticale)
    - [Onion](#onion)
      - [Folder Structure](#folder-structure-1)
    - [Clean](#clean)
      - [Folder structure](#folder-structure-2)
  - [CQRS (Command Query Responsability Segregation) e Event Sourcing](#cqrs-command-query-responsability-segregation-e-event-sourcing)
    - [CQRS](#cqrs)
    - [Event Sourcing](#event-sourcing)
      - [CQRS + Event Sourcing](#cqrs--event-sourcing)
        - [Event-Carried State Transfer VS Notification Event](#event-carried-state-transfer-vs-notification-event)
  - [Event-Driven Architecture](#event-driven-architecture)
  - [Test-Driven Development](#test-driven-development)
  - [Progetti di esempio](#progetti-di-esempio)
    - [typescript-event-sourcing-sample-app](#typescript-event-sourcing-sample-app)

## Descrizione

Qui descriviamo le architetture di codice che si possono scegliere per scrivere la propria applicazione

## MVC

Questa architettura è piuttosto classica si basa si 3 concetti:

- Model: Gestisce i dati e la logica di business
- View: Gestisce l'output per mostrare i dati all'utente
- Controller: Gestisce la ricezione dei dati attraverso il routing e coordina il flusso delle azioni compiute dal model per applicare la logica e il view per presentare il risultato

Sostanzialmente il flusso è:

```
[ Utente ]
   ↓
[ Controller ] ← riceve input
   ↓
[ Model ] ← aggiorna/stato/logica
   ↓
[ View ] ← mostra i dati aggiornati
```

Nei contesti moderni, il **view** non è un HTML ma un **viewmodel**, cioè uno oggetto strutturato come un JSON che verrà poi usato dalla view vera e propria per modificare la grafica. Mentre il controller e il model sono ancora concetti utilizzati e traslati anche in architetture più moderne.

## Layered Architecture

Questa è l'architettura delle applicazioni tradizionali, dove le dipendenze vanno dal livello superiore ai livelli inferiori. I livelli sono solitamente:

- Presentation / Rest API Layer
- Business Layer
- Data access (DB) / External API Layer

Questa struttura mette alla base il database, rendendo difficile il testing e creando dipendenze tra i layer. Questi sono elementi che si vuole superare nelle nuove architetture.

## Clean / Hexagonal / Onion Architecture

Tutte queste architetture tendono a creare una architettura a cerchi, dove il dominio è la parte centrale e rappresenta le logiche di business dell'applicazione, questa è la parte più astratta e indipendente. Al di sopra ci sono i livelli che comunicano all'esterno, sia inbound che outbound. I livelli esterno possono dipendere dai livelli interni, ma i livelli interni non possono dipendere dai livelli esterni.

Il dominio contiene sia le classi che le logiche strettamente legate al business, ma slegate a concetti esterni come la persistenza a DB o framework esterni. Questo permette di modificare i livelli superiori senza influenzare il dominio. In questo modo la struttura è più manutenibile a lungo termine, anche se più complessa e verbosa da scrivere.

La comunicazione/flusso può essere rispetto al domain:

- Inbound: dall'esterno si fa una richiesta verso il domain per avere informazioni o eseguire una azione. Questo flusso sarà poi inverso per la risposta dal domain verso l'esterno, ma questa parte è meno rilevante e complessa
  - per esempio: una chiamata Rest richiede al domain i dati prodotto oppure di applicare ad un prodotto uno sconto.
- Outbound: dal'interno il dominio deve fare una richiesta o eseguire una azione verso l'esterno. L'esterno più essere un altro microservizio, un database o altro. L'idea è che questa comunicazione si verso un altro componente che possa essere "sostituibile"
  - per esempio: il domain deve salvare su DB un prodotto, quindi chiama un elemento esterno come il DB su cui salva i dati. Il DB è considerato esterno e sostituibile perchè il domain non dovrebbe preoccuparsi della logica con cui i dati persistono, ma solo che esista un componente che chiamando una certa funzione se ne occupi.

Il concetto di layer in queste architetture è sempre concentrico e bisogna capire che più un livello è centrale più è considerato di Alto Livello e quindi più astratto e indipendente da quelli di Basso Livello e più esterni che si occupano concretamente di uno scopo preciso in un modo specifico.

### Hexagonal (port/adapter)

L'obiettivo di questa infrastruttura è enfatizzare la divisione del dominio rispetto all'esterno usando il concetto di Port e Adapter:

- Port: sono delle interfacce che permettono di gestire la Dependency Inversion ed esporre all'esterno o all'interno un livello che mappa la comunicazione:
  - Inbound Port: sono quelle interfacce che gli adapter utilizzano e che vengono implementate dal domain. **permettono di chiamare la logica di business dall'esterno**
    - In questo modo il domain definisce la logica, la port determina tramite l'interfaccia, cosa espone il domain e come utilizzarlo.
    - Questo protegge il domain dall'esporre l'intera implementazione all'esterno e permette al adapter di avere una idea più chiara e pulita di cosa il dominio espone e come deve usarlo.
    - Inoltre dover definire una interfaccia che esplicita chiaramente ciò che deve esporre il dominio, forza a scrivere una architettura più chiara e ragionare alle funzioni necessarie verso l'esterno
  - Outbound Port: sono quelle interfacce che il domain usa e che gli adapter implementano tramite il concetto di Dependency Inversion. **permettono al dominio di delegare all'esterno delle operazioni**
    - In questo modo il domain non si preoccupa di come certe operazioni saranno fatte e da che componente, le utilizza nel suo contesto liberamente, creando una logica indipendente
    - Tramite la Dependency Injection si può definire la classe concreta che il domain utilizza runtime, quindi avere più componenti adatti e scegliere quale verrà usato in un certo contesto
- Adapter: sono componenti nel livello esterno dell'applicazione che si occupano di comunicare con l'esterno dell'applicazione
  - Inbound: ricevono chiamate dall'esterno e le convertono in chiamate verso il domain attraverso l'**utilizzo** dell'Inbound Port
    - A questo livello, inbound adapter non ha consapevolezza dell'implementazione della porta che userà, questa verrà implementata da una sovrastruttura dell'applicazione che gestisce la Dependency Injection che definisce tutte le implementazioni delle interfacce a runtime, utilizzando l'inject. Altrimenti c'è comunque una sovrastruttura dell'applicazione che istanzia le classi e le passa agli adapter, dipende dal progetto e com'è fatto e che framework usa
  - Outbound: **implementano** le Outbound port utilizzate dal domain mettendo a disposizione dei servizi necessari all'applicazione (come il DB)
    - Tramite la Dependency Injection si definisce che questo adapter implementa una specifica port
    - L'adapter si dovrebbe quindi adeguare ad implementare l'interfaccia che il dominio usa e se si vuole cambiare adapter, il nuovo adapter dovrà adattarsi a quella interfaccia senza modificare il domain

Anche se i concetti sono 3, i livelli veri e propri sono 2:

- Domain: contieene le logiche di business e le port. Questo è importante, perchè le interfacce devono essere a livello di domain, altrimenti il domain non potrebbe logicamente dipendere da un livello più esterno se le porte fossero un livello a parte
- Adapter: componenti esterni che si basano sulle port per comunicare col domain

```
ESTERNO (Client Request / UI)
        ↓
_______________________________________________________________

        ↓
[ ADAPTER INBOUND ]
    └── esempio: Controller
        └── utilizza → ServiceInterface (Porta Inbound)
        ↓
_______________________________________________________________

        ↓
[ PORT INBOUND ]
    └── esempio: ServiceInterface (Porta Inbound)
        └── definisce la port inbound
        ↓
...............................................................

        ↓
[ DOMAIN ]
    └── esempio: ServiceImpl
        └── implementata la port inbound
    └── esempio: ServiceImpl
        └── utilizza → RepositoryInterface (Porta Outbound)
        ↓
...............................................................

        ↓
[ PORT OUTBOUND ]
    └── esempio: RepositoryInterface (Porta Inbound)
        └── definisce la port outbound
        ↓
_______________________________________________________________

        ↓
[ ADAPTER OUTBOUND ]
    └── RepositoryImpl
        └── implementa → RepositoryInterface
        ↓
_______________________________________________________________

        ↓
ESTERNO (Infrastructure / Database)
```

Può essere anche aggiunto opzionalmente un livello "shared" che contiene solo artefatti puri (come "dtos" e "errors") che sono condivisi tra i domini. Questa sarebbe una dipendenza che avrebbero di domini con shared, ma è accettabile se sono effettivamente elementi comuni che raramente cambiano, funzioni pure indipendenti dai domini, configurazioni generiche. "shared" non deve avere dipendenze da nulla.

Buon articolo: [Hexagonal Architecture](https://pereiren.medium.com/clean-architecture-series-part-1-f34ef6b04b62)

#### Folder structure

##### Orizzontale

```
src/
├── domain/
│   ├── orderentities/
│   ├── orderports/
│   └── services/ (oppure use-cases/)
├── adapters/ (oppure infrastructure/)
│   ├── inbound/
│   └── outbound/
└── shared/
    ├── dtos/
    ├── errors/
    └── utils/
```

In questo contesto non si distinguono i vari moduli, tutti i domain e adapter sono insieme in quelle sotto cartelle. Utile per progetti piccoli, perchè mostra chiaramente i livelli e questi non conterranno troppi file

##### Verticale

```
src/
├── modules/
│   ├── order/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── ports/
│   │   │   └── services/             <-- oppure use-cases/
│   │   └── adapters/                 <-- oppure infrastructure/
│   │       ├── inbound/
│   │       └── outbound/
│   └── customer/
│       ├── domain/
│       │   ├── entities/
│       │   ├── ports/
│       │   └── services/             <-- oppure use-cases/
│       └── adapters/                 <-- oppure infrastructure/
│           ├── inbound/
│           └── outbound/
└── shared/
    ├── dtos/
    ├── errors/
    └── utils/
```

In questo contesto ogni modulo è chiaramente distinto ed è più semplice isolare le funzionalità evitando import errati (anche tramite regole di linting). Utile nei progetti più grandi per distinguere i moduli e permettere anche di dividere in microservizi

### Onion

Questa struttura è molto simile alla Hexegonal, ma dettaglia in modo più preciso i livelli. Come fa intendere il nome, i livelli sono concentrici e quelli esterni dipendono da quelli interni, ma non viceversa. Questa implementazione è più strettamente legata al DomainDrivenDesign per come divide il codice e ne usa alcuni principi.

I livelli sono dal più esterno al più interno:

- Infrastructure / User Interface / Tests: è come l'adapter dell'hexagonal, contiene i componenti che hanno contatto con l'esterno
- Application Core: è come il layer domain dell'hexagonal ma dettagliato in più sottolivelli
  - Application Service: gestisce come il mondo all'esterno interagisce con l'applicazione e sono considerate gli use cases. Un esempio è l'AuthenticationService
    - Questo livello gestisce logica solo per l'inbound, mentre l'outbound si basa semplicemente sulle interfacce esposte dal Domain e implementate nell'Interface
  - Domain Service: contiene le interfacce (come le port di exagonal), e tutta quella business logic di dominio ma non specificatamente legata ad una entity. Deve essere senza stato e seguire l'obiquitous language di DDD. Per esempio RegisterUserService è un Domain Service
  - Domain Model: contiene le entity, gli eventi ed i value object (di DDD) ed è il livello più basso. Le entity possono avere della logica specifica che risiede in questo livello

Una differenza sostanziale che distingue Onion da Exagonal è che Onion non insiste sull'uso delle interfacce/porte e quindi nell'inbound il livello "esterno" non deve usare per forza una interfaccia implementata dal livello interno, ma direttamente la classe interna. Riferendosil all'esempio del exagonal sopra:

- User Interface (che sarebbe il nostro Adaper Inbound) può usare direttamente ServiceImpl
- Non è necessario creare un ServiceInterface nel Domain Model, perchè i livelli esterni possono dipendere dai livelli interni senza usare una interfaccia
- Nella pratica in realtà poi si usano comunque le interfacce

Un'altra differenza effettiva è l'introduzione esplicita dei livelli all'interno al Domain di Application Service, Domain Service, Domain Model che nell'exagonal erano genericamente dentro Domain.

Questo è un esempio di flusso:

```
[ Web / Controller ]
        ↓
[ Application / UseCase ]
        ↓
[ Domain / Entity + Service ]
        ↓
[ Interface / IRepository ]
        ↓
[ Infrastructure / RepositoryImpl ]
```

#### Folder Structure

```
src/
├── Core/
│   ├── Domain/
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Interfaces/         <-- Port Outbound (es. IRepository)
│   │   └── Events/
│   └── Application/
│       ├── UseCases/           <-- Port Inbound (es. IOrderService)
│       ├── DTOs/
│       └── Interfaces/         <-- Interfacce dei servizi applicativi
├── Infrastructure/             <-- Adapter Outbound
│   ├── Persistence/            <-- Implementazioni di repository
│   ├── ExternalServices/       <-- API, file system, ecc.
│   └── Configuration/          <-- DI, settings, ecc.
├── Web/
│   ├── Controllers/            <-- Adapter Inbound (HTTP, UI)
│   ├── ViewModels/             <-- Modelli DTO per mappare le entity con l'esterno
│   └── Middleware/             <-- Layer aggiuntivo rispetto Onion, prima di tutti i controller
└── Shared/
    ├── Utils/
    ├── Constants/
    └── Errors/
```

Anche in questo caso, come nel caso di Hexegonal, si può raggruppare questa struttura per ogni singolo modulo (Order, Customer...)

### Clean

Avanza ulteriormente unendo la struttura a strati di Onion con il concetto di porte e adattatori di Hexegonal in una struttura ancora più definita, dove si applicano rigorosamente i principi SOLID. Lo scopo è chiara indipendenza dei componenti e la semplicità nell'essere testabile. Questi sono risultati che si ottenevano anche con le altre 2 architetture, ma qui si cerca di dare principi più netti.

I livelli sono:

- Frameworks & Drivers: si occupa di implementare le interfacce che parlano con l'esterno
  - Analogo al Adapter Outbound di Exagonal ma gestisce anche configurazioni e framework
  - Cerchio più esterno, solitamente si gestiscono qui DB e servizi esterni, ma anche la configurazione del framework di frontend SENZA le specifiche regole di routing e controller
- Interface Adapters: ricevono input dal mondo esterno e gestisce le risposte
  - Analogo al Adapter Inbound di Exagonal
  - Più interno perchè all'esterno c'è la struttura del framework che gestisce l'inbound, questo livello ha più lo scopo di gestire i dati in ingresso attraverso il controller che combina gli use cases per fornire una risposta attraverso il presenter
  - Non viene effettuata logica a questo livello, viene delegata agli use cases, al massimo ci sono delle mappature degli input e output per gestire l'interazione tra esterno e interno (controllore riceve -> use case elabora -> presenter crea la response)
- Application / Use Cases: sono orchestratori che definiscono comportamenti che non appartengono alla singola entity
  - Analogo degli Application Service di Onion
  - Non usa logica di business profonda, ma un workflow di logiche delle entities (per esempio non decide come calcolare il totale dell'ordine, ma quando farlo e con che dati )
  - Risponde al concetto di "quando e come funziona"
- Domain / Entities: contiene gli elementi basilari del dominio (Entities, Value Objects...) e la loro business logic profonda e diretta
  - Analogo di Domain di Onion
  - La logica di business profonda di un Ordine è calcolare il totale o aggiungere articoli, visto che è strettamente legata all'entity stessa
  - Risponde al concetto di "cosa c'è"

In questo contesto i cerchi hanno un significato definito:

- Policies: sono i cerchi più interni e generici e non dipendono dai Mechanisms
- Mechanisms: sono i cerchi più esterni che implementano specifiche funzioni dipendenti dalle Policies

#### Folder structure

```
src/
├── domain/                     # Entità e regole di business
│   ├── entities/               # Modelli centrali (es. Order, Customer)
│   ├── value-objects/          # Oggetti senza identità (es. Money, Address)
│   ├── services/               # Logica di dominio (es. OrderService)
│   └── events/                 # Eventi di dominio (es. OrderCreated)
│
├── application/                # Casi d’uso e orchestrazione
│   ├── use-cases/              # Es. CreateOrderUseCase, GetCustomerOrders
│   ├── interfaces/             # Porte inbound/outbound (es. IOrderRepository)
│   ├── dtos/                   # Input/output dei use-case
│   └── exceptions/             # Errori applicativi
│
├── interface-adapters/         # Traduttori tra mondo esterno e core
│   ├── controllers/            # Adapter inbound (es. HTTP, CLI)
│   ├── presenters/             # Format output → ViewModel
│   ├── mappers/                # DTO ↔ Entità
│   └── view-models/            # Modelli per la presentazione
│
├── infrastructure/             # Adapter outbound e tecnologie esterne
│   ├── persistence/            # Implementazioni repository (es. DB, ORM)
│   ├── external-services/      # API esterne, email, file system
│   ├── configuration/          # DI, settings, env
│   └── logging/                # Log adapter
│
├── shared/                     # Codice riutilizzabile
│   ├── utils/                  # Funzioni comuni
│   ├── constants/              # Valori condivisi
│   └── errors/                 # Errori generici
│
└── main.ts / index.ts          # Entry point dell’applicazione
```

## CQRS (Command Query Responsability Segregation) e Event Sourcing

Questi due pattern possono anche essere utilizzati separatamente, ma quando combinati si ottiengono grossi vantaggi perchè si riescono a gestire le complessità di entrambi e mantenerne i benefici.

### CQRS

Questo pattern architetturale indica di separare la lettura (query) dalla scrittura (command) in classi separate. Il principio si basa sul fatto che lettura e scrittura siano operazioni diverse, anche se dello stesso oggetto.

Vantaggi:

- puoi avere modelli dedicati alla scritture e alla lettura. Capita che i dati necessari in scrittura siano diversi dai dati necessari in lettura.
- puoi separare i database e usare in lettura un DB (es MongoDB) e in scrittura un altro db (es PostgreSQL)
- puoi avere letture più veloci e scritture più sicure
- puoi mantenere il codice meglio e renderlo più chiaro

Utile quando:

- hai un dominio molto complesso
- hai molte letture rispetto alle scritture
- necessiti scalare separatamente letture e scritture
- in combinazione con Event Sourcing, perchè l'Event Sourcing ha naturalmente 2 azioni e basta, la scrittura di un evento e la lettura dei dati

Complessità:

- il principio è semplice da capire ma comporta un aumento della complessita, soprattutto nel contesto di 2 differenti database, uno per la scrittura e uno per la lettura
- devi gestire i messaggi quando processi i command e devi aggiornare gli eventi per le query. Questa gestione è complessa
- con 2 db divisi, devi considerare che avrai una **eventual consistency**, quindi la lettura potrebbe non essere ancora allineata alla scrittura. Questo è da gestire

### Event Sourcing

Questo approccio si basa sul un **Event Store** che rappresenta un database di sequenza cronologica degli eventi. Questo è immutabile e possono solamente essere aggiunti nuovi eventi. Leggendo e applicando la cronologia degli eventi, si può avere lo stato in un certo momento del tempo. Un esempio classico è SVN che memorizza ogni commit come evento di modifica e per ricostrurire lo stato di un punto nel tempo, agisce utilizzando gli eventi.

I principi sono:

- Event: registrazioni immutabili del cambiamento di stato del sistema (e non dello stato del sistema) su una certa entity. Ogni azione compiuta viene registrata
- Stream: una sequenza ordinata di Event di una particolare entity
- Projection: modelli di lettura degli stream di event che permettono di ottenere lo stato dell'entity applicando lo stream di event.

Vantaggi:

- Hai tutti i cambiamenti di stato e quindi puoi fare audit e debugging di cos'è successo più facilmente
- Puoi ricostruire lo stato di ogni punto nel tempo, non solo lo stato corrente
- Puoi usare proiezioni che agevolino la lettura, raccogliendo solo i dati necessari nel modo più comodo possibile
- Scalabile orizzontalmente e permette chi consuma gli eventi di farlo in maniera asincrona

Complessità:

- Nonostante la scrittura di un evento sia molto semplice, la lettura dei dati è molto complessa
- Se ho tantissimi eventi, la projection sarà molto lunga da calcolare ad ogni richiesta, quindi bisogna gestire delle sorte di semplificazioni per poter leggere i dati velocemente

#### CQRS + Event Sourcing

Combinando le 2 metodologie si può:

- Separare la scrittura dalla lettura radicalmente con 2 flussi completamente diversi e database ottimizzati per questo scopo
- La scrittura usa l'Event Store del Event Sourcing e quindi memorizza solo gli eventi
  - Gli schemi nel db in scrittura devono mirare ad avere una certezza e sicurezza nella qualità dei dati, quindi avranno una logica più complessa
- La lettura utilizza delle Materialized View ad ogni modifica del Event Store per aggiornare le tabelle che saranno lette
  - Gli schemi nel db in lettura devono mirare alla semplicità e velocità, le tabelle create tramite Materialized View potranno essere destrutturate per evitare JOIN/ORM e altre complessità, agevolando chi dovrà poi leggerle
- Entrambi i database potranno essere scalati separatamente secondo le relative esigenze

Complessità:

- Eventual Consistency: tra la scrittura di un evento e l'aggiornamento del db in lettura è necessario un periodo di sincronizzazione che rende NON Atomica la transazione, quindi ci possono essere dei momenti di non consistenza. Se necessario, si possono adottare delle metodologie per ridurre questo problema
- Aumento dello storage necessario visto l'utilizzo di 2 database
- Aumento della complessità e della competenza necessaria per gestire 2 database
- Il processo di sicronizzazione dei dati inserisce un punto aggiuntivo da sviluppare e che può avere errori e che deve essere analizzato quando ci sono problemi
- I Command potrebbero cambiare nel tempo, ma questi rimangono salvati nello stream, significa che vanno versionati e gestite i cambiamenti di versione nel tempo

Componenti:

- Struttura software: consigliata è a microservizi usando Clean Architecture e DDD
  - Valutare framework che supportino questo tipo di architettura a seconda del linguaggio usato
- Event Store: si possono usare diversi DB come
  - EventStoreDB che è specifico nativo per event sourcing
  - ma anche db relazionali come PostgreSQL configurandolo per l'event sourcing
  - o non relazionali com MongoDB
  - Apache Kafka è un event streamer che può essere utile ma non è un event store persistente che permette di ricostruire lo stato
- Read Store: si possono usare diversi DB ma dipende dallo scopo:
  - Db relazionali come PostgreSQL permettono viste/materialized views per ottimizzare le query in lettura
  - MongoDB utile se il read model cambia spesso
  - ElasticSearch se serve aggrezioni e ricerche complesse
  - Redis per avere performance altissime salvando in memoria i dati
- Message Bus: sono validi sia RabbitMQ che Kafka

##### Event-Carried State Transfer VS Notification Event

**Event-Carried State Transfer** fa si che quanto un evento è pubblicato da un servizio, questo contiene già tutte le informazioni necessare agi altri servizi per aggiornare il proprio stato locale senza dover interrogare nuovamente il servizio originario.

Questo significa che se per esempio ho creato un nuovo ordine tramite il microservizio Order e devo mettere il relativo messaggio nella coda, questo conterrà tutti i dati dell'ordine. Quando l'eventuale microservizio Shipping consumerà quel messaggio, avrà immediatamente a disposizione tutto quello che gli serve a riguardo della spedizione perchè è già dentro al messaggio, visto che l'ordine conterrà la sua sezione shipping.

Questo costringe a generare messaggi più grandi, ma disaccoppia i servizi che non hanno necessità di chiedere ulteriori dati una volta consumato il messaggio.

**Notification Event** invece ha lo scopo di minimizzare la dimensione del messaggio, lasciando a chi consuma il compito di chiamare sincronicamente (tramite REST o analoghe) il servizio originario per ottenere i dati che gli servono.

Il caso precedente dove viene creato un nuovo ordine funzionerebbe che il messaggio contiene solo l'id dell'ordine e il suo stato OrderCreated. Quando lo Shipping microservice consuma il messaggio farà una chiamata all'Order microservice per ottenere gli specifici dati di spedizione.

Questo permette di generare messaggi più piccoli e non divulgare a tutti i microservizi tutti i dati dell'entità (ne caso di dati sensibili), ma crea un accoppiamento tra i microservizi che potrebbe essere rischioso, visto che la chiamata sincrona potrebbe poi fallire. In alcuni casi può essere vantaggioso se è comunque sempre necessario fare una chiamata REST per ottenere certi dati per avere una certezza della consistenza (non solo al momento in cui si consuma il messaggio).

Quindi ECST (Event-Carried State Transfer) è da considerare la scelta principale a meno di condizioni particolari che non la permettono.

## Event-Driven Architecture

Generica architettura che si basa sullo scambio di messaggi tramite code (come RabbitMQ, Kafka...) invece di comunicazione sincrona.

## Test-Driven Development

Questo è un approccio allo sviluppo e non una architettura. Si basa sul ciclo Red -> Green -> Refactor per quanto riguarda gli Unit Test:

- Red: creo un test di una funzionalità che devo sviluppare e la esegui facendo fallire il test perchè il codice non è ancora implementato
- Green: implemento il codice minimo per far si che il test possa passare con successo anche se la funzionalità non è completa
- Refactor: modifico il codice per implementare la mia funzionalità con lo scopo di mantenere il test funzionante

Questa metodologia ti costringe a ripensare come progetti una applicazione, perchè partendo dai test hai certi vantaggi:

- Codice più affidabile perchè sempre testato
- Design guidato in quanto i test definiscono cosa deve fare la modifica
- Refactoring sicuro visto che hai sempre il test disponibile
- Test come documentazione

Complessità:

- Non è semplice da adottare, tutti nel team devono farlo
- Può essere più lento per chi non è abituato
- Non elimina i bug, ma aiuta
- Non si riesce ad applicare ad un progetto già avviato senza questa metodologia, perchè non esistono i test
- Difficile arrivare ad una copertura del 100%

## Progetti di esempio

### typescript-event-sourcing-sample-app

URL: https://github.com/yerinadler/typescript-event-sourcing-sample-app/tree/main

Questo progetto è fatto molto bene e mostra come gestire un progetto abbastanza contenuto ma con delle complessità concrete. La struttura del codice è ottima e distingue e isola tutti i livelli. Inoltre usa molti componenti esterni e il CQRS e l'event sourcing.

- Innanzitutto il readme spiega molte cose e vale la pena leggerselo per avere una introduzione la progetto
- Struttura del codice con 2 microservizi (job e application) più un pacchetto core condiviso
  - Lo scopo del progetto è quello di fare un servizio che pubblica delle Job Oppurtunity e si può fare l'Application tramite un altro servizio
- Struttura architetturale Onion e DomainDrivenDesign con i livelli ben definiti e separati
- Utilizza framework come `inversify` per gestire la Inversion of Control e quindi la Dependency Injection
- Utilizza Yarn e i packages per poter importare i pacchetti locali tra i vari progetti. Per esempio `"@cqrs-es/core": "1.0.0",` si riferisce al progetto core interno
- Utilizza docker compose per eseguire l'intero progetto, ma vale più la pena leggerne il codice che provarlo
- Struttura del progetto per cartelle:
  - startup.ts e type.ts: file di startup chiamati dall'entrypoint per inizializzare il progetto e le dipendenze tramite Dependency Injection con inversify
  - api: analogo di Interface Adapter o Inbound Adapter
    - index.ts: entrypoint dell'applicazione, esegue successivamente lo startup.ts
    - controller: espone le chiamate REST tramite Express e tramite i Bus (CommandBus e QueryBus) chiama gli handler che effettuano la logica. Il CommandBus lavorerà per popolare l'EventStore (Mongo), il QueryBus lavorerà per recuperare i dati dal Read Store (Cassandra o Redis)
  - infrastructure: analogo di Outbound Adapter
    - CommandBus e QueryBus: sono le classi concrete che gestiscono la registrazione degli handler e chiamano l'handler relativo al tipo di Command o Query richiesta
    - Repository: ha lo scopo di interagire col database per salvare e recuperare gli oggetti. In realtà in cascata usa poi EventSourcedRepository che chiama l'EventSource
    - EventStore: salva i command (insert) a DB (Mongo) come eventi, ma prima pubblica sul EventBus un messaggio per quell'aggregateName modificato (che è il channel della coda) con il messaggio. Ti permette anche di recuperare gli eventi di un AggregateId
    - EventBus: coda (Kafka) dove si pubblicano i messaggi dei command eseguiti e si consumano per aggiornare il Read Store (Cassandra o Redis)
    - module.ts: configura tutte dipendenze dell'infrastruttura utilizzando inversify e la IoC, come la configurazione dei DB, il producer e consumer di Kafka
      - (Read Store): non è presente una cartella o file dedicato, ma è comunque configurato nel module.ts. Per il microservizio Job è Cassandra, per il microservizio Application è Redis. Comunque i due microservizi leggono sia dai loro stessi Read Store che da quelli dell'altro microservizio (almeno Application legge da Job)
  - application: gestione degli handler, cioè le classi che hanno la logica di alto livello nel dominio, e le definizioni delle operazioni degli handler
    - Handler: riceve la definizione dell'operazione e svolge tale operazione
      - Event Handler: applica la logica quando consumi un messaggio della coda. Nel caso del microservice Job salva i dati sul suo Read Store solo dei Job, ma per il microservice Application, questo consuma sia i messaggi di JobCreated che Application Created, entrambi salvati sul relativo Read Store e dove il JobCreated è una replica (con i soli dati interessanti) del Job dentro al microservice Job
      - Command e Query Handler: svolgono la logica di command e query nel momento in cui dal controller arriva il comando al CommandBus o QueryBus
    - Definition: definizione delle operazioni (command e query) con i relativi dati necessari
  - domain: contiene gli eventi, le interfacce e le entity del dominio
