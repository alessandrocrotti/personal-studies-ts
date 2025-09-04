# Infrastructure Architecture

- [Infrastructure Architecture](#infrastructure-architecture)
  - [Descrizione](#descrizione)
  - [Continuous Integration / Continuous Delivery / Continuous Deployment (CI/CD)](#continuous-integration--continuous-delivery--continuous-deployment-cicd)
    - [Strategie di deployment in produzione](#strategie-di-deployment-in-produzione)
  - [Elementi Infrastrutturali](#elementi-infrastrutturali)
    - [Proxy](#proxy)
      - [Proxy (o Forward Proxy)](#proxy-o-forward-proxy)
      - [Reverse Proxy](#reverse-proxy)
      - [CDN](#cdn)

## Descrizione

Argomenti inerenti a come si struttura una architettura a livello di infrastruttura. A differenza dell'architettura software che si occupa di come una applicazione opera, l'infrastruttura si occupa di come una applicazione viene gestita e distribuita (il ciclo di vita). Ovviamente alcune architetture software sono strettamente legate a certe infrastrutture, ma questo non indica che l'architettura è infrastrutturale, perchè chi guida è la scelta di come organizzare l'operatività del software e dei suoi componenti

## Continuous Integration / Continuous Delivery / Continuous Deployment (CI/CD)

Principio di automazione del ciclo di vita di una applicazione:

- **Continuous Integration**: quando il codice viene mergiato in **main**, viene automaticamente buildato e vengono eseguiti i test automatici (unit test). Questo verifica che le nuove modifiche non causino problemi
- **Continuous Delivery**: dopo aver passato lo step precedente, si prepara il codice per l'installazione e lo si installa su un ambiente di Test/Staging. A questo livello si fanno ulteriori test automatici (E2E e Performance). L'obiettivo è quello di aver preparato il codice per poterlo installare in prod agevolmente, ma tramite una approvazione manuale e non automatica (in quanto prod è un ambiente delicato)
- **Continuous Deployment**: dopo aver passato lo step precedente, automaticamente si fa il deploy del codice in produzione

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
- Se l'applicazione è su Kubernetes, non è necessario creare 2 cluster, ma puoi creare nuovi pod con delle label dedicate e usare la label selector del service relativo all'applicazione per passare da una applicazione all'altra
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
  - I bug impattano su pochi utenti
  - Feedback dal traffico reale immediato
- Limiti
  - Processo più lungo e complesso in quanto devi gestire percentuali di pod che vengono eseguite per la nuova release insieme alla vecchia
  - Devi avere un buon monitoring

Si possono combinare avendo un approccio in cui sposti verso Green una piccola percentuale del traffico e quando è tutto ok sposti l'intero traffico.

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
