# API Paradigms

Qui ci sono i dettagli e come implementare delle API con vari tipi di strutture. Ogni struttura ha vantaggi e svantaggi, modi per essere implementati e logiche specifiche. I dettagli sono nelle cartelle specifiche. Qui riassumiano gli scopi di ognuna, considerato che lo scopo è sempre di strutturare delle chiamate tra server e client.

## REST

- Gestiscono le **resource** con chiamate CRUD
- Sono ben compatibili con i browser
- Sono semplici e facili da implementare
- Utilizzando il protocollo HTTP/1.1 che è un po' meno performante, per cui possono essere lente in contesti di alta performance

## GraphQL

- Simili alle **REST** ma permettono di creare logiche dove il client richiede specifici dati nella response tramite query dichiarative dove decide cosa vuole come response
- Può sia interrogare tramite query che effettuare modifiche sul server tramite mutation
- Ottimizza il bandwidth e le performance
- Aumenta la complessità, ma è anche più adatta per contesti molto complessi con body molto grandi

## gRPC

- Alte performance, permettendo sia chiamate unary (request/response come le REST) che chiamate con stream, sfruttando il multiplexing del protocollo HTTP/2
- Non compatibili con i browser, per cui molto più indicate per interazioni interne tra microservizi
- Utilizzando gli stream, si possono avere comunicazioni in tempo reale
- Tramite il file `.proto` si ha una definizione precisa e solida dei metodi e come vengono usati dal server e dal client, con cui si autogenera il codice per qualsiasi linguaggio fosse necessaria la comunicazione
- Aumentano la complessità, richiedendo la gestione del file `.proto` e del server gRPC

## WebSocket

- Permettono di aprire un canale bidirezionale tra client/server che può comunicare ad eventi e in tempo reale
- Sono pienamente compatibili con i browser per applicazioni web
- Sono più leggere e performanti delle REST via HTTP
- Permettono di mettere in comunicazione client tra loro
- Aumentano la complessità per la gestione del server, degli eventi e delle varie tipologie di messaggi che si possono mettere a disposizione

## WebHook

- Permette di esporre un endpoint su cui ricevere delle notifiche come HTTP POST; un server che elabora delle informazioni sulla base di certi eventi chiama quell'endpoint per informarlo dell'evento
- Inverte il principio per cui il client richiede le informazioni e il server gliele fornisce, in questo caso il server invia direttamente le informazioni quando le ha al client che espone l'endpoint su cui ascolta
- Utile per aggiornare in tempo reale un client quando un evento avviene sul server. Per esempio un server esterno deve notificarti un evento
- Non viene utilizzato da un client su un browser, non avrebbe senso e solitamente è solamente S2S tra sistemi di backend o terze parti dove ci si possono scambiare anche dati sensibili ed APIKey
