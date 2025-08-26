# Azure

- [Azure](#azure)
  - [Descrizione](#descrizione)
  - [Struttura](#struttura)
  - [Region](#region)
  - [Servizi](#servizi)
    - [Microservizi](#microservizi)

## Descrizione

Azure è una piattaforma cloud per gestire la tua infrastruttura su cui installare applicazioni. Ha moltissime funzionalità e conoscerle tutte richiede una grandissima esperienza, vale la pena analizzarle man mano che si ritiene possano essere necessarie.

Per progettare una struttura sul tuo Azure, puoi usare [Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/) che ti supporta nello strutturare la tua applicazione. Offre 3 modelli principali:

- IaaS (Infrastructure as a Service): con macchine virtuali e reti
- PaaS (Platform as a Service): con un ambiente per sviluppare e distribuire applicazioni
- SaaS (Software as a Service): con software già pronti

Il vantaggio è:

- Scalabilità: per aumentare e diminuire le risorse all'esigenza
- Sicurezza: i datacenter hanno elevati livelli di sicurezza
- Flessibilità: puoi implementare applicazioni con differenti linguaggi e utilizzare sistemi operativi diversi senza limitazioni
- Costo al consumo: paghi le risorse utilizzate

## Struttura

Quando crei delle `resource` queste vengono create in un `resource group` che raccolgono e gestiscono permessi e life-cycle delle risorse. I `resource group` sono creati dentro una `subscription` che a loro volta sono gestite dai `management group'.
Puoi marcare con dei `tag`le`subscription` `resource group` `resource` per cercare e organizzare meglio le tue risorse.

Normalmente il pattern usato per creare una risorsa è: `<resource_type>-<application_workflow>-<region>-<environment>-<counter>` (per esempio `rg-gettingstarteddemo-linuxvm-eus2-dev-01`)

## Region

Essendo una piattaforma globale distribuita in tutto il mondo, viene raggrupata in:

- **Geografies**: contiene una o più Regions
- **Regions**: è un insieme di uno o più datacenter collegati tra loro da una rete ad alta velocità
- **Datacenters**: ' l'unità più piccola che rappresenta un edificio reale pieno di server. Non scegli direttamente quale data center di una regioni usare, ma l'utente utilizza solo il concetto di region

Puoi visualizzare l'infrastruttura di Azure dentro a [Global Infrastructure](https://azure.microsoft.com/en-us/explore/global-infrastructure).

## Servizi

### Microservizi

Per implementare dei microservizi si possono scegliere alcuni di questi servizi:

- **Azure Function**: ti permette di eseguire del codice NON containerizzato come serverless function senza stato (nessuna persistenza dei dati), crei il tuo microservizio e lo esegui sul cloud in questo modo. Semplice per task reattivi e brevi, ti permette di scalare a zero quando non è in uso. Solitamente limitato a funzioni o eventi
  - Costo basato solo sul consimo effettivo di risorse visto che è serverless
  - Se si avessero diversi servizi serverless da coordinare, sarebbe complicato e si potrebbe utilizzare il servizio **Azure Logic Apps**
- **Azure Container Apps**: piattaforma serverless basata su Kubernetes, dove esegui il container dell'applicazione dove lo stato può essere gestito se si assegna uno storage esterno, ma di default è senza stato. Non hai accesso alle configurazioni di K8S, ma puoi fare autoscaling ed eseguire qualsiasi applicazione containerizzata. Valido per un microservizio semplice e che non richiede troppe configurazioni e senza l'accesso diretto al cluster.
  - Costo basato solo sul consimo effettivo di risorse visto che è serverless
  - Puoi anche usare Docker-Compose per avere più container insieme
- **Azure Service Fabric**: piattaforma completa per la gestione dei microservizi, con gestione dello stato nativamente (con sistemi di storage interni per i servizi stateful). Più complessa e configurabile, contiene all'interno diversi strumenti per CI/CD, monitoring, altro.
- **Azure Spring Apps**: è un servizio che gestisce applicazioni in Spring Boot. Non devi preoccuparti dell'infrastruttura che viene gestita automaticamente
- **AKS**: è il servizio di Kubernetes offerto e integrato nel contesto di Azure, richiede delle configurazioni ma è gestibile anche dal Azure Portal. Utile per microservizi cointenerizzati dove vuoi controllare il cluster. Lo stato è gestibile tramite configurazioni manuali degli storage.
  - Costo basato sia sulle macchine virtuali utilizzate nel cluster
- **Azure Red Hat OpenShift**: Permette di utilizzare OpenShift, che è una versione "Platform as a Service" dove sotto c'è Kubernetes
- **Azure Cosmos DB**: database non relazionale gestito e ottimizzato per Azure, ma con delle API per essere utilizzato al posto di MongoDB. Nel caso si usasse MongoDB per il proprio progetto, questo è il servizio specifico che offre Azure al suo posto senza dover modificare il proprio codice
