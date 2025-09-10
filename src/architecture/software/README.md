# Software Architecture

- [Software Architecture](#software-architecture)
  - [Descrizione](#descrizione)
  - [Architetture software](#architetture-software)
    - [N-Tier / Layer](#n-tier--layer)
    - [Web-Queue-Worker](#web-queue-worker)
    - [Event-Driven](#event-driven)
    - [Big Data](#big-data)
    - [Big Compute](#big-compute)
    - [Microservizi](#microservizi)
      - [Progettazione dei microservizi](#progettazione-dei-microservizi)
      - [Comunicazione asicrona](#comunicazione-asicrona)
      - [Service Mesh](#service-mesh)
      - [API Design](#api-design)
      - [API Versioning](#api-versioning)
      - [Operazioni Idempotenti](#operazioni-idempotenti)
      - [Gestione dei dati](#gestione-dei-dati)
      - [Container orchestration](#container-orchestration)
      - [Suggerimenti pratici](#suggerimenti-pratici)
        - [Repository infra-local](#repository-infra-local)
    - [CQRS (Command Query Responsability Segregation) e Event Sourcing](#cqrs-command-query-responsability-segregation-e-event-sourcing)
      - [CQRS](#cqrs)
      - [Event Sourcing](#event-sourcing)
        - [CQRS + Event Sourcing](#cqrs--event-sourcing)
    - [Event-Driven Architecture](#event-driven-architecture)
      - [Event-Carried State Transfer VS Notification Event](#event-carried-state-transfer-vs-notification-event)
  - [Metodologie](#metodologie)
    - [SemVer (Semantic Versioning)](#semver-semantic-versioning)
      - [Prefisso "v"](#prefisso-v)
      - [Gestire il codice dell'applicazione](#gestire-il-codice-dellapplicazione)
      - [Changelog e Release Notes](#changelog-e-release-notes)
    - [Domain Driven Design (DDD)](#domain-driven-design-ddd)
      - [Strategic DDD](#strategic-ddd)
      - [Tactical DDD](#tactical-ddd)
  - [Protocolli](#protocolli)
    - [Firma Digitale](#firma-digitale)
    - [Authentication / Authorization](#authentication--authorization)
      - [Password-based](#password-based)
        - [Sessione](#sessione)
        - [JWT (JSON Web Token)](#jwt-json-web-token)
      - [SAML](#saml)
      - [OAuth 2.0 / OIDC (OpenID Connect)](#oauth-20--oidc-openid-connect)
        - [OAuth 2.0](#oauth-20)
        - [OIDC (OpenID Connect)](#oidc-openid-connect)

## Descrizione

Le software architecture sono quelle strutture che servono a gestire l'operatività dell'applicazione, che può coinvolgere indirettamente l'architettura, ma comunque si parla di come il software interagisce coi suoi componenti per funzionare. Non si parla solamente di come sviluppare il codice, ma la struttura intera dell'applicazione, senza occuparsi di come verrà gestita nell'infrastruttura.

## Architetture software

Descrive alcuni pattern per creare architetture software su Cloud Platform a livello di infrastruttura. [Azure Architecture Styles](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/) è un buon link per vedere questi pattern.

### N-Tier / Layer

- Applicazioni tradizionali formate da più tier/layer con una responsabilità specifica, dove i layer superiori utilizzano i servizi inferiori, ma non viceversa.
- Normalmente ogni livello chiama il livello sottostante senza salti (**closed architecture**), ma si può scegliere un approccio meno rigido dove si possono anche saltare i livelli (**open architecture**).
- Si può comunicare tra livelli in maniera sincrona o asincrona tramite i messaggi.
- Potenzialmente ogni livello potrebbe essere installato su macchine separate, ma si possono anche avere più livelli insieme: separare i livelli permette una migliore scalabilità del singolo livello, ma aumenta la latenza nella comunicazione

Quando utilizzarla:

- Applicazioni web semplici
- Per iniziare se non si hanno chiari i requisiti dell'architettura
- Migrazione da una soluzione on-premises (cioè sulle tue macchine locali gestite da te) ad Azure con il minimo livello di configurazione

Benefici:

- Portabilità da on-premesis a cloud base
- Più semplice da imparare
- Minori costi per architettare la soluzione
- Soluzione naturale per le applicazioni tradizionali
- Si possono usare diversi ambienti, come Windows o Linux

Complessità:

- Possibile che il middle tier faccia solamente delle CRUD a database, creando solo una latency aggiuntiva
- Architettura monolitica impedisce deploy indipendenti delle funzionalità
- Complicato gestire la sicurezza di rete
- Difficile applicare testing e observability

Si dovrebbe implementare ogni layer con un Load Balancer davanti che distribuisce il carico alle Virtual Machine dedicate a quel layer, in modo che possa essere scalato orizzontalmente. Inoltre le macchine virtuali dei singoli layer non dovrebbero essere accessibili in Remote Desktop o SSH, ma si dovrebbe predisporre una specifica macchina virtuale che farebbe da ponte per le installazioni, chiamata Bastion. Il Bastion è accessibile dell'amministratore e dove può aggiungere il codice e dal Bastion ci sono delle regole per accedere alle varie Macchine Virtuali.

### Web-Queue-Worker

Questo pattern ha il vantaggio di riuscire a utilizzare tutti dei Managed Service che offre Azure ed è comoda per eseguire operazioni semplici ma con elaborazioni complesse che possono accettare tali elaborazioni in maniera asincrona.
Ha i seguenti livelli:

- Web: il Web Front End dell'applicazione che gestisce la parte di Web App o Static Web App
- Queue: il Front End riceve dal client una operazione da eseguire, quindi genera e manda un messaggio alla coda che verrà utilizzata dal worker
- Worker: applicazione che consuma i messaggi della Queue ed effettua le operazioni richieste
- Componenti aggiuntivi:
  - Database: sia Frontend che Worker possono comunicare col Database
  - Cache: sia Frontend che Worker possono usare Redis cache quando interagiscono col Database per cachare
  - CDN: il contenuto statico viene gestito da una CDN
  - Identity Provider: il Front End può appoggiarsi al Identity Provider per l'authentication

### Event-Driven

Architettura formata da Producer - Broker - Consumer. In questo caso non c'è una web application come interfaccia, ma è soprattutto in un contesto di backend dove c'è una sorgente che produce dei dati e uno o più consumer che devono consumarli. Un tipico esempio è nel IoT dove un sensore produce degli eventi che vengono salvati su un database o letti da un altra destinazione.

Questo processo è molto scalabile, in quanto i componenti sono disaccoppiati. Inoltre è particolarmente veloce, rendendola molto comoda in un contesto real-time. I messaggi possono essere di tipici AMQP o stream leggibili tramite Kafka.
Può essere combinato con altre strutture all'occorrenza

### Big Data

Architettura specifica per gestire la ricezione e processare grandi dati che sono troppi per i database tradizionali. Utile per le ottime performance e molto usato anche nel IoT.

Riassumendo in maniera sintetica:

- ci sono delle fonti dati (db, file, real-time) che vengono acquisiti in vari modi, via batch o real-time.
- Questi dati vengono salvati in diversi strumenti dedicati a seconda del tipo di dato (strutturati, non strutturati, binari).
- I dati vengono poi trasformati e ripuliti tramite diversi strumenti e quindi salvati in modo che possano essere utilizzati agevolmente nei contesti Big Data.
- I dati vengono utilizzati da sistemi specifici, come strumenti di business intelligence e machine learning.

### Big Compute

A differenza della Big Data dove lo scopo era immagazzinare e utilizzare una grande mole di dati, questa ha lo scopo di effettuare tantissimi processi che richiedono un grande numero di CPU. Spesso è utilizzato in contesti di simulazione, rendering, Machine Learning e AI.

Riassumendo in maniera sintetica:

- La parte di processo viene fatta tramite VM che vengono scalate rapidamente a seconda della necessità e vengono anche usate GPU. Si può usare anche AKS per eseguire il processo.
- Si devono utilizzare storage ad alte prestazioni con basse latenze
- La network deve essere a bassissima latenza e altissima banda
- Si crea un output che viene poi analizzato

### Microservizi

La struttura a microservizi spezzetta una struttura monolitica in servizi piccoli e indipendenti che interagiscono tra loro per comporre il comportamento dell'applicazione. Ogni microservizio è totalmente autonomo nel senso che ha il suo storage ed espone le sue API per interagire; questo significa che ogni microservizio può scegliere la tecnologia che preferisce indipendentemente da quella usata negli altri. Inoltre il suo ciclo di vita è indipendente e può essere deployato senza coinvolgere altri.

Componenti:

- **Management / orchestration**: gestisce il deploy, lo scaling e il riavvio dei microservizi sui nodi. Normalmente si può usare Kubernetes ma ci sono anche componenti Cloud-Native analoghi
- **API gateway**: entrypoint per i servizi invece di chiamare i servizi direttamente, poi lui si occupa di inoltrare la chiamata al backend service corretto. Si occupa di authentication, logging e load balancing. Normalmente si usa NGINX.
- **Message-oriented middleware**: strumenti come Apache Kafka o Azure Service Bus (o altri AMQP broker) si occupano di gestire la comunicazione asincrona e real time tra servizi per gestire l'event-driven architecture. Il concetto di real-time è sostanzialmente dato dal fatto che c'è bassa latenza tra il producer che mette il messaggio e il consumer che lo processa.
- **Observability**: centralizza i log e la diagnostica dell'intero sistema. Si possono verificare le performance e tracciare le request attraverso i servizi verificando gli eventuali rallentamenti. Lo standard è Open Telemetry.
- **Data management**: ogni microservizio è indipendente e può anche usare differenti database, sia SQL che NoSQL.

Vantaggi (sostanzialmente derivanti tutti dall'indipendenza dei servizi):

- Release e deploy indipendenti
- Team piccoli e dedicati
- Codice contenuto
- Utilizzo di tecnologie differenti e indipendenti
- Isolamento degli errori: se c'è un problema su un microservizio, gli altri continuano a funzionare senza compromettere l'intera applicazione
- Scalabilita indipendente
- Dati isolati: lo schema dei dati è più semplice e dedicato a quel microservizio

Complessità:

- I singoli microservizi sono più semplici, ma gestire una applicazione con tanti microservizi coinvolti è più complesso
- Ci possono essere servizi dipendenti da altri che vanno sviluppati e pensati tenendo questo in considerazione
- Troppa flessibilità può portare al caos, con microservizi implementati con tecnologie e approcci totalmente diversi, meglio imporre delle regole per creare uno standard comune
- Gestione della rete: ci sono molte più comunicazioni di rete che devono essere gestite e possono creare latenza. Bisogna cercare di utilizzare le code il più possibile ed non avere catene di servizi dipendenti troppo lunge per evitare congestioni nella rete
- Integrità dei dati: essendo ogni servizio indipendente anche dal punto di vista dei dati, quando uno stesso dato deve persistere su più microservizi non si può agevolmente gestire questa come una operazione atomica, ma si deve tollerare un periodo di disallineamento del dato. Tramite l'event-driven architecture poi questo disallineamento verrà allineato consumando il messaggio.
  - Si può applicare il pattern **SAGA** che ad ogni azione deve prevedere una azione di compensazione che possa annullare la precedente in caso di fallimento (esempio: un evento OrderCreated compensato da CancelOrder oppure un pagamento andato a buon fine con un evento PaymentProcessed compensato da un evento RefundPayment). Questo significa che ad ogni passo, se un intero processo dovrebbe completarsi insieme ma fallisce ad un certo step, vengono lanciati gli eventi compensativi degli step già effettuati.
- Gestione DevOps articolata e consapevole
- Versionamento: ogni nuova release di un servizio deve essere versionata per evitare di rompere dei servizi che lo utilizzano. Questi servizi dipendenti aggiorneranno la versione usata nel momento in cui saranno pronti
- Richiede capacità avanzate per tutti i membri del team

Best Practices:

- Usare il DomainDrivenDesign per definire i confini di un service, ma evitare di creare troppi microservizi inutilmente piccoli che aumenterebbero la complessità e ridurrebbero le performance
- Decentralizzare ogni aspetto, i team devono essere totalmente indipendenti sia come codice che come schemi
- Crea delle regole standard di approccio comuni per tutti i microservizi, come logging, monitoring, deployment, e limita il numero di tecnologie diverse
- I data storage devono essere privati di ogni service
- Le API con cui comunica un microservizio devono essere rappresentative del contesto di quel dominio e non della sua struttura interna (per esempio, non devi usare per forza gli stessi nomi di oggetti nelle API e internamente, ma devono essere chiari all'esterno per gli altri)
- Utilizza il mutual TLS/SSL per la comunicazione tra microservizi per aumentare la sicurezza, dove sia client che server si devono autenticare via certificato. Può sembrare inutile in una rete interna, ma serve ad aumentare la sicurezza in casi di container compromessi, utilizzo di ambienti DEV e PROD nella stessa rete o utilizzo di più tenant rappresentanti clienti diversi insieme
- Utilizza il gateway per tutte le operazioni comuni e trasversali ai vari service (come l'authentication)
- Il gateway però non deve contenere alcuna business logic, al contrario dei microservizi, altrimenti avrebbe una dipendenza che potrebbe causare la perdita di indipendenza del componente stesso
- I servizi dovrebbero avere un accoppiamento debole. Se delle funzioni di due microservizi richiedono di essere modificate e installate insieme, significa che c'è un accoppiamento forte ed è sbagliato
- Usare CI/CD per testare e deployare un servizio
- Utilizzare la Chaos Engineering per verificare la stabilità dell'applicazione: consiste nell'introdurre errori o rallentamenti controllati e mirati in alcuni componenti per vedere come gli altri reagiscono ed eventualmente testare meccaniche di fallback, retry, circuit breaker.
- Utilizzare sistemi di Observability tramite OpenTelemetry per monitorare l'intera applicazione

Antipattern nei microservizi:

- Creare eventi che dipendono da eventi passati o futuri: i messaggi dovrebbero essere eventi atomici e indipendenti
- Utilizzare le entità del database per definire gli eventi: mostra la struttura interna del microservizio e non descrive al meglio l'evento a livello di dominio
- Evitare di duplicare i dati tra microservizi è un antipattern: se per evitare di duplicare un dato, si deve fare frequenti chiamate ad un servizio per ottenerlo, si crea un accoppiamento. Molto meglio crearsi una propria copia dei dati nel proprio servizio e tramite messaggi aggiornare il dato quando cambia. Rendi i servizi indipendenti i più performanti anche se non c'è una perfetta consistenza dei dati
- Evitare di fare messaggi generici dove il client deve andare a verificare se è di sua competenza, ma piuttosto creare dei messaggi dedicati che il client può interpretare più facilmente
- Generalmente fare una libreria comune condivisa con i microservizi è un antipattern: lega all'utilizzo di una stessa tecnologia, se contiene business logic, quando questa cambia si devono aggiornare contemporaneamente tutti i servizi (la business logic deve stare nel suo domain e non in uno common). Si può fare una libreria comune se questa è di sole utilità e non business logic
- Usare un API Gateway invece di raggiungere i singoli microservizi direttamente, sia dall'interno che dall'esterno del cluster
- Evitare configurazioni interne al microservizio, ma invece gestirle all'esterno per renderlo più flessibile (evitare file interni o valori hard-coded ma passare variabili d'ambiente)
- Evitare di avere logiche di validazione e sicurezza in ogni microservizio, invece è meglio avere un componente dedicato (esempio, l'API Gateway che controlla e valida il JWT e aggiunge i dati come header alle chiamate dirette nei singoli microservizi sottostanti)
- Evitare di replicare operazioni astratte comuni nei microservizi: separare l'astrazione dell'infrastruttura dalla business logic e gestire l'astrazione dell'infrastruttura tramite framework come **Dapr**. Nella pratica, se vuoi inviare messaggi ad un broker di code, se usi Dapr hai una unica interfaccia tramite API indipendentemente dal provider (RabbitMQ, Kafka, Azure Service Bus), il provider viene configurato su Dapr che fa da layer intermedio rendendo la tua applicazione indipendente dalla tecnologia e dai relativi cambiamenti. Sostanzialmente Dapr è un sidecar container che gira insieme a quello dell'applicazione per gestire tutte queste interazioni astratte infrastrutturali

#### Progettazione dei microservizi

L'approccio più vicino ad una struttura a microservizi è il [Domain Driven Design](#domain-driven-design-ddd). Applicando questa metodologia si possono definire dei **Bounded Context** che normalmente poi verranno implementati come microservizi: un microservizio non dovrebbe superare i confini del **Bounded Context**, ma potenzialmente un **Bounded Context** si potrebbe implementare tramite più microservizi.
Definiti gli **aggregate** del **Bounded Context**, questi possono aiutare ad identificare l'area del microservizio, perchè solitamente gli aggregate riuniscono aree strettamente legate tra loro, ma debolmente accoppiate col resto. Anche i Domain Service che gestiscono logiche trasversali senza stato, possono essere implementati come microservizi.
Inoltre altre richieste, come dimensione del team, scalabilità, sicurezza, possono determinare se un microservizio deve essere spezzato in sotto microservizi o viceversa se più microservizi piccoli dovrebbero far parte di un singolo microservizio.

I principi sono:

- Ogni microservizio ha una singola responsabilità
- Non c'è troppa comunicazione tra servizi, altrimenti significa che dovrebbero essere nello stesso microservizio
- Ogni microservizio deve essere abbastanza piccolo da poter essere gestito da un piccolo team
- Ogni microservizio dovrebbe essere deployabile indipendentemente dagli altri, quindi non devono esserci interdipendenze con gli altri
- Ogni microservizio può evolvere autonomamente rispetto agli altri
- Ci vuole un equilibrio fra la coerenza dei dati, che viene garantita essendo tutti nello stesso microservizio, e la dimensione di esso. Non deve essere considerato indispensabile avere una forte coerenza, perchè nei sistemi distribuiti è accettabile rilassare questo vincolo e gestirlo in altra maniera, permettendo di avere più service
- Meglio partire da microservizi più grandi ed eventualmente spezzarli successivamente, piuttosto che riuniore più servizi in uno unico

Complessità da affrontare:

- **Resilienza**: per qualsiasi motivo uno o più microservizi potrebbero non rispondere (guasti, troppe richieste, riavvii). Ci sono due modelli per affrontare questi problemi:
  - **Retry**: se il problema è temporaneo e si risolve da solo, riprovare la chiamata verso il servizio per un certo numero di volte può ottenere un risultato positivo. Però, se la chiamata non è idempotente (come POST, PATCH) è una soluzione rischiosa, perchè il server potrebbe aver elaborato la request ma non aver restituito la response e quindi si invierebbero ed elaborerebbero più volte la stessa request.
  - **Circuit Breaker**: se un servizio inizia a fallire per le troppe richieste, le richieste si accumulano in coda consumando risorse critiche del sistema. Per evitare questo sovraccarico, il servizio può gestire 3 stati: closed (tutto funziona regolarmente), open (il flusso si interrompe e le chiamate vengono bloccate immediatamente), half-open (dopo un po' che è aperto, una parte di chiamate vengono fatte passare per verificare se il sistema è tornato a funzionare e si può chiudere o si deve mantenere aperto)
  - **Rate Limit**: è una strategia aggiuntiva che permette di limitare il numero di richieste ricevute. Anche questo aiuta la resilienza, perchè si può scegliere di permettere solo una certa frequenza di chiamate, rimuovere certi IP, proteggere dal DoS attack. Quando si supera una certa frequenza di chiamate, si permette solo ad alcune di raggiungere il server in modo da evitare di sovraccaricarlo e renderlo inaccessibile a tutti. Solitamente si risponde con un 429 Too Many Request e/o un header `Retry-After` per indicare quando riprovare
- **Load balancing**: normalmente un Service in Kubernetes gestisce il traffico assegnando la request ad un pod casuale, ma tramite il Service Mesh si possono avere logiche migliori
- **Distributed Tracing**: gestire flussi e transazioni che sono trasversali a più servizi può rendere difficile il monitoring del sistema. Serve un modo per collegarli
- **Service versioning**: quando si evolve un servizio i chiamanti potrebbero avere dei malfunzionamenti, quindi è necessario fare un versioning e mantenere più versioni funzionanti in parallelo per non rompere i chiamanti del servizio modificato
- **TLS encryption and mutual TLS authentication**: per aumentare la sicurezza si può crittografare tramite TLS anche il traffico interno ai microservizi

#### Comunicazione asicrona

Comunicazione tra microservizi può essere sincrona (chiamate HTTP o gRPC) o asincrona (attraverso messaggi). La comunicazione sincrona è più naturale, ma quella asincrona ha diversi vantaggi che la rendono preferibile, ma anche delle complessità:

- Vantaggi della comunicazione asincrona:
  - Riduce l'accoppiamento tra servizi
  - Ci possono essere più consumer (nel modello pub/sub)
  - Isola gli errori: se il consumer ha un errore o non è raggiungibile, il producer non viene coinvolto e può continuare a mandare i messaggi. Una volta sistemato il consumer, i messaggi verranno consumati
  - Reattività: l'upstream che invia il messaggio non deve aspettare risposta dal downstream. In un contesto sincrono, dove si concatenano più servizi in un unico processo sincrono, si accumulano latenze
  - Livellamento del carico: la coda agisce come buffer permettendo di consumare i messaggi senza sovraccaricare il consumer
  - Workflow: i messaggi possono anche essere utilizzati per capire all'interno di un workflow dove siamo arrivati e gestire i singoli step
- Complessità:
  - Messaging infrastructure: la scelta del tipo di coda diventa un vincolo complesso da cambiare (passare da RabbitMQ a Kafka per esempio)
  - Latency: il risultato finale dell'operazione potrebbe essere più lungo perchè il messaggio deve aspettare che tutti gli altri precedenti siano consumati
  - Cost: gestire un flusso enorme di messaggi potrebbe essere costoso in termini di gestione della Messaging Infrastructure
  - Gestione dell'asincronicità: non è banale, devi gestire messaggi duplicati (serve rendere il consumo idempotente), non è semplice gestire un contesto in cui serve una request-response (serve una coda di response e correlare i messaggi)
  - La gestione della coda ha una sua complessità in termini di produzione, consumo, ack, retry. Si deve gestire meccanismi di lock e sincronizzazione, i messaggi possono avere una latenza se gestiti da broker esterni (Azure Service Bus)

**Distributed transaction**: Ci sono circostanze in cui una operazione richiede una transazione e scambia un messaggio asincrono con altri servizi che a loro volta devono applicare le modifiche tramite una transazione. Questo flusso richiede che più step di transazione in diversi servizi debbano essere applicati insieme per avere una consistenza, ma non si può avere la garanzia che in ogni servizio la transazione abbia successo. Per gestire questa casistica, si usa il modello **SAGA** dove le operazioni transazionali che sono compiute da un messaggio devono prevedere anche delle operazioni compensative che vengono attivate da un altro messaggio. In questo modo, a fronte di un errore nel flusso, si inserisce un messaggio compensativo che annulla tutte le operazioni transazionali già effettuate.
Nel concreto:

- solitamente c'è un microservizio (per esempio "scheduler") che si occupa di gestire le operazioni transazionali che devono essere effettuate e chiama in maniera SINCRONA i relativi servizi per effettuarle. Usa la chiamata SINCRONA perchè ha bisogno di avere una risposta immediata per poter procedere negli step successivi
- quando uno di questi step sincroni fallisce, in maniera non transitoria (cioè, per esempio, si è ripetuta la chiamata per un certo periodo di tempo, ma continua a fallire) la transazione è considerata _partially failed_ allora si procede ad eseguire le operazioni compensative
- il servizio pubblica sulla coda un messaggio per innescare le operazioni di compensazione
- una altro servizio dedicato (per esempio "supervisor"), consuma il messaggio e lancia le operazioni di compensazione ed eventualmente fa operazioni aggiuntive del contesto (per esempio notifica che c'è stato un errore via email)
  - non è obbligatorio avere un servizio dedicato, ma è utile se la logica è complessa
  - è importante essere consapevoli che anche le operazioni di compensazione possono fallire e vanno gestite
- Inoltre potrebbe esserci la casistica che il servizio "scheduler" fallisca, si riavvii, e quindi interrompa la sua esecuzione degli step. Per questa casistica si può pensare ad un concetto di "check-point": si memorizza lo step che si è fatto e quelli mancanti, in modo che si possano eseguire gli step mancanti; oppure si possono gestire tutti gli step in maniera idempotente e si ripetono tutti non appena il servizio "scheduler" torna in funzione

#### Service Mesh

Per gestire le complessità dei microservizi si usa un software di **Service Mesh**. Si tratta di un layer proxy che gestisce tutte le comunicazioni tra microservizi in un contesto con container orchestrator. Su Kubernetes si possono usare **Linkerd** o **Istio**. Questi componenti migliorano il contesto tra microservizi, ma aumentano la complessità e possono avere impatto sulle performance, visto che sono dei proxy attraverso cui passano le chiamate. Cosa fanno:

- Migliorano il load balancing che fornisce kubernetes
- Migliorano il routing tra service
- Gestiscono i retry delle chiamate sulla base degli HTTP error codes
- Gestiscono il circuit breaking dei singoli servizi
- Aggiunge correlazione nel tracing tra messaggi per le metriche
- Gestisce il Mutual TLS (mTLS) nelle chiamate tra service

#### API Design

Le API sono il modo con cui una applicazione comunica all'esterno, nel caso dei microservizi ci sono API con cui si comunica con l'esterno ed API con cui si comunica tra microservizi. Solitamente le API verso l'esterno sono delle REST su HTTP, perchè sono chiare, semplici e supportate da tutti i client senza problemi. Internamente invece si possono fare scelte che migliorano le performance, a discapito della complessità (come ad esempio le gRPC). Senza entrare nel dettaglio, la regola base è che le REST possono andare bene anche per il backend a meno di particolari necessità di performance. A quel punto si scelgono tecnologie più performanti sulla base delle tecnologie usate nei singoli microservizi, sul service mesh utilizzato e sulle esigenze necessarie.

Alcune linee guida di come fare delle buone REST API:

- Non modellare le API sull'implementazione interna del servizio, ma sulle necessitò del dominio. Dovrebbero cambiare solamente quando vengono aggiunte nuove funzionalità, non quando si fa refactoring o modifiche a basso livello
- A volte client diversi hanno esigenze diverse in termini di dimensioni di payload e interazioni. Si potrebbero fornire delle API specifiche per client
- Valutare di rendere le operazioni idempotenti, quindi usare il metodo PUT, in modo che sia possibile eseguire l'operazione più volte senza problemi
- Utilizzare il response code 202 Accepted ogni volta che la chiamata riceve i dati e risponde in maniera asincrona prima di aver completato l'elaborazione. Si usa quando il server ti risponde di aver preso in carico l'esecuzione

#### API Versioning

Quando si introducono delle modifiche nelle proprie API, si deve cercare sempre di rendere retrocompatibili, per evitare che i client abbiano dei problemi dovuti alle modifiche. Se la modifica introduce nuovi campi e non rimuove o modifica gli attuali in maniera che i client abbiano dei side-effect, la modifica non richiede una nuova versione. Altrimenti è bene cambiare la versione della propria API e far convivere la versione precedente e quella nuova per garantire ai client continuità e tempo per la migrazione. Ci sono 2 modi per gestire la presenza di più versioni:

- Il codice del microservizio gestisce entrambe le versioni ed espone le due versioni
- Si esegue contemporaneamente su nodi diversi del cluster, sia il microservizio con la vecchia versione che quello con la nuova versione e, tramite delle regole di instradamento, si invia la chiamata al service corretto rispetto alla versione del URL

Il versionamento dovrebbe essere fatto tramite SemVer quindi MAJOR.MINOR.PATCH, ma i client dovrebbero sempre e solo basarsi sulla Major version. Mantenere numerose versioni può diventare particolarmente costoso, per cui deve essere resa obsoleta e rimossa ogni versione precedente il prima possibile. Se si parla di versioni ad uso interno dei microservizi, basterà il coordinamento tra team per migrare tutti all'ultima versione, mentre per api esposte all'esterno è più difficile perchè non si ha il controllo sulle terze parti.

#### Operazioni Idempotenti

Una operazione idempotente avviene quando può essere richiamata senza alcun problema. Non significa che viene ogni volta ripetuta la stessa operazione, nè che si ottiene lo stesso response code, anzi, solo che l'esito finale sul server è sempre lo stesso. I metodi GET, PUT, DELETE sono idempotenti (cioè devono essere implementati per esserlo). POST invece crea una risorsa ma non garantisce che il risultato sia lo stesso per ulteriori tentativi.

Utilizzare PUT al posto di POST non è scontato:

- POST
  - URL: `/api/deliveries`
  - Una volta chiamato ottengo in risposta l'url `/api/deliveries/39660` della risorsa creata
  - Il server ha scelto che ID dare alla risorsa e me l'ha restituito nella risposta
  - Se effettuo la stessa chiamata, mi creerà una nuova risorsa oppure fallirà
- PUT
  - URL: `/api/deliveries/39660`
  - Il client deve chiamare l'url con direttamente l'id, quindi questo non viene generato dal server ma indicato dal client
  - Se la risorsa non esiste, la crea, altrimenti la aggiorna. Il risultato finale ad ogni chiamata è sempre lo stesso: esiste quella risorsa con quello stato
  - Potrebbe cambiare il response code, la prima volta 201 Created, la seconda volta 204 No Content o 200 Success

#### Gestione dei dati

Ogni microservizio deve avere il suo database e non può accedere direttamente a quelli degli altri. Questo significa che ognuno è indipendente e può scegliere come salvare i dati (SQL, NoSQL, altro). Se più microservizi scelgono lo stesso tipo di DB, è accettabile utilizzare la stessa applicazione di DB, ma l'importante è che ogni microservizio abbia il suo DB Schema separato. Comunque avere un unica applicazione di DB crea un vincolo in termini di scaling, tutti i microservizi con uno Schema al suo interno potrebbero sovraccaricarlo e richiederne lo scaling, per cui solitamente è sempre meglio avere anche applicazioni separate.

Questa strategia introduce la complessità nella gestione della coerenza dei dati e la duplicazione di dati tra microservizi differenti. Alcune strategie che possono essere utili per gestire la complessità:

- Definire quali parti necessitano di una **strong consistency**, dove i dati devono essere sempre perfettamente sincronizzati e si applica il principio ACID (Atomicity Consistency Isolation Durability), o quali parti accettano una **eventual consistency**, dove è legittimo che siano consistenti dopo un possibile ritardo. Cercare di preferire quanto più possibile le **eventual consitency** alle **strong consistency**.
- Quando si duplicano i dati, si può considerare un singolo servizio come master di quel dato
- Usare i pattern **Scheduler Agent Supervisor** e **Compensating Transaction** per mantenere la coerenza tra servizi ed eventuali principi di checkpoint quando si eseguono workflow che eseguono insieme più step transazionali
- Salvare nel proprio microservizio solo i dati necessari
- Usare il modello **event-driven** per pubblicare eventi da un microservizio che altri microservizi posso consumare e utilizzare (pub/sub)
- Se un microservizio invia degli eventi, dovrebbe pubblicare uno schema (JSON Schema, proto o strumenti come [asyncapi](https://www.asyncapi.com/en)) che formalizza gli eventi e come utilizzarli da parte dei subscriber, un contratto sostanzialmente. Tramite lo schema ogni servizio si crea la sua struttura, indipendentemente dal linguaggio e senza condividere classi che creerebbero un accoppiamento. In questo modo il publisher può validare il messaggio prima di inviarlo e il subscriber deserializzarlo alla ricezione
- Se i messaggi sono numerosi, possono essere un collo di bottiglia e devono essere gestiti con aggregation o batch per ridurre il carico

#### Container orchestration

Solitamente un microservizio viene eseguito tramite un container. In locale è semplice quando si ha una singola esecuzione per ogni service sulla stessa macchina, ma in un cluster è più complesso. Solitamente ci sono più istanze del microservice che girano su nodi diversi, con un load balance (reverse proxy) che gestisce il traffico. Il cluster stesso si occupa di mantenere lo stato coerente dei microservizi (se un container muore, viene eseguito un nuovo container per ripristinare lo stato). Solitamente si usa Kubernetes, ma ci sono altri software e configurazioni specifiche del proprio Cloud Provider.

#### Suggerimenti pratici

##### Repository infra-local

Avere molti microservizi appartenenti allo stesso progetto potrebbe rendere caotico e complesso orchestrarli in locale. Sui server sarà tutto configurato in modo che ogni servizio venga deployato e comunichi con tutti i componenti del tuo cluster, ma in locale non hai questa struttura configurata solitamente. Per questo motivo può essere comodo avere un `infra-local` repository che orchestri localmente i microservizi, lo startup, le ENV, i componenti comuni.

Ipotizziamo di avere un progetto con:

- `service-a` e `service-b`
  - in NodeJS (ma il linguaggio è poco rilevante)
  - entrambi hanno bisogno di un DB relazionale (lo stesso)
  - comunicano tra di loro tramite un message broker

Localmente non hai nulla di tutto ciò, oppure hai il DB e message broker, ma di altri progetti che non vuoi mischiare. La cosa migliore sarebbe avere un `docker-compose.yml` che orchestri tutti i service dell'applicazione:

- il DB ed eventualmente lo inizializza
- il Message Broker
- l'ingress come Traefik o NGINX che permetta di avere un unico entrypoint con cui comunicare con tutti i microservizi
- il service-a e il service-b tramite il suo Dockerfile in cui semplicemente si incapsula il codice dell'applicazione e tramite ENV si punta agli altri servizi (DB e Message broker)

Essendo che il service-a e il service-b hanno il loro repository dedicato, ci sono vari modi per gestire il puntamento tra `infra-local` e quei repo:

- si usa una convenzione, in cui i 3 repo sono tutti allo stesso livello, ognuno nella relativa cartella col nome del repository e il `docker-compose.yml` in `infra-local` può puntare agevolmente al relativo Dockerfile con la convenzione assunta `build: ../service-a`. Questo deve comunque essere definito in un file README.md
- si configurano i service-a e service-b come Git submodules di `infra-local` in modo che risultino dentro il repo `infra-local` ma siano repo separati. Un po' complesso per l'obiettivo

### CQRS (Command Query Responsability Segregation) e Event Sourcing

Questi due pattern possono anche essere utilizzati separatamente, ma quando combinati si ottiengono grossi vantaggi perchè si riescono a gestire le complessità di entrambi e mantenerne i benefici.

#### CQRS

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

#### Event Sourcing

Questo approccio si basa su un **Event Store** che rappresenta un database di sequenza cronologica degli eventi. Questo è immutabile e possono solamente essere aggiunti nuovi eventi. Leggendo e applicando la cronologia degli eventi, si può avere lo stato in un certo momento del tempo. Un esempio classico è SVN che memorizza ogni commit come evento di modifica e per ricostrurire lo stato di un punto nel tempo, agisce utilizzando gli eventi.

I principi sono:

- Event: registrazioni immutabili del cambiamento di stato del sistema (e non dello stato del sistema) su una certa entity. Ogni azione compiuta viene registrata
- Stream: una sequenza ordinata di Event di una particolare entity
- Projection: modelli di lettura degli stream di event che permettono di ottenere lo stato dell'entity applicando lo stream di event.

Vantaggi:

- Hai tutti i cambiamenti di stato e quindi puoi fare audit e debugging di cos'è successo più facilmente
- Puoi ricostruire lo stato di ogni punto nel tempo, non solo lo stato corrente
- Puoi usare proiezioni che agevolino la lettura, raccogliendo solo i dati necessari e creando delle strutture che ne semplificano la lettura
- Scalabile orizzontalmente e permette chi consuma gli eventi di farlo in maniera asincrona

Complessità:

- Nonostante la scrittura di un evento sia molto semplice, la lettura dei dati è molto complessa
- Se ho tantissimi eventi, la projection sarà molto lunga da calcolare ad ogni richiesta, quindi bisogna gestire delle sorte di semplificazioni per poter leggere i dati velocemente

##### CQRS + Event Sourcing

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
- I Command potrebbero cambiare nel tempo, ma questi rimangono salvati nello stream, significa che vanno versionati e gestiti i cambiamenti di versione nel tempo

Componenti:

- **Struttura software**: consigliata è a microservizi usando Clean Architecture e DDD
  - Valutare framework che supportino questo tipo di architettura a seconda del linguaggio usato
- **Event Store**: si possono usare diversi DB come
  - EventStoreDB che è specifico nativo per event sourcing
  - ma anche db relazionali come PostgreSQL configurandolo per l'event sourcing
  - o non relazionali come MongoDB
  - Apache Kafka è un event streamer che può essere utile ma non è un event store persistente che permette di ricostruire lo stato
- **Read Store**: si possono usare diversi DB ma dipende dallo scopo
  - Db relazionali come PostgreSQL permettono materialized views per ottimizzare le query in lettura
  - MongoDB utile se il read model cambia spesso
  - ElasticSearch se servono aggrezioni e ricerche complesse
  - Redis per avere performance altissime salvando in memoria i dati
- **Message Bus**: sono validi sia RabbitMQ che Kafka

### Event-Driven Architecture

Generica architettura che si basa sullo scambio di messaggi tramite code (come RabbitMQ, Kafka...) invece di comunicazione sincrona.

#### Event-Carried State Transfer VS Notification Event

**Event-Carried State Transfer** fa si che quanto un evento è pubblicato da un servizio, questo contiene già tutte le informazioni necessarie agli altri servizi per aggiornare il proprio stato locale senza dover interrogare nuovamente il servizio originario.

Questo significa che se per esempio ho creato un nuovo ordine tramite il microservizio Order e devo mettere il relativo messaggio nella coda, questo conterrà tutti i dati dell'ordine. Quando l'eventuale microservizio Shipping consumerà quel messaggio, avrà immediatamente a disposizione tutto quello che gli serve a riguardo della spedizione perchè è già dentro al messaggio, visto che l'ordine conterrà la sua sezione shipping.

Questo costringe a generare messaggi più grandi, ma disaccoppia i servizi perchè non avranno necessità di chiedere ulteriori dati una volta consumato il messaggio.

**Notification Event** invece ha lo scopo di minimizzare la dimensione del messaggio, lasciando a chi consuma il compito di chiamare sincronicamente (tramite REST o analoghe) il servizio originario per ottenere i dati che gli servono.

Il caso precedente, dove viene creato un nuovo ordine, produrrebbe un messaggio che contiene solo l'id dell'ordine e il suo stato OrderCreated. Quando lo Shipping microservice consuma il messaggio farà una chiamata all'Order microservice per ottenere gli specifici dati di spedizione.

Questo permette di generare messaggi più piccoli e non divulgare a tutti i microservizi tutti i dati dell'entità (ne caso di dati sensibili), ma crea un accoppiamento tra i microservizi che potrebbe essere rischioso, visto che la chiamata sincrona potrebbe poi fallire. In alcuni casi può essere vantaggioso, per esempio se è comunque sempre necessario fare una chiamata REST per ottenere dati sempre aggiornati ed avere una certezza della consistenza (non solo al momento in cui si consuma il messaggio).

Quindi ECST (Event-Carried State Transfer) è da considerare la scelta principale a meno di condizioni particolari che non la permettono.

## Metodologie

Le metodologie sono approcci che danno delle linee guida al comportamento da tenere, non sono stringenti e strutturate come le architetture, ma permettono di avere uno stile e dei principi di approccio nei confronti del software. Si puà avere metodologie nello sviluppo, ma anche nella gestione del processo e progetto (come Scrum, Kanban).

### SemVer (Semantic Versioning)

[SemVer](https://semver.org/) è un sistema di versionamento a 3 cifre `{major}.{minor}.{patch}-{tag}+{{major}.{minor}.{patch}-{tag}+{buildmetadata}}` comune in moltissimi progetti. Il vantaggio è che tramite la sintassi della versione si riesce a capire i rischi che comporta un upgrade ad una certa versione successiva.

- **Major**: Viene incrementato quando si introduce una nuova funzionalità che rompe le nostre API di progetto. Quindi quando si aggiungono delle modifiche che non sono retrocompatibili. **Breaking changes**
  - Quando questo numero è incrementato, Minor e Patch vengono riportate a 0
  - Quando questo numero è 0, si intende che il progetto è in fase di sviluppo e quindi agli inizi. Infatti alla creazione di un nuovo progetto si usa `0.1.0`
- **Minor**: Viene incrementato quando si introduce una nuova funzionalità che cambia le nostre API di progetto, ma è retrocompatibile. Si incrementa anche se si sono fatte modifiche sostanziali al codice interno del progetto, senza aver aggiunto funzionalità, ma sempre retrocompatibili. **Non-breaking changes**
  - Quando questo numero è incrementato, Major rimane fisso e Patch viene riportato a 0
- **Patch**: questo numero viene incrementato quando si fanno correzioni di bug-fixing retrocompatibili e modifiche che non coinvolgono le API
- **tag**: (opzionale) indicano una pre-release della versione non ancora stabile e tramite `<tag>.<number>` si possono creare nuove versioni nello stesso tag `1.0.0-alpha.1`.
  - Si usa come label in ordine: `alpha` < `beta` < `rc` (release candidate, cioè la versione che dovrebbe essere definitiva, ma deve ancora essere confermata)
- **Build metadata**: (opzionale) identifica build specifiche e non indica una versione differente da quella senza il valore "buildmetadata", ma è una copia con il valore esplicito. Questo è utile nei sistemi di Continuous Integration che buildano automaticamente il codice, alla fine marcano la build risultante con questo "buildmetadata".
  - Classico vedere il `+sha.abc123` che rappresenta l'hash del commit su GitHub

#### Prefisso "v"

Si possono trovare delle versioni `v1.0.0` con il prefisso `v` e il pattern SemVer. Questi non sono strettamente SemVer. Solitamente il prefisso "v" viene messo automaticamente da alcuni tool per indicare "version", ma è decorativo rispetto ai numeri ed è da ignorare rispetto alle regole di SemVer.

Capita spesso di vedere la "v" nei "GitTag" o anche in altri contesti da package manager. Quando si fanno le operazioni rispetto al Git, la "v" va mantenuta (es. `git checkout v1.2.3`), mentre nei package manager la "v" viene omessa.

#### Gestire il codice dell'applicazione

Per rispettare questa modalità di versionamento si deve avere una certa struttura di sviluppo e gestione del codice. I vari commit vengono tutti raccolti dentro un branch, ma questo branch di sviluppo non aumenta di versione ogni volta. Il versionamento viene fatto solamente al momento del merge su "main" oppure alla creazione di un "tag".

Quando il merge su "main" e/o il "tag" viene effettuato ci possono essere:

- questo tag viene usato per creare la release
- oppure procedure automatiche di CI che leggono i commit e, grazie all'utilizzo di certe convenzioni, dei tool automatici capiscono il cambio di versione necessario e producono il ChangeLog e il tag su Git
  - Esempi di **Conventional Commits** (sistema più usato):
    - `BREAKING CHANGE: modifica non retrocompatibile` → MAJOR
    - `feat: aggiunta nuova funzionalità` → MINOR
    - `fix: risolto bug` → PATCH
  - Esempi di token nei commit usati da alcuni tool (più flessibile, ma meno usato):
    - `#vmajor`
    - `#vminor`
    - `#vpatch`

Ci sono varie modalità, ma è sempre positivo cercare di automatizzarle secondo le regole del proprio progetto.

#### Changelog e Release Notes

**Changelog** è un documento strutturato che mostra in ordine cronologico quello che è stato fatto sul progetto a livello di codice. È destinato ad altri sviluppatori e viene creato per ogni versione. Può essere scritto a mano oppure generato tramite tool automatici che leggono i commit e tramite i **Conventional Commits** riescono ad interpretarli per produrre il documento. Il file generato è `CHANGELOG.md` e viene aggiornato mettendo solitamente in cima le nuove righe.

**Release Notes** è un documento destinato agli utenti finali dell'applicazione e contiene solo le modifiche principali. Viene pubblicato insieme alla pubblicazione di una release pubblica dalla propria piattaforma, solitamente usando GitHub. Si può generare automaticamente sulla base delle PullRequest oppure manualmente dall'interfaccia di GitHub.

### Domain Driven Design (DDD)

Documentazione di Azure a riguardo [Domain Analysis](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)

Il DDD è una metodologia di progettazione del software che mette al centro il core business aziendale, considerato il dominio, e creando una struttura che rende più sostenibile un software complesso. Per software semplici, non vale la pena applicare questa metodologia. Questa metodologia si lega fortemente all'approccio a microservizi come architettura software.

Nel contesto del DDD il **dominio**:

- rappresenta ciò che l'applicazione deve fare come principalmente
- è il contesto di core business aziendale che il software deve supportare
- è un concetto logico, non un effettivo contenitore chiuso
- non è immutabile, può evolvere nel tempo con l'evolvere del business e della complessità
- il dominio contiene degli **esperti di dominio**, figure che lavorano all'interno di quel dominio, che lo sanno descrivere e sanno come vogliono che funzioni il software per agevolare il business del dominio

Esempio: una azienda con un ecommerce ha tantissime cose dentro il suo dominio, carrello, prodotti, utenti, pagamenti, ordini... Tutti questi fanno parte del suo dominio in quanto il core business è rappresentato dalla vendita di prodotti online. Per capire meglio questo dominio si deve creare un modello del dominio. Attenzione, se l'ecommerce di una azienda che fa anche vendita fisica, anche la vendita fisica fa parte dello stesso dominio, perchè è parte del core business aziendale. Eventualmente ci possono essere sottodomini.

La progettazione del modello del dominio si divide in due parti:

- **Strategic DDD**: Definisce i **Bounded Context**, cioè quelle aree logiche ben delimitate all'interno di un dominio, e il relativo **Obiquitous Language**
- **Tactical DDD**: si usano gli elementi base del DDD per creare il modello

#### Strategic DDD

Quando si deve partire con un nuovo progetto, l'intero progetto è considerabile il dominio. La fase di progettazione di un dominio è complessa e richiede di coinvolgere diversi esperti di quel contesto per capire come funziona, come interagisce e di cosa ha bisogno. Non è solo una questione da software architect, ma anche altre figure aziendali dovrebbero essere coinvolte. Qui si genera un diagramma dei flussi coinvolti. Da questo diagramma si possono iniziare a identificare i **sottodomini** distinti per aree di business circoscritte da regole e obiettivi ben definiti.

Una volta mappato il dominio in **sottodomini**, si sceglie come implementarli. L'implementazione verrà fatta nel **Bounded Context**:

- Solitamente un **sottodominio** viene implementato da un singolo **Bounded Context**
- Se il **sottodominio** è particolarmente grande con sotto-aree circoscritte, può essere implementato da più **Bounded Context**. Una alternativa è scomporre tale **sottodominio** in ulteriori **sottodomini** per rendere più chiare le aree
- Se più di un **sottodominio** è piccolo e ha logiche accumunabile ad altri, possono essere implementati insieme da un singolo **Bounded Context**. Questo caso è più raro.

Non ci sono regole fisse e quindi è lasciato alla progettazione del singolo caso, ma solitamente si sceglie come creare un **Bounded Context** facendosi queste domande:

- Ci sono regole e linguaggi comuni in questa area?
- Ci lavora un singolo team in questa area o più team?
- Ci sono motivi tecnici per separare questa area? (scalabilità, performance, sicurezza)
- All'interno ci sono parti che cambiano ed evolvolo indipendentemente da altre?

Spesso un approccio potrebbe essere anche quello di:

- Creare un diagramma del dominio in sottodomini con un rapporto 1:1 coi relativi bounded context
- Utilizzare questo diagramma come punto di partenza
- Nell'evoluzione, distinguere i sottodomini e i bounded context: potrebbe esserci un dominio che cresce troppo e richiede 2 bounded context per essere diviso o alcuni domini che si rivelano accumunabili e vengono poi messi in un singolo bounded context.

Una volta definiti i **Bounded Context** si definiscono i relativi **Obiquitous Language**: per definire la terminologia comune da utilizzare all'interno del **Bounded Context** tra sviluppatori e esperti di dominio, si definisce un vero e proprio glossario con le definizioni dei termini da utilizzare. Questa terminologia diventerà universare e trasversale all'interno del **Bounded Context** per ogni figura coinvolta. Anche il codice dovrà sottostare al questo linguaggio, per cui le classi, le entity e così via dovranno utilizzare questa terminologia. Il grande vantaggio è che rende ogni attore consapevole di cosa si stia parlando, creando una Knowledge Base comune e trasversale che agevola l'evoluzione del software.

Ci possono essere 3 tipi di relazione tra i **Bounded Context**:

- **Partnership**: i 2 **Bounded Context** cercano di collaborare e allineare i loro modelli
- **Upstream** / **Downstream**: un **Bounded Context** influenza il modello dell'altro.
  - Upstream è indipendente da Downstream
  - Upstream è la fonte delle informazioni
  - Downstream riceve le informazioni
- **Free**: nessuna dipendenza tra **Bounded Context**

Quando diversi **Bounded Context** devono interagire, non hanno lo stesso **Obiquitous Language** anche se si parla dello stesso concetto, per cui ci vuole un modo per comunicare tra contesti diversi: le **Context Map**. Questi sono vari pattern di **Context Map**:

- **Shared kernel**: due **Bounded Context** condividono parte del modello e quindi del linguaggio
- **Customer-Supplier**: Il downstream (supplier) influenza l'upstream (customer), magari perchè supplier è un contesto esterno, quindi il customer adatta il suo modello al supplier
- **Conformist**: Il downstream adotta il modello dell'upstream senza modificarlo, quindi il downstream ne adotta anche il linguaggio
- **Anticorruption Layer (ACL)**: il downstream traduce il modello dell'upstream nel proprio, quindi il linguaggio rimane diviso
- **Open Host Service**: un contesto espone un protocollo/API standard per tutti e il linguaggio è definito dal contratto dell'api
- **Published Language**: i dati/eventi condivisi usano un linguaggio comune e documentato per le integrazioni

Alla fine di tutto lo strategic layer si è prodotto i seguenti documenti:

- diagramma dei sottodomini
- Classificazione dei sottodomini (core, support, generic)
- mappa dei sottodomini e bounded context
- descrizione dei **Bounded Context** e relativi confini
- per ogni **Bounded Context** la relativa obiquitous language
- Per ogni interazione tra **Bounded Context** diversi, le context map relativa
- mappa organizzativa dei team assegnati ai **Bounded Context**
- Note sulle integrazioni
- Visione evolutiva / roadmap

#### Tactical DDD

Una volta definiti i confini, si inizia la modellazione vera e propria degli elementi del **Bounded Context** per poi creare le classi, metodi, interfacce. Questi sono alcuni degli oggetti:

- **Entity**: sostanzalmente una classe con una identità (ID). Il suo stato può cambiare una volta creata (cambiano gli attributi), ma l'entity è la stessa visto che l'ID è lo stesso (wsempio: un utente)
  - Le entità dovrebbero incorporare la loro logica di business e non essere solo dei contenitory di get/set
- **Value Object**: è una classe che non ha idendità e solitamente esiste in relazione ad un altro oggetto. Non avendo un ID, due value object sono uguali quando i loro attributi sono uguali (esempio: un indirizzo di un utente). Sono oggetti immutabili una volta creati.
  - Esempi possono esere i colori, le date, gli importi
- **Aggregate**: sono un insieme di entity e value object che sono tutte dipendenti da una singola Root Entity. Questo permette di gestirli insieme perchè sono strettamente legati a quell'entity.
  - L'aggregate contiene la logica che definisce come le entity al suo interno interagiscono, quando tale logica non è dipendente dall'entity stessa ma dall'interazione con le altre all'interno dell'aggregate
  - L'aggregate contiene le regole di **Invarianza**, cioè quelle regole di validazione che rende l'intero aggregate con tutti le sue entity valido per i principi dell'applicazione (un Agggregate che gestisce un BankAccount valida che non si possa prelevare più del saldo corrente)
  - Nel modello ci si riferisce direttamente alla Root Entity per riferirsi all'aggregato nel suo insieme
  - Le entity e i value object che dipendono dal Root Entity e quindi non sono indipendenti, devono essere messi dentro la stessa cartella dell'aggregate perchè quello è il loro contesto di esistenza; la logica con cui si muovono e per cui esistono è definita lì
- **Service**: un service è un oggetto che contiene della logica che non ha stato e non è legata a entity e value object. Sostanzalmente sono i metodi che effettuano logiche generiche
  - Domain service: sono logiche generiche di dominio che solitamente coinvolgono più entity e sono di basso livello
  - Application service: sono funzioni tecniche come user authentication, dove si orchestrano altri componenti del dominio ma non contengono logica di dominio e possono aver dipendenze con livelli più bassi del software
- **Repository**: si occupa di trovare le istanze delle entity e, solitamente, gestire la persistenza su db
- **Factory**: classi o metodi con lo scopo di creare le entity nascondendone la complessità della creazione
- **Domain Event**: servono a notificare ad altri sistemi eventi che sono successi. Non tutti gli eventi sono sempre utili, per esempio "un nuovo elemento è stato creato" potrebbe NON essere un evento utile, mentre "una spedizione è stata cancellata" magari è un evento utile.
  - Sono molto usati nel contesto dei microservizi per scambiare messaggi ed aggiornare gli stati tramite eventi asincroni

Questa potrebbe essere una mappatura dei concetti di DDD in una Clean Architecture:

| Concetto DDD                   | Equivalente Clean Architecture  |
| ------------------------------ | ------------------------------- |
| Entity                         | domain/entities/                |
| Value Object                   | domain/value-objects/           |
| Events                         | domain/events/                  |
| Domain Service                 | domain/services/                |
| Factories                      | domain/factories/               |
| Repository Interface           | application/interfaces/         |
| Application Service / Use Case | application/use-cases/          |
| Anti-Corruption Layer          | interface-adapters/mappers/     |
| UI / API                       | interface-adapters/controllers/ |
| Infrastructure                 | infrastructure/persistence/     |

```
src/
├── domain/                      # Core del modello di dominio
│   ├── entities/               # Entità con identità (es. Order, Customer)
│   ├── aggregates/             # Root + regole di consistenza (es. OrderAggregate)
│   ├── value-objects/          # Oggetti immutabili senza identità (es. Money, Address)
│   ├── services/               # Domain Services (logica che non appartiene a una singola entità)
│   ├── factories/              # Costruttori complessi (es. OrderFactory)
│   └── events/                 # Eventi di dominio (es. OrderCreatedEvent)
│
├── application/                # Casi d’uso e orchestrazione
│   ├── use-cases/              # Es. CreateOrderUseCase
│   ├── interfaces/             # Porte inbound/outbound (es. IOrderRepository)
│   ├── dtos/                   # Input/output dei use-case
│   └── exceptions/             # Errori applicativi
│
├── interface-adapters/         # Traduttori tra mondo esterno e core
│   ├── controllers/            # Adapter inbound (es. HTTP)
│   ├── presenters/             # Format output → ViewModel
│   ├── mappers/                # DTO ↔ Entità / Aggregati
│   └── view-models/            # Modelli per la presentazione
│
├── infrastructure/             # Adapter outbound e tecnologie esterne
│   ├── persistence/            # Implementazioni repository (es. DB, ORM)
│   ├── external-services/      # API esterne, email, file system
│   ├── configuration/          # DI, settings, env
│   └── logging/                # Log adapter
│
├── shared/                     # Codice riutilizzabile
│   ├── utils/
│   ├── constants/
│   └── errors/
│
└── main.ts                     # Entry point dell’applicazione
```

## Protocolli

### Firma Digitale

Non è un protocollo in senso stretto, ma più un processo che si occupa di rendere sicuro un flusso di dati attraverso la firma di un hash utilizzando la chiave privata/pubblica di un certificato:

- Si sceglie un protocollo di hashing, per esempio SHA256 + Base64, e si applica questo protocollo per ottenere una stringa hash da una stringa originale (che potrebbe essere un body di una request)
- Questo hash viene firmato tramite la chiave privata di un certificato, ottenendo una striga criptata
- Il destinatario otterrà la stringa in chiaro da cui l'hash è stato generato e l'algoritmo utilizzato, per cui ricostruirà l'hash come ha fatto il mittente
- Inoltre, sempre il destinatario, utilizzando la chiave pubblica decripterà l'hash firmato e inviato dal mittente per confrontarlo con quello che si è costruito
- Se il risultato è identico, il file è corretto, altrimenti il file è stato manipolato e non è sicuro

Questo processo garantisce che i dati inviati e ricevuti siano gli stessi, ma richiede che a monte il mittente abbia prodotto la chiave privata e la relativa chiave pubblica, quindi che abbia dato al destinatario la chiave pubblica per usarla nella sua configurazione allo scopo di validare la firma digitale. La chiave privata deve rimanere segreta, perchè permette di generare la firma (cioè criptare la stringa), mentre se anche la chiave pubblica fosse divulgata, chi la ottiene può solo decriptare la firma ma non può generarne una nuova per manomettere il body della request.

### Authentication / Authorization

- L'authorization è quell'operazione che risponde alla domanda _"puoi accedere a questa risorsa?_" e quindi definisce cosa puoi fare.
- L'authentication è quella operazione che risponde alla domanda _"sei davvero chi dici di essere?"_ implementando il login e definendo che utente sta navigando l'applicazione.

#### Password-based

Si inserisce un nome utente e una password "segreta". Il sistema non deve mai salvare la password in chiaro (anche se per l'utente non c'è alcuna garanzia che un servizio non lo faccia). Il processo funziona che:

- La password (o la stringa risultante dalla concatenazione di username e password) viene trasformata in un hash tramite un algoritmo non reversibile (SHA256 + Base64)
- L'hash viene salvato a database associato allo username
- Nel processo di autenticazione si applica lo stesso algoritmo allo username e la password inseriti e si verifica che l'hash risultante sia lo stesso di quella salvato a database

Questo processa ha delle vulnerabilità date da: phishing, brute force, riutilizzo della stessa password su vari siti. Per rafforzare questa vulnerabilità intrinseca, si usa:

- **Autenticazione a 2 Fattori o Multi Fattore (2FA / MFA)**: serve un secondo elemento per avere l'approvazione su un dispositivo personale, come la ricezione di un OTP temporaneo sul telefono
- **Autenticazione biometrica**: è necessaria l'impronta digitale o il riconoscimento facciale
- **Token**: è necessario inserire un codice generato da applicazioni come Authenticator che generano token temporanei

##### Sessione

Autenticazione **Stateful** dove il server conserva la sessione una volta effettuata il login. Viene quindi generato un SessionID come Cookie utilizzato per riconoscere l'utente e quello che può fare. Non è molto scalabile ed occupa memoria per memorizzare le sessioni, ma è semplice da revocare cancellando la sessione. Utilizzata maggiormente nelle applicazioni tradizionali.

##### JWT (JSON Web Token)

Si basa su un JWT che contiene i dati dell'utente loggato e che il client invia ogni volta al server, per questo è una Autenticazione **Stateless**: ogni chiamata API è considerata con un utente loggato se invia il JWT, ma il server non salva nulla a riguardo. Sicuramente più scalabile e non occupa memoria, ma è più complessa la revoca, per questo solitamente si utilizzano validità molto brevi (15 min). Tramite un processo di refresh si può richiedere un nuovo token automaticamente:

- Al login si ottiene un AccessToken e un RefreshToken, quest'ultimo con una validità lunga
- L'AccessToken ha durata breve, il RefreshToken ha durata lunga
- Entrambi possono essere revocati in caso di furto
- Quando AccessToken scade, si fa una chiamata utilizzando il RefreshToken invece che ripetere l'interazione utente dove deve inserire username e password
- Riceve un nuovo AccessToken e RefreshToken validi

Utilizzato in applicazioni moderne, con microservizi e ambienti distribuiti.

#### SAML

Questo processo è un processo classico che gestisce l'authorization tramite un provider esterno. Si basa su dei redirect URL in POST con body in XML chiamati **SAML Request** e **SAML Response**.

I componenti sono:

- **SP (Service Provider)**: l'applicazione che necessita che l'utente effettui il login e che lo delega al IdP
- **IdP (Identity Provider)**: l'applicazione che ha tutti i dati per effettuare il login ed indicare al SP che l'utente è loggato ed ha un certo ID

Flusso:

- l'utente sul SP richiede di fare il login
- SP fa redirect verso IdP su un endpoint in POST con un body che contiene l'XML della SAML Request
  - Questa request contiene vari campi tra cui:
    - Issuer: entityID del tuo SP che lo identifica univocamente nell IdP (quindi un ID che è stato registrato precedentemente nel IdP)
    - AssertionConsumerServiceURL (ACS endpoint): endpoint del tuo SP dove IdP redirigerà l'utente dopo il login
    - NameIDPolicy: specifica il formato in cui riceverà indietro l'identità (per esempio email, userId,...)
    - La request può essere firmata tramite il processo di [Firma Digitale](#firma-digitale)
- IdP mostra la form di login ed attua il processo di login nel modo che preferisce (MFA, Biometria...)
- Una volta loggato con successo, IdP redirige sull'endpoint di SP definito nella SAML Request inviando la SAML Response che sarà firmata tramite il processo di [Firma Digitale](#firma-digitale)
  - Questa response contiene vari campi tra cui:
    - NameID: l'id dell'utente loggato
    - Firma col certificato dell'IdP, che SP validerà alla ricezione secondo il processo di [Firma Digitale](#firma-digitale)
    - NotBefore/NotOnOrAfter: validità temporale che SP validerà alla ricezione

#### OAuth 2.0 / OIDC (OpenID Connect)

OAuth 2.0 è un protocollo che fornisce solo l'**autorizzazione**, mentre OIDC fornisce anche l'**autenticazione**.

##### OAuth 2.0

Controlla e fornisce l'autorizzazione all'accesso alle risorse protette da parte di applicazioni client che lo richiedono. Lo scopo sostanzialmente è quello di dare ad una applicazione client il permesso di operare su una app server, utilizzando le sue API come se l'app client fosse il Resource Owner nella app server. Per esempio: creo una app client che possa creare dei file su Drive (app server), quindi faccio un flusso OAuth 2.0, dove chiedo l'interazione all'utente Resource Owner di permettere all'app client di creare file su Drive come se fosse lui stesso. In questo contesto l'app client non ha consapevolezza di chi sia l'utente Resource Owner che ha autorizzato l'accesso, perchè l'identità non è rilevante, ma sa che può chiamare le API ed eseguire le operazioni al suo posto.

Questo flusso si basa sulla gestione di questi componenti:

- **Resource Owner**: l'utente che possiede i dati
- **Client**: l'applicazione che vuole accedere ai dati
- **Authorization Server**: server dedicato a gestire il consenso e rilasciare i token
- **Resource Server**: server che ospita le effettive risorse protette

Flusso:

- L'utente accede all'appicazione client e chiede l'accesso ad una certa risorsa dell'app server
- Il client reindirizza l'utente all'Authorization Server (es. Google) con degli **scope** e un **endpoint uri** su cui ritornare
- L'utente (Resource Owner) autorizza l'accesso (essendo autenticato sull'Authorization Server con varie metodologie possibili)
- L'utente viene rediretto sull'applicazione client con un AuthorizationCode o direttamente l'AccessToken e opzionalmente un RefreshToken (come nel [JWT](#jwt))
- L'applicazione Client può usare l'AccessToken per accedere al ResourceServer rispetto allo scope richiesto

I principali Grant Types (flussi interni):

- **Authorization code**: si riceve al redirect solamente un Authorization Code utilizzabile una sola volta per ricevere indietro un AccessToken tramite una chiamata Rest. Utile per app web e mobile con interazioni utente ed un lato server che possa fare la chiamata per gestire in sicurezza l'Authorization Code senza che malintenzionati lo intercettino e lo usino.
  - Per le SPA (SinglePageApp) o comunque quelle applicazioni che non possono basarsi su un lato server per l'autenticazione, c'è una variante più avanzata che gestisce questa vulnerabilità chiamata **Authorization Code Flow with PKCE (Proof Key for Code Exchange)**:
    - il client prima di tutto genera un Code Verifier (una stringa casuale e segreta) e ne calcola il Code Challenge applicando un algoritmo di hashing (SHA256 + Base64) e invia nel redirect verso l'Authorization Server solo il Code Challenge e il Code Challenge Method (l'algoritmo di hashing usato)
    - L'utente si autentica e nel redirect back il client riceve l'Authorization Code
    - Per avere AccessToken e RefreshToken, il client chiama il token endpoint passando sia Authorization Code e Code Verifier
    - L'authorization server verifica che il Code Verifier corrisponda al Code Challenge utilizzando il Code Challenge Method passato precedentemente
- **Client Credentials**: si usa solo per le applicazione server-to-server senza interazioni con l'utente, dove l'autenticazione viene fatta direttamente tramite una chiamata passando il ClientId e ClientSecret, senza necessità di redirect
- **Refresh Token**: si invia il RefreshToken ottenuto precedentemente alla authorization per rinnovare l'AccessToken quando questo è scaduto. In questo modo si evita di dover eseguire un nuovo processo di authorization

##### OIDC (OpenID Connect)

Estende OAuth 2.0 aggiungendo l'autenticazione e, quindi, il Single Sign-On. Permette di recuperare e memorizzare le informazioni dell'utente tramite un ID Token in aggiunta ad Access e Refresh Token. Lo scopo è fondamentalmente quello di esternalizzare il login dalla tua applicazione client ad un provider esterno (Google, Microsoft, SPID...) utilizzando sempre lo stesso utente e delegando la parte di sicurezza all'esterno.

Componenti:

- **OpenID provider**: è l'Authorization Server che genera l'ID Token
- **End user**: l'utente le cui informazioni sono contenute nel ID Token
- **Relying Party**: l'applicazione client che richiede l'ID Token
- **ID Token**: il token creato dal OpenID provider con le informazioni dell'end user sottoforma di **claims**
- **Claims**: pezzi di informazione riguardo l'end user, cioè attributi del JWT

Il flusso è come quello di OAuth 2.0 e aggiungendo lo scope `openid`, quando ricevi l'AccessToken ricevi anche l'ID Token. Questo è utile se vuoi avere sia l'authorize che l'authenticate insieme. Ovviamente sulla base degli scope che invii, ricevi indietro i rispettivi token: se usi OIDC solo come SSO ma non ti servono le API di quel provider, ID Token è sufficiente e non serve l'AccessToken, ma se oltre al SSO vuoi anche chiamare delle relative API ti serve anche l'AccessToken (magari usando Microsoft salvi dei dati riguardo gli utenti su Azure che vuoi poter ispezionare tramite API) devi aggiungere gli opportuni scope. Alcuni sistemi comunque restituiscono sempre anche l'AccessToken di default.
