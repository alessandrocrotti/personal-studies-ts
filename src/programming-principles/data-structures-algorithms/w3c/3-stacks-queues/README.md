# Stacks and Queues

- [Stacks and Queues](#stacks-and-queues)
  - [Descrizione](#descrizione)
  - [Documentazione ufficiale](#documentazione-ufficiale)
  - [Stacks](#stacks)
  - [Queues](#queues)

## Descrizione

Queste strutture date, stack e queue, sono piuttosto simili, con alcune peculiarità. Entrambe possono essere gestite tramite array o linked list.

## Documentazione ufficiale

Per una documentazione più dettagliata, fare riferimento a [W3CSchool](https://www.w3schools.com/dsa/dsa_data_stacks.php).

## Stacks

Struttura dati di tipo **LIFO** con le seguenti operazioni:

- **Push**: aggiungere elemento (in fondo alla stack)
- **Pop**: rimuovere e ritornare l'elemento in fondo alla stack
- **Peek**: ritornare l'elemento in fondo alla stack senza rimuoverlo
- **isEmpty**
- **size**

Array vs linked list:

- **Array**:
  - Minor consumo di memoria, ma visto che gli array sarebbero a dimensione fissa, per gestire la dinamicità della dimensione è necessario che allochino più memoria in partenza (utilizzando le classi che il linguaggio già offre)
  - Più semlice da implementare
- **Linked List**:
  - Consumano più memoria, possono avere una dimensione dinamica senza gestioni particolari
  - Il codice risulta un po' più complesso da leggere e implementare

## Queues

Struttura dati di tipo **FIFO** con le seguenti operazioni:

- **enqueue**: aggiungere elemento (in fondo alla queue)
- **dequeue**: rimuovere e ritornare l'elemento all'inizio della queue
- **Peek**: ritornare l'elemento all'inizio della queue senza rimuoverlo
- **isEmpty**
- **size**

Array vs linked list:

- **Array**:
  - Minor consumo di memoria, ma visto che gli array sarebbero a dimensione fissa, per gestire la dinamicità della dimensione è necessario che allochino più memoria in partenza (utilizzando le classi che il linguaggio già offre)
  - L'operazione di dequeue causa lo shifting dell'array, che è oneroso per code molto lunghe
  - Più semlice da implementare
  - Alcuni linguaggi offrono classi già esistenti ottimizzate per le queue
- **Linked List**:
  - Consumano più memoria, possono avere una dimensione dinamica senza gestioni particolari
  - Non hanno problema di shifting
  - Il codice risulta un po' più complesso da leggere e implementare
