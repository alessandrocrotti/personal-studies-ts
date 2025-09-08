# Database

- [Database](#database)
  - [Descrizione](#descrizione)
  - [Database Relazionale](#database-relazionale)
    - [Lock](#lock)
    - [JOIN](#join)
    - [Schema ER](#schema-er)
    - [ORM](#orm)
  - [Database Non Relazionale](#database-non-relazionale)
  - [CAP Theorem](#cap-theorem)

## Descrizione

Il software del database è chiamato **DBMS** (Database Management System), da distinguere dal **Database schema** che è l'istanza di database all'interno DBMS.

- **Relazionale** / **SQL**: database strutturato in tabelle con relazioni
- **Non Relazionale** / **NoSQL**: più flessibile, non strutturato, contiene elementi come documenti, grafi, colonne o chiave valore

Ci sono poi altri tipi di database che non ricadono esattamente in queste 2 categorie:

- **Timeseries**: gestiscono i dati temporali, cioè associano dei valori di un dato ad un timestamp. Questo permette di creare delle metriche e dei grafici

## Database Relazionale

Si basa su tabelle, con record e colonne. Si possono interrogare tramite le Query e si possono aggiornare con modifiche, eliminazione o inserimento di nuovi record.

Descrizione:

- Usa il linguaggio SQL per eseguire le operazioni
- Esiste un Data Schema predefinito e fisso. Non si può modificare runtime, ma solamente da operazioni di "alterazione" che sono delicate
- La scalabilità è perlopiù verticale, per gestire maggiore traffico si deve aumentare la singola macchina/nodo aumentando CPU, RAM, SSD. Ci sono configurazioni orizzontali per i relazionali, ma sono complesse e non native.
- Difficile da usare con BigData visto che è solitamente scalabile solo verticalmente
- Le operazioni sul relazionale sono **ACID** (Atomicità, Consistenza, Isolamento Durata) quindi danno una garanzia della consistenza dei dati

Concetti fondamentali:

- I dati sono organizzati in tabelle (relazioni), composte da righe (tuple) e colonne (attributi)
- **Primary Key**: identifica una riga univocamente all'interno di una tabella
- **Foreign Key**: collega 2 tabelle creando una relazione tra colonne/attributi
- **Integrità Referenziale**: verifica e garantisce che i puntamenti tra Foreign Key puntino a record esistenti
- **Normalizzazione dei dati**: si applica allo scopo di ridurre la ridondanza e migliorare la coerenza e ha 3 regole:
  - **1 Forma Normale**: Ogni campo/colonna contiene valori atomici (niente liste), piuttosto si fanno più righe ognuna con un valore della lista -> Elimina i gruppi ripetuti
  - **2 Forma Normale**: Ogni attributo dipende dalla chiave primaria -> Elimina le dipendenze parziali, utile quando la chiave è composta da più attributi e un attributo dipende da una parte della chiave primaria
  - **3 Forma Normale**: Nessun attributo non chiave primaria dipende da un attributo non chiave primaria -> Elimina le dipendenze indirette, spostandole in altre tabelle

Concetti di performance:

- **Indici**: servono a trovare un record velocemente senza dover scorrere tutta la tabella, migliorando le performance della SELECT, ma peggiorando la INSERT/UPDATE/DELETE, perchè richiederà di aggiornare l'indice:
  - Indice Primario: creato automaticamente sulla chiave primaria
  - Indice Unique: unicità del valore per una colonna
  - Indice composite: include più colonne insieme
  - Indice full-text: ottimizzato per la ricerca di un testo
  - Indice bitmap: utile in data warehouse quando hai colonne con pochi valori distinti
- **Transazioni**: un insieme di operazione SQL che vengono eseguite in un blocco unico, o COMMIT o ROLLBACK di tutte le operazioni
  - Mantengono la coerenza dei dati
- **Query plan/Execution plan**: esegue una query dettagliando ogni elemento che viene eseguito, l'ordine, gli indici usati, le operazioni fatte, il costo di ogni passaggio. Permette di avere informazioni su come ottimizzare quella query. Alcuni errori comuni:
  - Table Scan: non ci sono indici e devo scorrere tutta la tabella, lento se ci sono tanti record
  - Nested Loop: join tra tabelle. Se lento, può dipendere dalla mancanza di indici che quindi richiede di scorrere il prodotto cartesiano delle 2 tabelle in join
- **View**: è una query salvata che può essere richiamata agevolmente per essere rieseguita nuovamente. Non memorizza i dati, serve per semplificare query molto complesse usate spesso e può essere usata come fosse un TABLE nei JOIN/SELECT
- **Materialized View**: simile alla View, ma i dati risultanti vengono memorizzati, come fosse uno snapshot statico. Occupa spazio su dico, ma rende le query su di essa molto veloci. Puoi aggiornare i dati con un comando specifico (REFRESH MATERIALIZED VIEW) che riesegue la query originale
- **Backup**: permette di salvare una copia dei dati per essere ripristinata in caso di problemi. Solitamente vengono automatizzati secondo questi tipi:
  - **Full Backup**: copia completa (frequenza settimanale). Lento da ripristinare
  - **Differential Backup**: copia solo le modifiche rispetto all'ultimo full backup (frequenza giornaliera). Relativamente veloce da ripristinare ma occupa più spazio
  - **Incremental backup**: copia delle modifica dall'ultimo backup (full o differential) (molto frequente, orario). Relativamente lento da ripristinare, ma occupa meno spazio
  - **Transactional Log**: registro di tutte le operazioni eseguite sul database. (frequenza anche di 5/10 minuti). Leggero e puntale, permette di ripristinare nell'ordine dei minuti
- **Recovery**: le strategie di recovery solitamente puntano a:
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
- Optimistic lock: invece di effettuare un effettivo lock, utilizzo un contatore in una colonna specifica OCA (Optimistic Concurrency Attribute): leggo il valore di OCA, faccio le modifiche, verifico il contatore OCA abbia ancora lo stesso valore, incremento OCA. Se tra la lettura prima di modificare e dopo aver modificato l'OCA è cambiato, significa che qualcun altro ha fatto una modifica parallela e io devo fare ROLLBACK della mia transazione. Permette di non lockare i record accettando la possibilità di eccezioni
- Pessimistic lock: blocco direttamente per evitare conflitti

### JOIN

Sono il sistema con cui si mettono in realzione 2 tabelle attraverso degli attributi di ugualianza:

- **INNER JOIN**: mostra i record con corrispondenza in entrambe le tabelle
  - Quello più comune, detto anche JOIN, serve per cercare dati validi e corrispondenti
  - `FROM CLIENT c JOIN ORDINI o ON c.orderuuid = o.uuid` -> trova tutti i clienti con almeno un ordine
- **LEFT JOIN**: mostra tutte le righe della tabella di sinistra (FROM) anche se non c'è corrispondenza a destra, mettendo NULL i relativi dati
  - usato per trovare i dati mancanti
  - `FROM CLIENT c LEFT JOIN ORDINI o ON c.orderuuid = o.uuid` -> trova tutti i clienti e la parte degli ordini sarà NULL
- **RIGHT JOIN**: mostra tutte le righe della tabella di destra (JOIN) anche se non c'è corrispondenza a sinistra, mettendo NULL i relativi dati
  - meno utilizzato solitamente
  - `FROM CLIENT c RIGHT JOIN ORDINI o ON c.orderuuid = o.uuid` -> trova tutti i gli ordini, anche se non ci sono clienti, mettendo la parte dei clienti come NULL
- **FULL OUTER JOIN**: mostra tutte le righe di entrambe le tabelle e mette NULL dove non c'è corrispondenza
  - usato per avere comunque tutte le combinazioni senza escludere i buchi sia da una parte che dall'altra
  - `FROM CLIENT c FULL OUTER JOIN ORDINI o ON c.orderuuid = o.uuid` -> trova tutti i clienti e quelli che non hanno ordini avranno NULL nei campi ordine e per gli ordini che non hanno clienti le colonne clienti saranno NULL mentre i campi ordini popolato
- **CROSS JOIN**: prodotto cartesiano delle due tabelle
  - Raramente utilizzato, serve per creare delle combinazioni
  - crea semplicemente una tabella di tutte le combinazioni possibili di tutti i valori delle due tabelle in prodotto cartesiano
- **SELF JOIN**: join con la tabella stessa
  - JOIN come le altre ma con riferimento alla stessa tabella con un alias differente

![SQL DIAGRAM](https://i0.wp.com/www.puntogeek.com/wp-content/uploads/2013/05/BHVicYICMAAdHGv.jpg?w=966&ssl=1)

### Schema ER

Lo schema ER (Entity-Relationship Model) è uno schema grafico e concettuale del database. Dai dati progettuali, si crea lo schema ER che serve poi per creare l'effettivo DB.

Grazie a questo schema si mostrano graficamente:

- Entity: gli oggetti che vengono memorizzati a database (sono le tabelle)
  - Strong Entity: ha una chiave primaria univoca e indipendente dalle altre entity
  - Weak Entity: ha una relazione con una altra entity che la identifica e senza di essa non esisterebbe
- Attribute: le proprietà di una entity (sono le colonne)
  - Chiave: valorie univoco che identifica l'entity
  - Composite: un attributo che è rappresentato da altri sotto attributi
  - Multivalue: un attributo che può contenere una lista
  - Derived: un attributo che può essere derivato da altri attributi
- Relationship: sono le connessioni tra entity
  - Relazione Unary: mette in relazione l'entity con se stessa, quindi due istanze della stessa entity
  - Relazione Binary: mette in relazione due entity diverse
  - Relazione N-ary: quando ci sono più entity coinvolte
  - Relazione totale o parziale: totale ogni entità deve partecipare alla relazione, parziale alcune istanze possono non partecipare. La differenza è che la foreign key è NOT NULL per TOTALE. Si può applicare ai tutti i tipi di relazione
  - One to One: una istanza dell'entity A ha una associazione con una istanza della entity B (A1 -> B1, A2 -> B3, A3 -> B2, A4 senza relazione). Es: una persona ne sposa una e una sola altra
  - One to Many: una istanza dell'entity A ha una o più istanze associate all'entity B (A1 -> B1, A2 -> B2;B3, A3 -> B4, A4 senza relazione). Es: il dipartimento più avere associati vari medici, un dipartimento può non avere medici, ma tutti i medici possono essere assegnati ad un dipartimento
  - Many to One: varie istanze dell'entity A possono essere assegnate ad una istanza nell'entity B (A1;A2;A3 -> B1, A4 -> B3, B2 e B4 senza relazione:). Es: vari studenti possono essere iscritti ad un corso di laurea, anche lo stesso per studenti diversi. Alcuni corsi possono essere vuoti
  - Many to Many: varie istanze dell'entity A sono assegnati a varie istanze dell'entity B (A1 -> B1;B2;B3, A2 -> B1;B3, A3 -> B2;B3). Es. vari studenti possono iscriversi a vari Esami e vari esami hanno vari studenti.
    - Questa associazione viene trasformata in una tabella aggiuntiva che gestisce l'associazione. Es: tabella associativa Iscrizioni che raccoglie i match tra le foreign key studenteId e corsoId ed eventuali attributi dell'associazione

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
- I dati sono eventually consistent, si basa sul principio CAP (Consistency, Availability, Partion Tolerance). Avendo una alta Availability e Partition Tolerance, no può avere una alta Consistency. Possono altrimenti avere una alta Consistency, ma a discapito della Availability che ha come conseguenza l'interruzione momentanea dell'accesso al DB finchè la Partition non è risolta

I vari tipi:

- **Chiave-Valore**: è il tipo più semplice, dove i dati sono una coppia chiave univoca e valore (genericamente una stringa/numero/json/binario)
  - Limitazioni: non si può filtrare sui valori ed è ottimizzato per avere un singolo valore che è un oggetto indivisibile, quindi se lo volessi modificare lo devi recuperare, modificare e riassegnare
  - Raccomandato: per la cache o real time access
  - Es: **Redis**, Amazon DynamoDB, Riak
  - Utilizzo: abbastanza usati ma sempre in supporto ad altri database
- **Documentali**: gestiscono i dati come document con un contenuto JSON, BSON (in MongoDB, è un Binary JSON-like), XML.
  - Vantaggi: Il documento contiene dati gerarchici e dimensioni variabili e non ha nessuno schema. Si possono modificare pezzi del documento facilmente. I dati sono tutti dentro il documento stesso e non è necessario usare referenze esterne per ottenere altri dati relativi.
  - Limiti: I documenti non hanno referenze e questo può portare a inconsistenza se due documenti hanno campi diversi. Inoltre non garantisce l'atomicità della transazione quando uno stesso dato è da mettere su documenti diversi perchè si eseguono 2 query separate.
    - In realtà ci possono essere comunque referenze e transazioni in alcuni specifici NoSQL Documentali legare più documenti e per aprire transazioni che coinvolgono più documenti, ma questo va usato con parsimonia perchè va contro l'idea stessa di questo tipo di database
  - Raccomandato: quando il data schema non è fisso, ma cambia costantemente
  - Es: **MongoDB**, ElasticSearch, Apache CouchDB, Amazon DocumentDB
  - Utilizzo: molto utilizzati
- **Colonne Larghe**: organizzano i dati a righe e colonne, dove le colonne sono raggruppate in famiglie (che sarebbero come tabelle) e ogni riga dentro una famiglia può valorizzare colonne diverse (perchè non c'è uno schema rigido). Comunque le famiglie hanno una primary key e raggruppano concettualmente colonne che hanno uno scopo comune, non si crea una famiglia con dati caotici e colonne totalmente senza legami, piuttosto ci saranno famiglie dedicate. L'idea è come un database relazionale ma non ci sono relazioni tra tabelle (niente JOIN/Foreign Key) e le tabelle sono denormalizzate. Rilassando questo vincolo si può rendere più performarti le query con BigData ed adattarle a sistemi distribuiti tramite replication
  - Raccomandato: letture massive e aggregazione di dati (ma senza cancellazioni e modifiche anche se non c'è una limitazione reale a queste operazioni), eventualmente anche per tenere traccia di eventi e poi farci analisi sopra (analogo anche ai TimeSeries DB)
  - Limiti: meno intuitivo per operazioni CRUD tradizionali (Update riscrive il dato, Delete non cancella ma marca come cancellato e da rimuovere, si usa raramente) e l'applicazione deve essere progettata per gestire questa modalità
  - Es: **Apache Cassandra**, Apache HBase, ScyllaDB
  - Utilizzo: poco frequente e in ambiti specifici di tipo distribuito ad alta scrittura
- **Grafi**: utilizzano strutture a grafo con node, edge e properties per memorizzare i dati creando delle relazioni. Un node è un dato e ogni nodo ha un incoming e outcoming edge dove gli edge sono le relazioni tra nodi. Sia i nodi che gli edge possono avere delle proprietà. Puoi creare reti multidimensionali dove gli archi hanno proprietà diverse e rappresentano legami differenti tra i nodi (tipo legami di Amicizia e di Lavoro)
  - Limiti: non c'è un linguaggio standard per farci le query ed è concettualmente particolare da capire e navigare
  - Raccomandato: in contesti in cui la relazione tra i data è importante, come i collegamenti tra utenti in un social network o recommendation engine
  - Es: **Neo4J**, Amazon Neptune, OrientDB
  - Utilizzo: di nicchia e specifico per casistiche che sono chiaramente rappresentabili da un grafo

## CAP Theorem

**In un sistema distribuito su una rete di nodi in cui si memorizzano dei dati non si possono avere sia Consistency che Availability che Partition tolerance.**

- **Consistency**: significa che tutti gli utenti vedono gli stessi dati contemporaneamente, indipendentemente dal nodo a cui si connettono.
  - Si ottiene facendo in modo che ogni modifica sia replicata su ogni nodo prima di dichiararla riuscita
- **Availability**: significa che un cliente riesce ad ottenere una risposta da un nodo anche se altri nodi sono inattivi
  - Si ottiene facendo in modo che tutti i nodi possano dare una risposta valida per qualsiasi richiesta
- **Partition Tolerance**: una partizione è una interruzione delle comunicazioni in un sistema distribuito: una connessione persa o temporaneamente ritardata tra 2 nodi. Significa che il cluster deve continuare a funzionare anche se si interrompe la comunicazione tra i nodi
  - Non si può eliminare, è intriseca in un sistema distributito e l'unico modo per non averlo è non avere un sistema distribuito ma un singolo nodo

Potendone scegliere solo 2 su 3, si configurano questi 3 casi:

- **Database CP**: offre Consistency e Partition Tolerance, ma non Availability. Quando si verifica una partition tra due nodi, il sistema arresta il nodo non coerente (rendendolo non Available) finchè la partizione non è risolta
  - Obiettivo: si preferisce mostrare un errore piuttosto che dati non coerenti. Es. sistema di acquisto biglietti ferroviari.
  - **MongoDB** offre questa soluzione utilizzando il principio **Single-Master**. Esiste un nodo Primario dove vengono fatte le scritture, e ci sono N repliche Secondarie che replicano le operazioni di scrittura del Primario rimanendo sempre allineate. Di default anche le letture vengono fatte dal nodo Primario, ma si può configurare di leggere da i Secondari. Quando il nodo Primario diventa non disponibile, il nodo secondario col log di operazioni più recente diventa il primario e tutti gli altri i suoi secondari. Una volta terminato questa riconfigurazione, il database torna disponibile. Nel frangente non si possono effettuare più operazioni di scrittura.
- **Database AP**: offre Availability e Partition Tolerance, ma non Consistency. Quando si verifica una partizione, tutti i nodi sono Available, a quelli che non sono stati aggiornati a causa della partizione restituiranno un dato precedente. Quando la partizione viene risolta, si sincronizzano i dati e si riparano le incoerenze.
  - Obiettivo: si preferisce mostrare dati non coerenti piuttosto che un errore. Es. bacheca dei social network.
  - **Apache Cassandra** è un database a colonne senza un nodo master, tutti i nodi devono essere disponibili continuamente. Fornisce comunque una consistenza finale, permettendo scritture nei vari nodi ed effettuando una riconciliazione delle incongruenze il più rapidamente possibile. I dati diventano inconsistenti solo in caso si partizione di rete, che si risolve quando la partizione si risolve. Essendo sempre disponibile, ha alte prestazioni.
- **Database CA**: offre Consistency e Availability, ma non Partition Tolerance. Questo database non permette di essere distribuito su più nodi, visto che essere distribuito implicitamente porta alla possibilità di partizione.
  - Tipicamente i **database relazionali** offrono questa soluzione
