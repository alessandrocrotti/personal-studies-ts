# Database

- [Database](#database)
  - [Descrizione](#descrizione)
  - [Database Relazionale](#database-relazionale)
    - [Lock](#lock)
    - [JOIN](#join)
    - [ORM](#orm)
  - [Database Non Relazionale](#database-non-relazionale)

## Descrizione

Il software del database è chiamato **DBMS** (Database Management System), da distinguere dal **Database schema** che è l'istanza di database all'interno DBMS.

- Relazionale / SQL: database strutturato in tabelle con relazioni
- Non Relazionale / NoSQL: più flessibile, non strutturato, contiene elementi come documenti, grafi o chiave valore

Ci sono poi altri tipi di database che non ricadono esattamente in queste 2 categorie:

- Timeseries: gstiscono i dati temporali, cioè associano dei valori di un dato ad un timestamp. Questo permette di creare delle metriche e dei grafici

## Database Relazionale

Si basa su tabelle, con record e colonne. Si possono interrogare tramite le Query e si possono aggiornare con modifiche, eliminazione o inserimento di nuovi record. .

Descrizione:

- Usa il linguaggio SQL per eseguire le operazioni
- Esiste un Data Schema predefinito e fisso. Non si può modificare runtime, ma solamente da operazioni di "alterazione" che sono delicate
- La scalabilità è solo verticale, per gestire maggiore traffico si deve aumentare la singola macchina/nodo aumentando CPU, RAM, SSD
- Difficile da usare con BigData visto che è scalabile solo verticalmente
- Le operazioni sul relazionale sono **ACID** (Atomicità, Consistenza, Isolamento Durata) quindi danno una garanzia della consistenza dei dati

Concetti fondamentali:

- I dati sono organizzati in tabelle (relazioni), composte da righe (tuple) e colonne (attributi)
- Primary Key: identifica una riga univocamente all'interno di una tabella
- Foreign Key: collegano 2 tabelle creando una relazione tra dati
- Integrità Referenziale: verifica e garantisce che i puntamenti tra Foreign Key puntino a record esistenti
- Normalizzazione dei dati: si applica allo scopo di ridurre la ridondanza e migliorare la coerenza e ha 3 regole:
  - 1 Forma Normale: Ogni campo/colonna contiene valori atomici (niente liste), piuttosto si fanno più righe ognuna con un valore della lista -> Elimina i gruppi ripetuti
  - 2 Forma Normale: Ogni attributo dipende dalla chiave primaria -> Elimina le dipendenze parziali, utile quando la chiave è composta da più attributi e un attributo dipende da una parte della chiave primaria
  - 3 Forma Normale: Nessun attributo non chiave primaria dipende da un attributo non chiave primaria -> Elimina le dipendenze indirette, spostandole in altre tabelle

Concetti di performance:

- **Indici**: servono a trovare un record velocemente senza dover scorrere tutta la tabella, migliorando le performance della SELECT, ma peggiorando la INSERT/UPDATE/DELETE, perchè richiederà di aggiornare l'indice
  - Indice Primario: creato automaticamente sulla chiave primaria
  - Indice Unique: unicità del valore per una colonna
  - Indice composite: include più colonne insieme
  - Indice full-text: ottimizzato per la ricerca di un testo
  - Indice bitmap: utile in data warehouse quando hai colonne con pochi valori distinti
- **Transazioni**: un insieme di operazione SQL che vengono eseguite in un blocco unico, o COMMIT o ROLLBACK di tutte le operazioni
  - Mantengono la coerenza dei dati
- **Query plan/Execution plan**: esegue una query dettagliano ogni elemento che viene eseguito, l'ordine, gli indici usati, le operazioni fatte, il costo di ogni passaggio. Permette di avere informazioni su come ottimizzare quella query. Alcuni errori comuni:
  - Table Scan: non ci sono indici e devo scorrere tutta la tabella, lento se ci sono tanti record
  - Nested Loop: join tra tabelle. Se lento, può dipendere dalla mancanza di indici che quindi richiede di scorrere il prodotto cartesiano delle 2 tabelle in join
- **View**: è una queri salvata che può essere richiamata agevolmente per essere rieseguita nuovamente. Non memorizza i dati, serve per semplificare query molto complesse usate spesso e può essere usata come fosse un TABLE nei JOIN/SELECT
- **Materialized View**: simile alla View, ma i dati risultanti vengono memorizzati, come fosse uno snapshot statico. Occupa spazio su dico, ma rende le query molto veloci. Puoi aggiornare i dati con un comando specifico (REFRESH MATERIALIZED VIEW) che riesegue la query originale
- **Backup**: permette di salvare una copia dei dati per essere ripristinata in caso di problemi. Solitamente vengono automatizzati secondo questi tipi:
  - Full Backup: copia completa (frequenza settimanale). Lento da ripristinare
  - Differential Backup: copia solo le modifiche rispetto all'ultimo full backup (frequenza giornaliera). Relativamente veloce da ripristinare ma occupa più spazio
  - Incremental backup: copia delle modifica dall'ultimmo backup (full o differential) (molto frequente, orario). Relativamente lento da ripristinare, ma occupa meno spazio
  - Transactional Log: registro di tutte le operazioni eseguite sul database.
- **Recovery**: le strategie di recovery solitamente puntano a
  - point-in-time: ripristinare il db ad un preciso momento, eventualmente appena prima di un problema
  - restore + replay log: si ripristina un backup e si applicano Differential (e Incremental opzionalmente) e Transactional Log

### Lock

è una restrizione temporanea che il db impone su una risorsa per evitare che altri la modifichino o leggano in modo incoerente mentre è in uso. Solitamente i lock vengono gestiti all'interno di una transazione e rimangono attivi fintanto che non si esegue il comando COMMIT o ROLLBACK.

Tipi di lock:

- Shared Lock: permette la lettura ma blocca la scrittura
- Exclusive Lock: blocca sia scrittura che lettura
- Intent Lock: indica l'intenzione di bloccare righe specifiche. Usato per ottimizzare il lock su grandi tabelle
- Row-level Lock: blocca solo la riga interessata. Ottomo per la concorrenza, lasciando gli altri record disponibili
- Table-level lock: blocca l'intera tabella. Più sicuro, ma meno performante per l'applicazione

A cosa serve:

- Evitano le race condition: quando due utenti cercano di modificare un dato contemporaneamente
- Prevengono le dirty reads, non-repeatable reads e phantom reads
- Support l'isolamento ACID

Complessità:

- Deadlock: due transazioni si bloccano a vicenda su due risorse differenti e ognuna attende che l'altra sblocchi il proprio lock
- Blocking: rallentamento delle transazioni che restano in attesa

Strategie:

- Timeout: impostare un limite massimo di locking di una risorsa
- Optimistic lock: prima di effettuare il lock, utilizzando il contatore in una colonna specifica OCA: leggo il valore di OCA, faccio le modifiche, verifico il contatore OCA abbia ancora lo stesso valore, incremento OCA. Se tra la lettura prima di modificare e dopo aver modificato l'OCA è cambiato, significa che qualcun altro ha fatto una modifica parallela e io devo fare ROLLBACK della mia transazione. Permette di non lockare i record accettando la possibilità di eccezioni
- Pessimistic lock: blocco direttamente per evitare conflitti

### JOIN

Sono il sistema con cui si mettono in realzione 2 tabelle attraverso degli attributi di ugualianza:

- INNER JOIN: mostra i record con corrispondenza in entrambe le tabelle
  - Quello più comune, detto anche JOIN, serve per cercare dati validi e corrispondenti
  - FROM CLIENT JOIN ORDINI -> trova tutti i clienti con almeno un ordine
- LEFT JOIN: mostra tutte le righe della tabella di sinistra (FROM) anche se non c'è corrispondenza a destra, mettendo NULL i relativi dati
  - usato per trovare i dati mancanti
  - FROM CLIENT JOIN ORDINI -> trova tutti i clienti e la parte degli ordini sarà NULL
- RIGHT JOIN: mostra tutte le righe della tabella di destra (JOIN) anche se non c'è corrispondenza a sinistra, mettendo NULL i relativi dati
  - meno utilizzato solitamente
  - FROM CLIENT JOIN ORDINI -> trova tutti i gli ordini, anche se non ci sono clienti, mettendo la parte dei clienti come NULL
- FULL OUTER JOIN: mostra tutte le righe di entrambe le tabelle e mette NULL dove non c'è corrispondenza
  - usato per avere comunque tutte le combinazioni senza escludere i buchi sia da una parte che dall'altra
  - FROM CLIENT JOIN ORDINI -> trova tutti i clienti e quelli che non hanno ordini avranno NULL nei campi ordine e per gli ordini che non hanno clienti le colonne clienti saranno NULL mentre i campi ordini popolato
- CROSS JOIN: prodotto cartesiano delle due tabelle
  - Raramente utilizzato, serve per creare delle combinazioni
  - crea semplicemente una tabella di tutte le combinazioni possibili di tutti i valori delle due tabelle in prodotto cartesiano
- SELF JOIN: join con la tabella stessa
  - JOIN come le altre ma con riferimento alla stessa tabella con un alias differente

![SQL DIAGRAM](https://i0.wp.com/www.puntogeek.com/wp-content/uploads/2013/05/BHVicYICMAAdHGv.jpg?w=966&ssl=1)

### ORM

Object Relational Mapping è una tecnica che permette di collegare le tuple di un database agli oggetti del codice di una applicazione. Puoi lavorare con le tabelle come se fossero oggetti, evitando le query dirette a basso livello.

- Una classe rappresenta una tabella
- Gli attributi della classe sono le colonne
- Una istanza rappresenta una tupla (o potenziale tupla)
- Puoi fare le CRUD usando gli oggetti del codice

Vantaggio nella comodità, ma può avere performance peggiori per certe query.

Alcune caratteristiche:

- Lazy loading VS Eager Loading: se abbiamo una istanza che al suo interno ha riferimenti ad istanze di altre tabelle, con Lazy gli oggetti vengono caricati solo quando servono, mentre con eager vengono caricati subito.
  - Questo è importante quando devi stampare il risultato di una query fuori dalla transazione che lo ha recuperato: con Lazy avrai solo i riferimenti agli altri oggetti ma non i loro dati, mentre con Eager avrai recuperato anche l'intero oggetto.
  - Eager è ovviamente più oneroso perchè effettua altre subquery per popolare gli oggetti complessi
- Query invisibili: non è sempre evidente quando il layer ORM effettua delle query per recuperare i dati, come descritto sopra
- Transazioni impicite: il layer ORM può gestire le transazioni e questo deve essere chiaro per non avere comportamenti anomali
- Utile usare ORM per le singole operazioni, mentre è solitamente inefficiente per le operazioni massive (bulk) dove è meglio usare SQL puro
- ORM solitamente protegge dalla SQL Injection

## Database Non Relazionale

Si basano sulla flessibilità data dal fatto di non avere una struttura rigida. Vengono chiamati **NoSQL** che sta per Not Only SQL, infatti alcuni possono usare una specie di linguaggio SQL per manipolare i documenti.
I vantaggi sono:

- Alta scalabilità: possono essere scalati orizzontalmente con l'aumento del traffico
- Alta disponibilità: riescono a mantenere il funzionamento senza interruzioni
- Efficienti per i BigData: possono agevolmente memorizzare grandi moli di dati
- Rapidi da sviluppare: più semplici e meno strutturati dei relazionali
- Parition Tolerance: riescono a continuare a funzionare in un contesto distribuito anche se ci sono problemi di rete tra i nodi del cluster
- I dati sono eventually consistent, si basa sul principio CAP (Consistency, Availability, Partion Tolerance). Avendo una alta Availability e Partition Tolerance, no può avere una alta Consistency

I vari tipi:

- **Chiave-Valore**: è il tipo più semplice, dove i dati sono una coppia chiave univoca e valore (genericamente una stringa/numero/json/binario)
  - Limitazioni: non si può filtrare sui valori ed è ottimizzato per avere un singolo valore che è un oggetto indivisibile, quindi se lo volessi modificare lo devi recuperare, modificare e riassegnare
  - Raccomandato: per la cache o real time access
  - Es: **Redis**, Amazon DynamoDB, Riak
  - Utilizzo: abbastanza usati ma sempre in supporto ad altri database
- **Documentali**: gestiscono i dati come document con un contenuto JSON, BSON (in MongoDB, è un Binary JSON-like), XML.
  - Vantaggi: Il documento contiene dati gerarchici e dimensioni variabili e non ha nessuno schema. Si possono modificare pezzi del documento facilmente. I dati sono tutti dentro il documento stesso e non è necessario usare referenze esterne per ottenere altri dati relativi.
  - Limiti: I documenti non hanno referenze e questo può portare a inconsistenza se due documenti hanno campi diversi. Inoltre non garantisce l'atomicità della transazione quando uno stesso dato è da mettere su documenti diversi perchè si eseguono 2 query separate.
  - Raccomandato: quando il data schema non è fisso, ma cambia costantemente
  - Es: **MongoDB**, ElasticSearch, Apache CouchDB, Amazon DocumentDB
  - Utilizzo: molto utilizzati
- **Colonne**: organizzano i dati a righe e colonne, dove le colonne sono raggruppate in famiglie e ogni riga può avere colonne diverse. L'idea è come un database relazionale ma non ci sono relazioni tra tabelle (niente JOIN). Rilassando questo vincolo si può rendere più performarti le query ed adattarle a sistemi distribuiti
  - Raccomandato: letture massive e aggregazione di dati (ma senza cancellazioni e modifiche), eventualmente anche per tenere traccia di eventi e poi farci analisi sopra (analogo anche ai TimeSeries DB)
  - Limiti: meno intuitivo per operazioni CRUD tradizionali (Update riscrive il dato, Delete non cancella ma marca come cancellato e da rimuovere, si usa raramente) e l'applicazione deve essere progettata per gestire questa modalità
  - Es: **Apache Cassandra**, Apache HBase, ScyllaDB
  - Utilizzo: poco frequente e in ambiti specifici di tipo distribuito ad alta scrittura
- **Grafi**: utilizzano strutture a grafo con node, edge, e properties per memorizzare i dati creando delle relazioni. Un node è un dato e ogni nodo ha un incoming e outcoming edge dove gli edge sono le relazioni tra nodi. Sia i nodi che gli edge possono avere delle proprietà. Puoi creare reti multidimensionali dove gli archi hanno proprietà diverse e rappresentano legami differenti tra i nodi (tipo legami di Amicizia e di Lavoro)
  - Limiti: non c'è un liguaggio standard per farci le query ed è concettualmente particolare da capire e navigare
  - Raccomandato: in contesti un cui la relazione tra i data è importante, come i collegamenti tra utenti in un social network o recommendation engine
  - Es: **Neo4J**, Amazon Neptune, OrientDB
  - Utilizzo: di nicchia e specifico per casistiche che sono chiaramente rappresentabili da un grafo
