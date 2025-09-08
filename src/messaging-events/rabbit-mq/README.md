# RabbitMQ

- [RabbitMQ](#rabbitmq)
- [Descrizione](#descrizione)
  - [Installazione](#installazione)
  - [Interfaccia web](#interfaccia-web)
  - [Utilizzo](#utilizzo)
    - [Producer/Consumer](#producerconsumer)
    - [Exchange](#exchange)
    - [RPC: Remote Procedure Calls](#rpc-remote-procedure-calls)

# Descrizione

Si tratta di un Broker di messaggi su protocollo AMQP. Gestisce la connessione con _producer_ e _consumer_ per utilizzare integrazioni asincrone tra sistemi diversi.

## Installazione

Tramite il file `docker-compose.yml` si può configurare l'installazione di RabbitMQ come container docker, con un relativo volume per poter conservare i messaggi.

Creazione del container tramite docker compose:

```shell
cd src/tools/rabbit-mq
docker-compose up -d
```

Nel caso fosse necessario cancellare sia il container che il relativo volume:

```shell
cd src/tools/rabbit-mq
docker-compose down -v
```

## Interfaccia web

http://localhost:15672/

## Utilizzo

### Producer/Consumer

Il caso più semplice di utilizzo è quello in cui si ha un singolo producer che invia messaggi in una singola queue. Questo è un caso semplice dove non ci sono complessità, ma è anche il caso che rappresenta a basso livello quello che accade in tutti gli altri casi. Questo è anche chiamato _Work Queue_ e in questo contesto i consumer sono chiamati _worker_.

Il producer invia il messaggio e non appena il consumer è connesso e può consumare il messaggio, lo consuma mandando un ACK per dire che è stato consumato con successo. Questo messaggio viene rimosso.

Ci sono anche gestioni specifiche dell'ACK in modo da consumarlo nuovamente e gestire le DeadLetters (i messaggi che dopo vari tentativi non si è riusciti a consumare con successo)

### Exchange

Permette una gestione più articolara dell'invio e consumo di messaggi, dove ci possono essere più consumer coinvolti e varie regole di routing per scegliere quando un messaggio inviato dal producer deve raggiungere una certa coda.

In ogni caso, si possono sempre avere vari producer e vari consumer (ognuno legato ad una sua queue). La differenza si basa sulle routing rules usate, cioè le regole con cui un messaggio viene condiviso oppure no in una certa coda:

- **Fanout**: ogni messaggio che viene inviato, viene condiviso con ogni queue collegata all'exchange, non ci sono routing rules.
- **Direct**: ogni messaggio che viene inviato deve contenere una routingKey che viene utilizzata dalle routing rules come match perfetto. Tutte le code che hanno esattamente quella routingKey nella loro routing rule ricevono il messaggio.
- **Topic**: ogni messaggio che viene inviato deve contenere una routingKey che viene utilizzata dalle routing rules come pattern. Tutte le code il cui pattern è valido per quella routingKey nella loro routing rule ricevono il messaggio.
- **Headers**: ogni messaggio che viene inviato deve contenere un header che è una mappa key-value (JSON) che viene utilizzata dalle routing rules per sapere se almeno una o se tutte le chiavi devono essere presenti. Tutte le code il cui la routing rule è valida per quel header ricevono il messaggio.

### RPC: Remote Procedure Calls

Le RPC sono un **protocollo dei sistemi distribuiti** che permette ad un client di chiamare una funzione su un server remoto. Al contrario delle REST che solitamente offrono operazioni su un oggetto (CRUD), le RPC sono più dedicati alle funzioni remote. Possono essere implementate su protocollo HTTP (ma senza le restrizioni logiche delle RESTful), ma anche su protocollo AMQP oppure su HTTP/2 e proto usando le gRPC.

Ci sono vari modi per implementare le RPC, uno di questi è utilizzando i messaggi ma attendendo in una risposta sincrona:

- Il client crea una coda o si connette ad una coda considerata _replyTo_ queue
- Il client produce un messaggio sulla coda a cui il server è connesso per consumare, aggiungendo nel messaggio le properties _correlationId_ e _replyTo_
- Il server consuma il messaggio, esegue la funzione dedicata e risponde con il risultato della funzione producendo nella coda _replyTo_ un messaggio con la property _correlationId_
- Il client consuma il messaggio sulla _replyTo_ queue identificando tramite il _correlationId_ a quale messaggio originale si riferisse
- Se la _replyTo_ queue è stata creata temporaneamente al solo scopo di ricevere la risposta, volendo si può anche cancellare
- Incapsulando questa logica in una funziona _async_ che viene poi chiamata con _await_ dove si vuole utilizzare la remote procedure, si ottiene una flusso sincrono mentre sotto la logica è asincrona

Perchè utilizzarlo:

- Una gestione più leggera e veloce rispetto alle chiamate REST via HTTP che hanno un corpo molto più strutturato e pesante
- Basandosi su un broker, se il server avesse dei rallentamenti, comunque il broker garantisce che il messaggio verrà consumato e non sarà perso. Ovvio che se il server è giù per molto tempo, il client andrà in timeout

Perche non utilizzarlo

- Ci sono alternative più semplici come le REST, se le performance e la sicurezza della ricezione del messaggio non sono requisiti richiesti
- Ci sono alternative più performanti come le gRPC se si vogliono ottime performance ma non è richiesta la certezza di consumare un messaggio (se la connessione cade, la risposta viene persa)
