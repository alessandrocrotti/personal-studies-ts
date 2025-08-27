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
- Un _topic_ viene creato con un numero di _partition_ su cui suddividere i messaggi prodotti
- I _topic_ contengono dei _consumer group_ che rappresentano l'oggetto associato ad un servizio dedicato a consumare i messaggi del _topic_. Più servizi sullo stesso _topic_ avranno ognuno il suo _consumer group_
- I _consumer group_ possono essere divisi in _partition_ che permettono ad un servizio di parallelizzare il consumo di eventi. Le _partition_ sono definite a livello di _topic_ e sono le stesse per tutti i _consumer group_
- All'interno di ogni _partition_ gli eventi sono ordinati, ma non lo sono tra _partition_ diverse; per ovviare al problema del consumo di messaggi relativi alla stessa entity senza seguire l'ordine, si può utilizzare un id quando si produce il messaggio.

Le performance di questa struttura sono molto elevate e permettono il consumo rapido di milioni di messaggi. Infatti è ottimale per scambi di messaggi elevati, altrimenti non vale la pena.

La gestione delle partition e consumer funziona in questo modo, prendiamo il caso che se un _consumer group_ ha P _partition_ e C _consumer_:

- **P > C**: le partizioni aggiuntive vengono consumate dai consumer esistenti. Un consumer può consumare da più di una partition
- **P = C**: scenario ideale con mapping 1:1 dove ad ogni _partition_ ha uno e un solo _consumer_
- **P < C**: ci sarà una _partition_ assignata ad ogni _consumer_ disponibile e quelli in eccesso rimarranno in stati idle e non riceveranno messaggi

Inoltre esistono le _replica_ delle partition. Quando si ha un cluster di broker che lavorano assieme, si può scegliere di replicare le partizioni su gli altri cluster per aumentare la tolleranza ai guasti. Funziona in questo modo:

- si possono avere un numero di _replica_ <= al numero di broker nel cluster
- tra tutte le repliche c'è un leader che si occupa della scrittura e lettura
- le altre repliche hanno lo scopo di rimanere sincronizzate col leader e sostituirlo in caso di crash
- in locale si ha un solo broker, quindi si usa sempre un _replica factor_ = 1

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

Le connessioni e gli oggetti vengono generate tramite un Factory, l'oggetto `Kafka`, con cui si possono creare le istanze.

### Admin

Tramite la connessione admin si possono creare e gestire i Topic tramite codice invece che manualmente. I Topic non sono mai temporanei, una volta generati persistono, ma possono avere una retention ed essere rimossi dopo un certo periodo.
La creazione del topic avviene la prima volta, le configurazione sono applicate in quel momento, come il numero di _partition_. Ogni altra volta che si prova a creare il topic, Kafka restituirà un errore e la libreria semplicemente gestirà l'evento con un `return false` che non causerà alcun disservizio.

### Producer / Consumer

Si possono creare le istanze di producer indicando il topic relativo e quindi inviare i messaggi. Si può aggiungere la **key** del messaggio in modo che tutti i messaggi con la stessa **key** arrivino sulla stessa partition mantenendo quindi l'ordine.
Si possono creare le istanze di consumer segnando il _topic_ e il _consumer group_ di riferimento su cui fare la connessione. Poi si gestirà l'evento di ricezione del messaggio.
