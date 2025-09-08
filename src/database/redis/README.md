# Redis

- [Redis](#redis)
  - [Descrizione](#descrizione)

## Descrizione

Redis (REmote DIctionary Server) è un database NoSQL in-memory, progettato per memorizzare i dati direttamente nella RAM per essere estremamente veloce con una struttura **key-value**.
Redis è volatile, ma puoi persistere i dati salvandoli su **Redis Database Snapshot (RDS)** (un file di dump) o **AOF (append-only file)**.

Casi d'uso:

- Caching: puoi memorizzare i risultati di query o contenuti statici (Full Page Cache FPC) per ridurre il carico. **Questo è l'uso principale**.
- Gestione di sessioni utente: tiene traccia degli utenti loggati. In questo caso può usare la persistenza per non perdere le sessioni memorizzate, soprattutto in contesti critici
- Code di messaggi: puoi usarlo per code tra sistemi asincroni e microservizi
- Pub/Sub: analogamente alle code di messaggi, puoi gestire i messaggi in tempo reale Pub/Sub

## Installazione

Tramite il file `docker-compose.yml` si può configurare l'installazione di redis e redisinsight come container docker, con un relativo volume per poter conservare i dati.

Creazione del container tramite docker compose:

```shell
cd src/tools/redis
docker-compose up -d
```

Nel caso fosse necessario cancellare sia il container che il relativo volume:

```shell
cd src/tools/redis
docker-compose down -v
```

Interfaccia redis insight: `http://localhost:5540/`

Esecuzione: `pnpm dev:redis`

## Single-thread event loop

Redis utilizza un single-thread event loop che gli permette di evitare la complessità della concorrenza multithread, ma essendo tutto in memory, è comunque estremamente veloce. Se una richiesta è troppo lenta, viene scartata dall'event loop. L'event loop non si ferma mai e compie operazioni atomiche che non possono essere interrotte da altri comandi, semplicando il comportamento.

## Struttura dati

La struttura è key-value, ma il value può essere un oggetto complesso. Inoltre riesce a riadattarsi da solo al comportamento dell'applicazione usando i tipi di value migliori: una lista corta è una ziplist, ma se diventa lunga la trasforma in una linkedlist.

Ogni chiave ha un TTL (TimeToLive) oltre il quale il Redis la cancella.

I tipi complessi:

- hash
- set
- liste
- stringhe compresse
- oggetti JSON

## Strategie di caching

CI sono diverse strategie che si possono utilizzare quando si usa Redis come caching system:

- cache-aside: il più noto e classico; in fase di lettura prima si tenta il recupero da Redis e se il dato non è presente lo recupera dal sistema di origine, aggiornando poi Redis. In fase di scrittura o modifica non si aggiorna la cache, o la si lascia scadere naturalmente o al massimo si invalidano le key pertinenti.
  - La cache non è il "master" dei dati, la sorgente d'origine lo è; può generare latenze aggiuntive in caso di miss frequenti delle key. Può creare incoerenza tra il momento della modifica e quello dell'aggiornamento della cache. Funzionale per i contesti dove la cache è opzionale
- write-through: in lettura funziona come cache-aside, mentre in scrittura ogni volta che si produce/modifica/cancella un dato da cachare dal sistema di origine, prima si scrive su redis il valore aggiornato e poi si chiama e memorizza sul sistema di origine. L'intero processo deve completarsi interamente per mantenere la coerenza tra cache e sistema di origine.
  - Questo permette che la cache sia sempre aggiornata al sistema di origine, rendendola molto consistente ma l'operazione di scrittura del sistema di origine diventa leggermente più lenta perchè aggiunge una operazione. Quindi in questo caso la cache è il "master" dei dati perchè è sempre aggiornata quando presente e non scaduta, mentre se mancante o scaduta verrà aggiornata alla prima lettura.
  - Variante write-back: il sistema di origine scrive il dato su Redis permettendo all'applicazione di leggerlo immediatamente, poi il dato viene scritto sul sistema di origine. Questo migliora le performance ma mette più a rischio l'integrità del dato letto dalla cache col dato scritto nel sistema di origine che potrebbe fallire.
- prefetching predittivo: più raro, il sistema prevede come popolare la cache in anticipo basandosi sui dati storici prevedibili e ciclici. Dipende molto dal contesto
  - Aumenta la velocità anticipando la cache, ma se il prefetch è efficiente e possibile

Queste sono logiche di approccio, non si implementano con particolari istruzioni specifiche. Molti contesti usano forme ibride tra cache-aside e write-through a seconda delle esigenze di certe risorse. Fondamentalmente dipende semplicemente da quando la tua applicazione aggiorna la cache tramite delle istruizioni esplicite nel tuo codice

Il caching solitamente viene fatto lato server: quando il server deve produrre un dato, verifica la cache ed eventualmente produce il dato e la aggiorna. Redis può essere usato anche lato client tramite il **Redis server-assisted caching**. In questo caso il client non è il browser ma un altro servizio che chiama il servizio di origine. Questa architettura permette di avere dei Redis Client associati al Redis Server, in modo che quando il Redis Server aggiorna una chiave, tutti i Redis Client subscribed vengono aggiornati col nuovo valore. Questo aumenta ulteriormente le performance, eliminando le chiamate da Client a Server per tutte le chiavi già presenti e mantenendole solo in caso di chiave miss o invalidazione della cache.

Il caching lato client aumenta la complessità e non è sempre necessario, ma aiuta ad incrementare ulteriormente le performance quando si hanno tante letture ripetitive e diminuire la banda consumata. Nei sistemi cloud distribuiti dove la rete può essere un collo di bottiglia nell'interazione tra nodi, questa può essere una buona soluzione. Inoltre gestire la cache interamente localmente nel Redis Client diminuisce anche il carico di operazioni sul Redis Server migliorandone le performance.
Però, se i dati sono molto volatili o critici, la cache locale rischia di fornire dati obsoleti e potrebbe non essere la scelta migliore.

Quando si usa Redis nella sua forma più semplice e comune, cioè per cachare delle chiavi, bastano i comandi "get/set/del" per gestire la maggior parte delle funzionalità. In caso di scenari che richiedono performance migliori, ci sono le funzioni avanzate.

## Persistenza

### Redis Database Snapshot (RDS)

Periodicamente si salva su disco l'intero database di Redis in formato binario. Molto performante perchè viene eseguito da un processo figlio senza influenzare il funzionamento di Redis, ma tra uno Snapshot e l'altro possono passare secondi o minuti creando una potenziale finestra di perdita dei dati.
Scelta valida nei casi in cui serve ripristinare il database velocemente anche a fronte di qualche perdita di dati.

### Append-only file (AOF)

Salva ogni comando di scrittura in un file che, al riavvio, Redis può usare per ricostruire il database. La persistenza dei dati è quasi in tempo reale ma utilizza più risorse su disco e una maggiore latenza in fase di ripristino.
Scelta obbligata nei casi in cui ogni modifica è critica e deve essere ripristinata.

### Versione ibrida

Combinando le due versioni precedenti, si possono utilizzare i benefici di entrambe. Si utilizzano contemporaneamente entrambi, permettendo di ripristinare rapidamente lo snapshot e utilizzare AOF per minimizzare la perdita di dati dopo il ripristino
