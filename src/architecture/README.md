# Architecture

- [Architecture](#architecture)

## Descrizione

Argomenti inerenti a come si struttura una architettura.

## Proxy

Ci sono 3 concetti che si possono considerare:

### Proxy (o Forward Proxy)

**Agisce per conto del client.** Il client invia la richiesta al proxy che a sua volta la invia al server.

- Anonimizza il client, nascondendo l'ip
- Bypassa le restrizioni geografiche o firewall
- Può filtrare i contenuti, come in un contesto aziendale dove si passa per un proxy
- Può gestire il caching locale

### Reverse Proxy

**Agisce per conto del server.** Il client pensa di parlare direttamente col server, mentre parla con il Reverse Proxy che a sua volta poi comunica col server.

- Bilancia il carico tra più server
- Può gestire il caching delle risposte
- Protegge il server nascondendone l'infrastruttura
- SSL Termination, gestisce la cifratura fino a questo livello
- Può essere usato come Firewall Applicativo (WAF) in quanto controlla tutto il traffico prima che arrivi al server
- Esempio: NGINX

### CDN

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
