# Graphs

- [Graphs](#graphs)
  - [Descrizione](#descrizione)
  - [Tipi di grafi](#tipi-di-grafi)
  - [Rappresentazione dei grafi](#rappresentazione-dei-grafi)
  - [Traversal](#traversal)
  - [Verifica di un ciclo nel grafo](#verifica-di-un-ciclo-nel-grafo)
  - [Percorso più breve in un grafo](#percorso-più-breve-in-un-grafo)
  - [Algoritmo Dijkstra](#algoritmo-dijkstra)
    - [Complessità Computazionale](#complessità-computazionale)
  - [Algoritmo Bellman-Ford](#algoritmo-bellman-ford)

## Descrizione

Sono una struttura dati composta da un insieme di vertici "v" che possono essere connessi a da 0..v vertici.

La rappresentazione di un grafo è dato da una matrice quadrata VxV in cui sia in altezza che in lunghezza sono rappresentati i vertici e i numeri nella matrice rappresentano le connessioni tra i vertici col loro peso.

## Tipi di grafi

- **Pesati/Wieghted**: sugli archi che connettono i vertici del grafo sono definiti dei numeri (potenzalmente sia positivi che negativi), che rappresentano il peso del percorso da un vertice all'altro
- **Connesso/Connected**: tutti i vertici sono connessi tra di loro tramite archi, senza creare insiemi disgiungi irraggiungibili
- **Direzionati/directed**: se un arco porta solo in una direzioni da un vertice ad un altro, altrimenti non direzionati/undirected se il percorso è bidirezionale
- **Ciclici/cyclic**:
  - Per i grafi direzionali, sono ciclici i grafi in cui puoi ritornare su un vertice già visitato
  - Per i grafi non direzionali, sono ciclici i grafi in cui puoi ritornare su un vertice già visitato senza utilizzare lo stesso arco
- **Loop**: quando un arco porta dal un vertice direttamente a se stesso

## Rappresentazione dei grafi

I grafi sono matrici VxV chiamata **Matrice di Adiacenza** con le seguenti caratteristiche:

- dove non è presente un arco, il valore è 0
- per i grafi non pesati, gli archi hanno valore 1
- per i grafi non direzionati, la matrice risulterà simmetrica rispetto la diagonale "V"-"V"

Raramente si può rappresentare un grafo come una **Lista di adiacenza**. Questa è utile in casi con molti vertici e pochi archi

## Traversal

L'operazione traverse non è cosi intuitiva per i grafi, in quanto non hanno un inizio o una fine. Generalmente l'operazione di traverse ha lo scopo di raggiungere tutti i vertici, utilizzando gli archi che li connettono, partendo da uno specifico vertice.

Ci sono due tipi di traverse:

- **Depth First Search Traversal (DFS)**: si crea una funzione ricorsiva a cui si passa un vertice e partendo dall'arco con peso minore, si richiama se stessa finchè ci sono vertici non ancora visitati disponibili
  - Questo tipo di ricerca entra in ogni vertice prima di analizzare gli altri vertici collegati al vertice corrente. La struttura dati che concettualmente si usa è una stack in cui le funzioni ricorsive sono come delle azioni che vengono messe dentro alla stack e quando si eseguono, si parte dall'ultimo a ritroso per poi aggiungere nuove azioni alla stack,
- **Breadth First Search Traversal (BFS)**: si crea una coda in cui si mettono tutti i vertici connessi al vertice corrente non ancora inseriti, poi si fa dequeue() per prendere il vertice successivo e aggiungere nuovi vertici. Si continua fino a che ci sono vertici nella queue

## Verifica di un ciclo nel grafo

Un ciclo è un qualsiasi sotto insieme di vertici che sono connessi uno all'altro creando un percoso che si ripete.
Si può algoritmicamente individuare se sono presenti dei cicli nel grafo utilizzando:

- una variante del DFS in cui si verifica se il vertice era stato già precedentemente visitato
- **Union-Find** che permette di creare insiemi di nodi e aggiungerne all'insieme che si sta creano, se si prova ad aggiungere un nodo che è presente, allora c'è un ciclo

## Percorso più breve in un grafo

Il percorso più breve è l'insieme di vertici e relativi archi coi loro pesi, partendo da un vertice di partenza verso gli altri vertici o un vertice specifico.

## Algoritmo Dijkstra

Questo algoritmo permette di trovare il percorso più breve per i **grafi con archi con pesi positivi**.

Sostanzialmente l'algoritmo si svolge in questo modo:

- Si crea un array di vertici a cui assegneremo di volta in volta la loro distanza dal vertice di partenza. Inizializzato a tutti infinito, tranne il vertice di partenza che sarà 0
- Partendo da un vertice, si guardano i vertici adiacenti e su quei vertici si mettere il peso dell'arco che porta dal vertice corrente a loro, se e solo se questo valore è minore del valore corrente su quel vertice
- Si prosegue prendendo il vertice non visitato con valore più piccolo e si prosegue fino a che è possibile, perchè potrebbero esserci vertici non raggiungibili

Tramite una variante di questo algoritmo, si può anche determinare il percorso più breve da un vertice di partenza ad uno di destinazione, memorizzandosi tutto il percorso.

### Complessità Computazionale

$O(V^2)$

## Algoritmo Bellman-Ford

Questo algoritmo si può applicare ai grafi direzionati con anche valori negativi. Si può utilizzare anche per i grafi non direzionati ma con solo valori positivi.
