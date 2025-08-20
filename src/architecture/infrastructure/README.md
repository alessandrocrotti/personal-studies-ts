# Infrastructure Architecture

- [Infrastructure Architecture](#infrastructure-architecture)
  - [Descrizione](#descrizione)
  - [Continuous Integration / Continuous Delivery / Continuous Deployment (CI/CD)](#continuous-integration--continuous-delivery--continuous-deployment-cicd)
    - [Strategie di deployment in produzione](#strategie-di-deployment-in-produzione)
  - [Pattern Infrastrutturali](#pattern-infrastrutturali)
    - [N-Tier \\ Layer](#n-tier--layer)
    - [Web-Queue-Worker](#web-queue-worker)
    - [Event-Driven](#event-driven)
    - [Big Data](#big-data)
    - [Big Compute](#big-compute)
    - [Microservizi](#microservizi)
  - [Elementi Infrastrutturali](#elementi-infrastrutturali)
    - [Proxy](#proxy)
      - [Proxy (o Forward Proxy)](#proxy-o-forward-proxy)
      - [Reverse Proxy](#reverse-proxy)
      - [CDN](#cdn)

## Descrizione

Argomenti inerenti a come si struttura una architettura.

## Continuous Integration / Continuous Delivery / Continuous Deployment (CI/CD)

Principio di automazione del ciclo di vita di una applicazione:

- Continuous Integration: quando il codice viene mergiato in **main** il codice viene buildato e vengono eseguiti i test automatici (unit test). Questo verifica che le nuove modifiche non causino problemi
- Continuous Delivery: dopo aver passato lo step precedente, si prepara il codice per l'installazione e lo si installa su un ambiente di Test/Staging. A questo livello si fanno ulteriori test automatici (E2E e Performance). L'obiettivo è quello di aver preparato il codice per l'installazione in prod agevolmente, ma tramite una approvazione manuale
- Continuous Deployment: dopo aver passato lo step precedente, automaticamente si deploaya il codice in produzione

### Strategie di deployment in produzione

**Rolling Updates**: tramite Kubernetes, si può configurare il rolling updated dove si sceglie un numero minimo di pod che devono essere sempre disponibili. All'esecuzione del rolling update, i pod vecchi vengono spenti gradualmente e accesi quelli nuovi, fino a che tutti i pod nuovi hanno sostituito i pod vecchi.

- Vantaggi
  - Non c'è interruzione del funzionamento dell'applicazione
  - Semplice e automatizzato da Kubernetes
  - Anche il rollback si può effettuare alla stessa maniera
- Limiti
  - Per un periodo entrambe le versioni convivono
  - Se c'è un problema nella fase di deployment si fa il rollback di tutto

**Blue-Green deployment**: Blue è la versione attualmente in produzione, Green è la nuova versione già pronta e testata:

- Prepari e testi Green mentre Blue è ancora funzionante in parallelo
- Quando tutto è pronto su Green, switchi il traffico da Blue a Green
- Se ci sono problemi puoi riportare il traffico su Blue per fare il rollback
- Se l'applicazione è su Kubernetes, non è necessario creare 2 cluster, ma creare nuovi pod con delle label dedicate e usare il label selector del service relativo all'applicazione per passare da una applicazione all'altra
- Vantaggi
  - Rilascio e rollback immediato
- Limiti
  - Richiede il doppo di risorse per la fase di convivenza
  - Coordinamento stretto per i dati e stato (come le modifiche a DB)

**Canary Release**:

- distribuisce la nuova release a una piccola percentuale di utenti/nodi
- monitori la situazione
- aumenti gradatamente il traffico fino al 100%
- In caso di problemi fermi e ripristini il traffico alla versione precedente
- Vantaggi
  - Bug impattano su pochi utenti
  - Feedback dal traffico reale immediato
- Limiti
  - Processo più lungo e complesso in quanto devi gestire percentuali di pod che vengono eseguite per la nuova release insieme alla vecchia
  - Devi avere un buon monitoring

Si possono combinare avendo un approccio in cui sposti verso Green una piccola percentuale del traffico e quando è tutto ok sposti l'intero traffico.

## Pattern Infrastrutturali

Descrive alcuni pattern per creare architetture software su Cloud Platform a livello di infrastruttura. [Azure Architecture Styles](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/) è un buon link per vedere questi pattern.

### N-Tier \ Layer

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
- Evitare di replicare operazioni astratte comuni nei microservizi: separare l'astrazione dell'infrastrutturo dalla business logic e gestire l'astrazione dell'infrastruttura tramite framework come **Darp**. Nella pratica, se vuoi inviare messaggi ad un broker di code, se usi Darp hai una unica interfaccia tramite API indipendentemente dal provider (RabbitMQ, Kafka, Azure Service Bus), il provider viene configurato su Darp che fa da layer intermedio rendendo la tua applicazione indipendente dalla tecnologia e dai relativi cambiamenti. Sostanzialmente Darp è un sidecar container che gira insieme a quello dell'applicazione per gestire tutte queste interazioni astratte infrastrutturali

## Elementi Infrastrutturali

Questa sezione raccoglie elementi infrastrutturali che si possono trovare in una architettura.

### Proxy

Ci sono 3 concetti che si possono considerare:

#### Proxy (o Forward Proxy)

**Agisce per conto del client.** Il client invia la richiesta al proxy che a sua volta la invia al server.

- Anonimizza il client, nascondendo l'ip
- Bypassa le restrizioni geografiche o firewall
- Può filtrare i contenuti, come in un contesto aziendale dove si passa per un proxy
- Può gestire il caching locale

#### Reverse Proxy

**Agisce per conto del server.** Il client pensa di parlare direttamente col server, mentre parla con il Reverse Proxy che a sua volta poi comunica col server.

- Bilancia il carico tra più server
- Può gestire il caching delle risposte
- Protegge il server nascondendone l'infrastruttura
- SSL Termination, gestisce la cifratura fino a questo livello
- Può essere usato come Firewall Applicativo (WAF) in quanto controlla tutto il traffico prima che arrivi al server
- Esempio: NGINX

#### CDN

**Si tratta di una rete distribuita di reverse proxy e cache.** Invece di avere un unico reverse proxy, il backend è schermato da un insieme di essi.

- Puoi distributire contenuti statici da server geograficamente vicini al client
- Riduce la latenza
- Proteggi da DDoS attack
- Poi scalare globalmente senza sovraccaricare il server originario
- Esempi: Cloudflare, Akamai, Fastly

Struttura:

- Origin server: contiene l'applicativo reale che gira, può essere distribuito su più server
- Edge server: server distributiti geograficamente che cachano e rispondono ai client
- PoP (Point of Presence): Data center regionali che contengono gli Edge Server e gestiscono il traffico di quell'area geografica
- Routing system: decide quale Edge Server deve rispondere ad una request
- Caching system: logiche per cachare le response e alleggerire il traffico sull'origin server
- Load Balancer: distribuisce il traffico tra gli origin server
- Security Layer: protegge dai DDoS attack, bot, e applica le regole di WAF
