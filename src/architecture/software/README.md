# Software Architecture

- [Software Architecture](#software-architecture)
  - [Descrizione](#descrizione)
  - [Architetture software e infrastracture](#architetture-software-e-infrastracture)
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
  - [Metodologie](#metodologie)
    - [Domain Driven Design (DDD)](#domain-driven-design-ddd)
      - [Strategic DDD](#strategic-ddd)
      - [Tactical DDD](#tactical-ddd)

## Descrizione

Le software architecture sono quelle strutture che servono a gestire l'operatività dell'applicazione, che può coinvolgere indirettamente l'architettura, ma comunque si parla di come il software interagisce coi suoi componenti per funzionare. Non si parla solamente di come sviluppare il codice, ma la struttura intera dell'applicazione, senza occuparsi di come verrà gestita nell'infrastruttura.

## Architetture software e infrastracture

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
- Queue: il Front End riceve dal client una operazione da eseguire, quindi genera e manda un messaggio alla coda che verrà utilizzato dal worker
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

- **Management or orchestration**: gestisce il deploy, lo scaling e il riavvio dei microservizi sui nodi. Normalmente si può usare Kubernetes ma ci sono anche componenti Cloud-Native analoghi
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
  - Si può applicare il pattern **SAGA** che ad ogni ti po di azione deve prevedere una azione di compensazione che possa annullare la precedente in caso di fallimento (esempio: un evento OrderCreated compensato da CancelOrder oppure un pagamento andato a buon fine con un evento PaymentProcessed compensato da un evento RefundPayment). Questo significa che ad ogni passo, se un intero processo dovrebbe completarsi insieme ma fallisce ad un certo step, vengono lanciati gli eventi compensativi degli step già effettuati.
- Gestione DevOps articolata e consapevole
- Versionamento: ogni nuova release di un servizio deve essere versionata per evitare di rompere dei servizi che lo utilizzano. Questi servizi dipendenti aggiorneranno la versione usata nel momento in cui saranno pronti
- Richiede capacità avanzate per tutti i membri del team

Best Practices:

- Usare il DomainDrivenDesign per definire i confini di un service, ma evitare di creare troppi microservizi inutilmente piccoli che aumenterebbero la complessità e ridurrebbero le performance
- Decentralizzare ogni aspetto, i team non devono essere totalmente indipendentim sia come codice che come schemi
- Crea delle regole standard di approccio comuni per tutti i microservizi, come logging, monitoring, deployment, e limita il numero di tecnologie diverse
- I data storage devono essere privati di ogni service
- Le API con cui comunica un microservizio devono essere rappresentative del contesto di quel dominio e non della sua struttura interna (per esempio, non devi usare per forza gli stessi nomi di oggetti nelle API e internamente, ma devono essere chiari all'esterno per gli altri)
- Utilizza il mutual TLS/SSL per la comunicazione tra microservizi per aumentare la sicurezza, dove sia client che server si devono autenticare via certificato. Può sembrare inutile in una rete interna, ma serve ad aumentare la sicurezza in casi di container compromessi, utilizzo di ambienti DEV e PROD nella stessa rete o utilizzo di più tenant rappresentanti clienti diversi insieme
- Utilizza il gateway per tutte le operazioni comuni e trasversali ai vari service (come l'authentication)
- Il gateway però non deve contenere alcuna business logic, al contrario dei microservizi, altrimenti avrebbe una dipendnza che potrebbe causare la perdita di indipendenza
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
- Gestire le configurazione all'esterno del microservizio per renderlo più flessibile e non all'interno (evitare file interni o valori hard-coded ma passare variabili d'ambiente)
- Evitare di avere logiche di validazione e sicurezza in ogni microservizio, invece è meglio avere un componente dedicato (esempio, l'API Gateway che controlla e valida il JWT e aggiunge i dati come header alle chiamate dirette nei singoli microservizi sottostanti)
- Evitare di replicare operazioni astratte comuni nei microservizi: separare l'astrazione dell'infrastrutturo dalla business logic e gestire l'astrazione dell'infrastruttura tramite framework come **Dapr**. Nella pratica, se vuoi inviare messaggi ad un broker di code, se usi Dapr hai una unica interfaccia tramite API indipendentemente dal provider (RabbitMQ, Kafka, Azure Service Bus), il provider viene configurato su Dapr che fa da layer intermedio rendendo la tua applicazione indipendente dalla tecnologia e dai relativi cambiamenti. Sostanzialmente Dapr è un sidecar container che gira insieme a quello dell'applicazione per gestire tutte queste interazioni astratte infrastrutturali

#### Progettazione dei microservizi

L'approccio più vicino ad una struttura a microservizi è il [Domain Driven Design](#domain-driven-design-ddd). Applicando questa metodologia si possono definire dei **Bounded Context** che normalmente poi verranno implementati come microservizi: un microservizio non dovrebbe superare i confini del **Bounded Context**, ma potenzialmente si potrebbe implementare tramite più microservizi.
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

- Resilienza: per qualsiasi motivo uno o più microservizi potrebber non rispondere (guasti, troppe richieste, riavvii). Ci sono due modelli per affrontare questi problemi:
  - Retry: se il problema è temporaneo e si risolve da solo, riprovare la chiamata verso il servizio per un certo numero di volte può ottenere un risultato positivo. Però, se la chiamata non è idempotente (come POST, PATCH) è una soluzione rischiosa, perchè il server potrebbe aver elaborato la request ma non aver restituito la response e quindi si invierebbero ed elaborerebbero più volte la stessa request.
  - Circuit Breaker: se un servizio inizia a fallire per le troppe richieste, le richieste si accumulano in coda consumando risorse critiche del sistema. Per evitare questo sovraccarico, il servizio può gestire 3 stati: closed (tutto funziona regolarmente), open (il flusso si interrompe e le chiamate vengono bloccate immediatamente), half-open (dopo un po' che è aperto, una parte di chiamate vengono fatte passare per verificare se il sistema è tornato a funzionare e si può chiudere o si deve mantenere aperto)
- Load balancing: normalmente un Service in Kubernetes gestisce il traffico assegnando la request ad un pod casuale, ma tramite il Service Mesh si possono avere logiche migliori
- Distributed Tracing: gestire flussi e transazioni che sono trasversali a più servizi può rendere difficile il monitoring del sistema. Serve un modo per collegarli
- Service versioning: quando si evolve un servizio i chiamanti potrebbero avere dei malfunzionamenti, quindi è necessario fare un versioning e mantenere più versioni funzionanti in parallelo per non rompere i chiamanti del servizio modificato
- TLS encryption and mutual TLS authentication: per aumentare la sicurezza si può crittografare tramite TLS anche il traffico interno ai microservizi

##### Comunicazione asicrona

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

- solitamente c'è un microservizio (per esempio "scheduler") che si occupa di gestire le operazioni transazionali che devono essere effettuate e chiama in maniera SINCRONA i relativi servizi per effetttuarle. Usa la chiamata SINCRONA perchè ha bisogno di avere una risposta immediata per poter procedere negli step successivi
- quando uno di questi step sincroni fallisce, in maniera non transitoria (cioè, per esempio, si è ripetuta la chiamata per un certo periodo di tempo, ma continua a fallire) allora si procede ad eseguire le operazioni transitorie
- il servizio pubblica sulla coda un messaggio per innescare le operazioni di compensazione
- una altro servizio dedicato (per esempito "supervisor"), consuma il messaggio e lancia le operazioni di compensazione ed eventualmente fa operazioni aggiuntive del contesto (per esempio notifica che c'è stato un errore via email)
  - non è obbligatorio avere un servizio dedicato, ma è utile se la logica è complessa
  - è importante essere consapevoli che anche le operazioni di compensazione possono fallire e vanno gestite
- Inoltre potrebbe esserci la casistica che il servizio "scheduler" fallisca, si riavvii, e quindi interrompa la sua esecuzione degli step. Per questa casistica si può pensare ad un concetto di "check-point": si memorizza lo step che si è fatto e quelli mancanti, in modo che si possano eseguire gli step mancanti; oppure si possono gestire tutti gli step in maniera idempotente e si ripetono tutti non appena il servizio "scheduler" torna in funzione

##### Service Mesh

Per gestire le complessità dei microservizi si usa un software di **Service Mesh**. Si tratta di un layer proxy che gestisce tutte le comunicazioni tra microservizi in un contesto con container orchestrator. Su Kubernetes si possono usare **Linkerd** o **Istio**. Questi componenti migliorano il contesto tra microservizi, ma aumentano la complessità e possono avere impatto sulle performance, visto che sono dei proxy attraverso cui passano le chiamate. Cosa fanno:

- Migliorano il load balancing che fornisce kubernetes
- Migliorano il routing tra service
- Gestiscono i retry delle chiamate sulla base degli HTTP error codes
- Gestiscono il circuit breaking dei singoli servizi
- Aggiunge correlazione nel tracing tra messaggi per le metriche
- Gestisce il Mutual TLS (mTLS) nelle chiamate tra service

##### API Design

Le API sono il modo con cui una applicazione comunica all'esterno, nel caso dei microservizi ci sono API con cui si comunica con l'esterno ed API con cui si comunica tra microservizi. Solitamente le API verso l'esterno sono delle REST su HTTP, perchè sono chiare, semplici e supportate da tutti i client senza problemi. Internamente invece si possono fare scelte che migliorano le performance, a discapito della complessità (come ad esempio le gRPC). Senza entrare nel dettaglio, la regola base è che le REST possono andare bene anche per il backend a meno di particolari necessità di performance. A quel punto si scelgono tecnologie più performanti sulla base delle tecnologie usate nei singoli microservizi, sul service mesh utilizzato e sulle esigenze necessarie.

Alcune linee guida di come fare delle buone REST API:

- Non modellare le API sull'implementazione interna del servizio, ma sulle necessitò del dominio. Dovrebbero cambiare solamente quando vengono aggiunte nuove funzionalità, non quando si fa refactoring o modifiche a basso livello
- A volte client diversi hanno esigenze diverse in termini di dimensioni di payload e interazioni. Si potrebbero fornire delle API specifiche per client
- Valutare di rendere le operazioni idempotenti, quindi usare il metodo PUT, in modo che sia possibile eseguire l'operazione più volte senza problemi
- Utilizzare il response code 202 Accepted ogni volta che la chiamata riceve i dati e risponde in maniera asincrona prima di aver completato l'elaborazione. Si usa quando il server ti risponde di aver preso in carico l'esecuzione

##### API Versioning

Quando si introducono delle modifiche nelle proprie API, si deve cercare sempre di rendere retrocompatibili, per evitare che i client abbiano dei problemi dovuti alle modifiche. Se la modifica introduce nuovi campi e non rimuove o modifica gli attuali in maniera che i client abbiano dei side-effect, la modifica non richiede una nuova versione. Altrimenti è bene cambiare la versione della propria API e far convivere la versione precedente e quella nuova per garantire ai client continuità e tempo per la migrazione. Ci sono 2 modi per gestire la presenza di più versioni:

- Il codice del microservizio gestisce entrambe le versioni ed espone le due versioni
- Si esegue sia il microservizio con la vecchia versione che quello con la nuova versione e tramite delle regole di instradamento, si invia la chiamata al service corretto rispetto alla versione del URL

Il versionamento dovrebbe essere fatto tramite SemVer quindi MAJOR.MINOR.PATCH, ma i client dovrebbero sempre e solo basarsi sulla Major version. Mantenere numerose versioni può diventare particolarmente costoso, per cui deve essere resa obsoleta e rimossa ogni versione precedente il prima possibile. Se si parla di versioni ad uso interno dei microservizi, basterà il coordinamento tra team per migrare tutti all'ultima versione, mentre per api esposte all'esterno è più difficile perchè non si ha il controllo sulle terze parti.

##### Operazioni Idempotenti

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

##### Gestione dei dati

Ogni microservizio deve avere il suo database e non può accedere direttamente a quelli degli altri. Questo significa che ognuno è indipendente e può scegliere come salvare i dati (SQL, NoSQL, altro). Se più microservizi scelgono lo stesso tipo di DB, è accettabile utilizzare la stessa applicazione di DB, ma l'importante è che ogni microservizio abbia il suo DB Schema separato.

Questa strategia introduce la complessità nella gestione della coerenza dei dati e la duplicazione di dati tra microservizi differenti. Alcune strategie che possono essere utili per gestire la complessità:

- Definire quali parti necessitano di una **strong consistency** dove i dati devono essere sempre perfettamente sincronizzati e si applica il principio ACID (Atomicity Consistency Isolation Durability) o **eventual consistency** dove è legittimo che siano consistenti dopo un possibile ritardo. Cercare di preferire quanto più possibile le **eventual consitency** alle **strong consistency**.
- Quando si duplicano i dati, si può considerare un singolo servizio come master di quel dato
- Usare i pattern **Scheduler Agent Supervisor** e **Compensating Transaction** per mantenere la coerenza tra servizi ed eventuali principi di checkpoint quando si eseguono workflow che eseguono insieme più step transazionali
- Salvare nel proprio microservizio solo i dati necessari
- Usare il modello **event driven** per pubblicare eventi da un microservizio che altri microservizi posso consumare e utilizzare (pub/sub)
- Se un microservizio invia degli eventi, dovrebbe pubblicare uno schema che formalizza gli eventi e come utilizzarli da parte dei subscriber, un contratto sostanzialmente. Tramite lo schema ogni servizio si crea la sua struttura, indipendentemente dal linguaggio e senza condividere classi che creerebber un accoppiamento. In questo modo il publisher può validare il messaggio prima di inviarlo e il subscriber deserializzarlo alla ricezione
- Se i messaggi sono numerosi, possono essere un collo di bottiglia e devono essere gestiti con aggregation o batch per ridurre il carico

##### Container orchestration

Solitamente in microservizio viene eseguito tramite un container. In locale è semplice quando si ha una singola esecuzione per ogni service sulla stessa macchina, ma in un cluster è più complesso. Solitamente ci sono più istanze del microservice che girano su nodi diversi, con un load balance (reverse proxy) che gestisce il traffico. Il cluster stesso si occupa di mantenere lo stato coerente dei microservizi, se un container muore, viene eseguito un nuovo container per ripristinare lo stato. Solitamente si usa Kubernetes, ma ci sono altri software e configurazioni specifiche del proprio Cloud Provider.

## Metodologie

Le metodologie sono approcci che danno delle linee guida al comportamento da tenere, non sono stringenti e strutturate come le architetture, ma permettono di avere uno stile e dei principi di approccio nei confronti del software. Si puà avere metodologie nello sviluppo, ma anche nella gestione del processo e progetto (come Scrum, Kanban).

### Domain Driven Design (DDD)

Documentazione di Azure a riguardo [Domain Analysis](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis)

Il DDD è una metodologia di progettazione del software che mette al centro il core business aziendale, considerato il dominio, e creando una struttura che rende più sostenibile un software complesso. Per software semplici, non vale la pena applicare questa metodologia. Questa metodologia si lega fortemente all'approccio a microservizi come architettura software.

Nel contesto del DDD il **dominio**:

- rappresenta ciò che l'applicazione deve fare come principalmente
- è il contesto di core business aziendale che il software deve supportare
- è un concetto logico, non un effettivo contenitore chiuso
- non è immutabile, può evolvere nel tempo con l'evolvere del business e della complessità
- il dominio contiene degli **esperti di dominio**, figure che lavorano all'interno di quel dominio, che lo sanno descrivere e sanno come vogliono che funzioni il software per agevolare il business del dominio

Esempio: un ecommerce ha tantissime cose dentro il suo dominio, carrello, prodotti, utenti, pagamenti, ordini... Tutti questi fanno parte del suo dominio e per capire meglio questo dominio si deve creare un modello del dominio. Attenzione, l'ecommerce di una azienda che fa anche vendita fisica, anche la vendita fisica fa parte dello stesso dominio, perchè è parte del core business aziendale. Eventualmente ci possono essere sottodomini.

La progettazione del modello del dominio si divide in due parti:

- Strategic DDD: Definisce i **Bounded Context**, cioè quelle aree logiche all'interno di un dominio, e il relativo **Obiquitous Language**
- Tactical DDD: si usano gli elementi base del DDD per creare il modello

#### Strategic DDD

Quando si deve partire con un nuovo progetto, l'intero progetto è considerabile il dominio. La fase di progettazione di un dominio è complessa e richiede di coinvolgere diversi esperti di quel contesto per capire come funziona, interagisce e di cosa ha bisogno. Non è solo una questione da software architect, ma anche altre figure aziendali dovrebbero essere coinvolte. Qui si genera un diagramma dei flussi coinvolti. Da questo diagramma si possono iniziare a identificare i **sottodomini** distinti per aree di business circoscritte da regole e obiettivi ben definiti.

Una volta mappato il dominio in **sottodomini**, se sceglie come implementarli. L'implementazione verrà fatta nel **Bounded Context**:

- Solitamente un **sottodominio** viene implementato da un singolo **Bounded Context**
- Se il **sottodominio** è particolarmente grande con sotto-aree circoscritte, può essere implementato da più **Bounded Context**. Una alternativa è scomporre il **sottodominio** in ulteriori **sottodomini** per rendere più chiara la distinzione
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

Una volta definiti i **Bounded Context** si definiscono i relativi **Obiquitous Language**: per definire la terminologia comune da utilizzare all'interno del **Bounded Context** tra sviluppatori e esperti di dominio, si definisce un vero e proprio glossario con le definizioni dei termini da utilizzare. Questa terminologia diventerà universare e trasversale all'interno del **Bounded Context** per ogni figura coinvolta. Anche il codice dovrà sottostare al questo linguaggio, per cui le classi, le entity e così via dovranno utilizzare questa terminologia. Il grande vantaggio è che rende ogni attore consapevole di cosa si stia parlando, creando una base knowledge comune e trasversale che agevola l'evoluzione del software.

Ci possono essere 3 tipi di relazione tra i **Bounded Context**:

- Partnership: i 2 **Bounded Context** cercano di collaborare e allineare i loro modelli
- Upstream / Downstream: un **Bounded Context** influenza il modello dell'altro.
  - Upstream è indipendente da Downstream
  - Upstream è la fonte delle informazioni
  - Downstream riceve le informazioni
- Free: nessuna dipendenza tra **Bounded Context**

Quando diversi **Bounded Context** devono interagire, non hanno lo stesso **Obiquitous Language** anche se si parla dello stesso concetto, per cui ci vuole un modo per comunicare tra contesti diversi: le **Context Map**. Questi sono vari pattern di **Context Map**:

- **Shared kernel**: due **Bounded Context** condividono parte del modello e quindi del linguaggio
- **Customer-Supplier**: Il downstream (supplier) influenza l'upstream (customer), magari perchè supplier è un contesto esterno, quindi il customer adatta il suo modello al supplier
- **Conformist**: Il downstream adotta il modello dell'upstream senza modificarlo, quindi il downstream ne adotta anche il linguaggio
- **Anticorruption Layer (ACL)**: il downstream traduce il modello dell'upstream nel proprio, quindi il linguaggio rimane diviso
- **Open Host Service**: un contesto espone un protocollo/API standard per tutti e il linguaggio è definito dal contratto dell'api
- **Published Language**: i dati/eventi condivisi usano un linguaggio comune e documentato per le integrazioni

Alla fine di tutto lo strategic layer si è prodotto i seguenti documenti documenti:

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

- Entity: sostanzalmente una classe con una identità (ID). Il suo stato può cambiare una volta creati (cambiano gli attributi), ma l'entity è la stessa visto che l'ID è lo stesso (Esempio un utente)
  - Le entità dovrebbero incorporare la loro logica di business e non essere solo dei contenitory di get/set
- Value Object: è una classe che non ha idendità e solitamente esiste in relazione ad un altro oggetto. Non avendo un ID, due oggetti valore sono uguali quando i suoi attributi sono uguali (Esempio un indirizzo di un utente). Sono oggetti immutabili una volta creati.
  - Esempi possono esere i colori, le date, gli importi
- Aggregate: sono un insieme di entity e value object che sono tutte dipendenti da una singola Root Entity. Questo permette di gestirli insieme perchè sono strettamente legati a quell'entity.
  - L'aggregate può anche contenere la logica che definisce come le entity al suo interno interagiscono, quando tale logica non è dipendente dall'entity stessa ma dall'interazione con le altre all'interno dell'aggregate
  - Nel modello ci si riferisce direttamente alla Root Entity per riferirsi all'aggregato nel suo insieme
- Service: un service è un oggetto che contiene della logica che non ha stato e non è legata a entity e value object. Sostanzalmente sono i metodi che effettuano logiche generiche
  - Domain service: sono logiche generiche di dominio che solitamente coinvolgono più entity e sono di basso livello
  - Application service: sono funzioni tecniche come user authentication, dove si orchestrano altri componenti del dominio ma non contiene logica di dominio e possono aver dipendenze con livelli più bassi del software
- Repository: si occupa di trovare le istanze delle entity e, solitamente, gestire la persistenza su db
- Factory: classi o metodi con lo scopo di creare le entity nascondendone la complessità della creazione
- Domain Event: servono a notificare ad altri sistemi eventi che sono successi, per esempio "un nuovo elemento è stato creato" NON è un evento, mentre "una spedizione è stata cancellata" è un evento.
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
