# WebSocket

- [WebSocket](#websocket)
  - [Descrizione](#descrizione)
  - [Struttura](#struttura)
  - [Utilizzo](#utilizzo)

## Descrizione

Si tratta di un protocollo sopra TCP per aprire una connessione tra client e server dove entrambi si possono scambiare messaggi liberamente, aprendo un canale Full-Duplex dove, quindi, la comunicazione è bidirezionale.
Aiuta nei contesti in cui si devono ricevere tanti dati, frequentemente, in tempo reale, evitando di fare il polling per riceverli; i dati vengono inviati non appena disponibili.

Casi d'uso sono le live dashboard, giochi multiplayer, chat, monitoraggio dati in tempo reale e sofware di collaborazione live.

Il vantaggio è anche che i frame di dati sono più leggeri rispetto alle normali chiamate HTTP. Non conviene se i dati arrivano sporadicamente e se non puoi gestire molte connessioni attive simultaneamente.

Sono pienamente compatibili con i browser.

## Struttura

Si crea un server a cui vari client si possono collegare per ricevere le risposte. Normalmente una applicazione ha un unico WS Server sulla porta 443 (quindi un wss), ma is possono creare anche vari server utilizzando porte diverse.

La logica di base è ad eventi, in modo che alla connessione/ricezione di un messaggio/disconnessione ed altri eventi sia il client che il server possano agire. Inoltre l'invio dei messaggi è anche azionato in altro modo e può avere varie logiche:

- **Server-Driven (pub/sub)**:
  - Il server invia in broadcast degli eventi ai client che si sono connessi
  - I client possono connettersi per ricevere certi tipi di messaggi (subscription), in modo che il server implementi una logica di filtro
  - Il server, per qualsiasi ragione, deve mandare una notifica. Le notifiche possono essere generati da cambi di stato nel server causati da altre logiche di backend come: notifiche di altri microservizi, messaggi da Kafka/RabbitMQ, cambi di stato sul db, valore di un sensore che viene mandato regolarmento o ad ogni cambio di stato
  - Questa notifica sarà relativa ad una subscription e solo i client che hanno richiesto i messaggi per questa subscription riceveranno il messaggio
  - Il server quindi deve avere una mappa che associa ad ogni client connesso la lista di subscription richieste
- **Client-Driven (request/response)** :
  - Il client invia dei messaggi al server
  - Il server elabora una risposta e manda il messaggio al client
  - Concetto di Request/Response analogo delle classiche REST API, ma il server potrebbe anche rispondere in più messaggi e in maniera asincrona ed eventualmente notificare futuri cambiamenti
    - Esempio chiedo la lista degli ordini fatti oggi:
      - REST: ottengo la lista generata dagli ordini effettuati fino al momento della request
      - WS: ottengo la lista degli ordini effettuati fino al momento della connessione e della richiesta degli ordini, ma alla creazione di nuovi ordini il server può inviarmi il nuovo ordine e permettere al client di aggiornare la lista
- **Routing tra client (chat)**:
  - il server mette a conoscenza ogni client di tutti i client attualmente connessi
  - un client manda un messaggio da inoltrare ad un altro client
  - il server si occupa del routing di questi messaggi tra client diversi

## Utilizzo

Sono una buona scelta quando serve:

- Che il server possa inviare delle notifiche ai client senza che il client faccia polling per riceverle
- Quando il client vuole avere aggiornamente in tempo reale rispetto di un certo stato (una risorsa o un sensore)
- Permettere ai client di comunicare uno con l'altro, come una chat
- Permettere ai client di condividere uno stato comune che viene influenzato dai client stessi: giochi multiplayer, strumenti di collaborazione interattiva
