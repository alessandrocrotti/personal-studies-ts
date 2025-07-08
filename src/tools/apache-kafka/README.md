# Apache Kafka

- [Apache Kafka](#apache-kafka)
  - [Descrizione](#descrizione)
    - [Struttura](#struttura)
    - [Funzionamento](#funzionamento)
  - [Installazione](#installazione)
  - [Interfaccia web](#interfaccia-web)
  - [Utilizzo](#utilizzo)

## Descrizione

Si tratta di un broker distribuito che gestisce lo streaming di eventi. Simile ad un broker AMQP come RabbitMQ, ma il funzionamento è un po differente.

- Non usa il protocollo AMQP, ma un protocollo proprietario
- Gli eventi non vengono rimossi una volta consumati, anzi rimangono con un tempo di vita o in modo permanente per essere riletti più volte
- Si possono consumare coe fossero messaggi, ma si può gestire lo stream di eventi anche in modo più articolato per fare query

### Struttura

- Gli eventi vengono prodotti all'interno di _topic_ che li mette a disposizione dei consumer
- I _topic_ contengono dei _consumer group_ che rappresentano l'oggetto associato ad un servizio dedicato a consumare i messaggi del _topic_. Più servizi sullo stesso _topic_ avranno ognuno il suo _consumer group_
- I _consumer group_ possono essere divisi in _partition_ che permettono ad un servizio di parallelizzare il consumo di eventi.
- All'interno di ogni _partition_ gli eventi sono ordinati, ma non lo sono tra _partition_ diverse; per ovviare al problema del consumo di messaggi relativi alla stessa entity senza seguire l'ordine, si può utilizzare un id quando si produce il messaggio.

Le performance di questa struttura sono molto elevate e permettono il consumo rapido di milioni di messaggi. Infatti è ottimale per scambi di messaggi elevati, altrimenti non vale la pena.

### Funzionamento

Ci sono diverse combinazioni che si possono fare per utilizzare Kafka.

- Tramite librerie per produrre e consumare eventi
- Librerie specifiche in java per fare query sugli stream di eventi
- In combinazione con altri tool di Apache per raccogliere i dati, interrogarli ed eventualmente metterli in altri punti

In generale si usa per:

- Scambio messaggi o eventi classico tra producer e consumer
- Usare processi sugli stream di eventi che elaborano i dati
- Aggregare i messaggi di log

## Installazione

Tramite il file `docker-compose.yml` si può configurare l'installazione di Apache Kafka come container docker, con un relativo volume per poter conservare i messaggi.

Verrà creato un container per la versione di Kakfa che NON utilizza più ZooKeeper e un container per la Kafka-UI per poter accedere tramite interfaccia web.

Creazione del container tramite docker compose:

```shell
cd src/tools/apache-kafka
docker-compose up -d
```

Nel caso fosse necessario cancellare sia il container che il relativo volume:

```shell
cd src/tools/apache-kafka
docker-compose down -v
```

## Interfaccia web

http://localhost:8181/

## Utilizzo
