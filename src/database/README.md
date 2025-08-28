# Database

- [Database](#database)
  - [Descrizione](#descrizione)
  - [Database Relazionale](#database-relazionale)
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

## Database Non Relazionale

Si basano sulla flessibilità data dal fatto di non avere una struttura rigida. Vengon chiamati **NoSQL** che sta per Not Only SQL, infatti alcuni possono usare una specie di linguaggio SQL per manipolare i documenti.
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
