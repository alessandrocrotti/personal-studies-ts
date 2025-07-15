# gRPC (Google Remote Procedure Call)

- [gRPC (Google Remote Procedure Call)](#grpc-google-remote-procedure-call)
  - [Descrizione](#descrizione)
  - [Utilizzo](#utilizzo)
  - [Tipi di comunicazione](#tipi-di-comunicazione)
    - [Unary](#unary)
    - [Server-Side streaming](#server-side-streaming)
    - [Client-Side streaming](#client-side-streaming)
    - [Bidirectional streaming](#bidirectional-streaming)
  - [Struttura in un progetto](#struttura-in-un-progetto)
  - [Installazione](#installazione)

## Descrizione

Il principio delle **RPC** in generale è quello di permettere ad un client di chiamare delle funzioni remote come se fossero locali:

- Il client chiama una procedura remota (es. `getUser(id)`)
- Il server esegue la funzione e restituisce il risultato
- Il la comunicazione e la serializzazione sono astratte: dal punto di vista del codice si deve ragionare ad alto livello come se ci fossero funzioni e non chiamate ad url

**gRPC** è una implementazione di questo paradigma che si basa su questi componenti:

- **proto**: protocol buffers che è un linguaggio binario, compatto e tipizzato per definire i messaggi e le API
- **HTTP/2**: utilizzando questo protocollo di comunicazione, si può sfruttare il multiplexing, streaming e compressione. Rende tutto più veloce rispetto alle REST in HTTP/1.1 ed ottimo per le app real-time
- **Stub**: generazione automatica del codice client per comunicare col server
- **Service**: definizione delle funzioni sul server

## Utilizzo

I browser attuali non supportano gRPC, per cui solitamente queste API sono più per contesti Server2Server.
In contesti web si può utilizzare, ma con un layer aggiuntivo che si chiama **gRPC-Web** che fa da ponte tra il browser e le chiamate gRPC. Sarebbe sostanzialmente un proxy che trasforma le chiamate dal web in chiamate gRPC. Permette limitatamente di utilizzare tutte le potenzialità gRPC, per cui se servono comunicazioni bidirezionali in tempo reale, vale la pena valutare anche le **GraphQL subscription** e le **WebSocket**.

## Tipi di comunicazione

Ci sono 4 tipi di comunicazione che si possono definire: unary, server-side streaming, client-side streaming, bidirectional streaming

### Unary

Ad ogni richiesta si ottiene una risposta. Analoga a qualsiasi chiamata REST o HTTP classica

Configurazione nel file `.proto`: `rpc FOO (Req) returns (Res);`

### Server-Side streaming

Ad una richiesta si ottengono molte risposte dal server in uno stream.

Configurazione nel file `.proto`: `rpc FOO (Req) returns (stream Res);`

**Caso d'uso**: un'app di tracking dei veicoli. Il client richiede i dati sulla posizione di un veicolo con un certo ID e il server manda una serie di aggiornamenti sulla posizione di quel veicolo

Utile per dashboard in tempo reale e monitoraggio continuo.

### Client-Side streaming

Molte richieste al server tramite uno stream restituiscono una sola risposta.

Configurazione nel file `.proto`: `rpc FOO (stream Req) returns (Res);`

**Caso d'uso**: il client manda numerosi messaggi e il server risponde alla fine con il riepilogo o la conferma, comune un app che invia una serie di log o un sensore che invia una serie di valori.

Utile per ridurre l'overhead quando si inviano tanti dati di input.

In un caso di una applicazione che manda regolarmente i suoi log, puoi anche aprire la connessione e lo stream all'avvio dell'applicazione, tenere la connessione sempre aperta fino a che non viene spenta l'applicazione usando "keep-alive". Questo rende l'applicazione più attiva ed efficiente. Altrimenti si può bufferizzare i messaggi a blocchi e mandarli periodicamente aprendo e chiudendo la connessione dello stream ogni volta.

### Bidirectional streaming

Molte richieste al server tramite uno stream restituiscono molte risposte tramite uno stream.

Configurazione nel file `.proto`: `rpc FOO (stream Req) returns (stream Res);`

**Caso d'uso**: un'app di chat o collaborazione come Google Docs, dove sia il client che il server inviano molti messaggi in tempo reale senza aspettare che l'altro finisca

Utile per i giochi multiplayer, trading, editing collaborativo

## Struttura in un progetto

Considerando che i file `.proto` sono in comune e generano sia il codice per il server che per il client, ci vuole una strategia per non duplicare il codice. La scelta migliore è quella di creare un repo dedicato ai `proto` (unico per tutti i team o uno per microservizio) in cui si mettono i `.proto` e si genera il codice tramite CD/CI creando un package per ogni linguaggio che necessita di questo gRPC. Ci dovrebbe essere una logica di versionamento ed eventuali logiche di accesso alle cartelle del repo per team.

In questo modo, ogni progetto, sia client che server, dovrà importare il package senza duplicare codice.

## Installazione

Il codice per la comunicazione tra client e server viene autogenerato dal tool `buf` sulla base dei file `.proto`. Per autogenerarlo basta lanciare il comando:

```bash
pnpm generate:protos
```
