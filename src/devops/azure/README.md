# Azure

- [Azure](#azure)
  - [Descrizione](#descrizione)
  - [Struttura](#struttura)
  - [Region](#region)

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
