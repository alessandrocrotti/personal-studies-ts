# Trees

I Tree sono una struttura dati con una "root", dei nodi che hanno un parent e "n" children, dove solo "root" non ha parent e le "leaves" non hanno children.

## Documentazione ufficiale

Per una documentazione più dettagliata, fare riferimento a [W3CSchool](https://www.w3schools.com/dsa/dsa_theory_trees.php)

## Binary Tree

Il tipico tree è il BinaryTree dove ogni nodo ha da 0 a 2 nodi.

L'albero può avere queste caratteristiche:

- **bilanciato/balanced**: per ogni nodo, la differenza di altezza tra il ramo destro è sinistro è al massimo 1
- **completo/completed**: ogni livello dell'albero contiene tutti i nodi possibili, a parte l'ultimo livello
- **pieno/full**: ogni nodo ha 0 oppure 2 children
- **perfetto/perfect**: se ha tutte e tre le caratteristiche precedenti

### Struttura dati

Solitamente la struttura dati utilizzata è la linked list, ma si possono usare anche gli array nel caso si necessiti di risparmiare memoria e di fare ricerche senza operazioni insert/delete.
Sapendo che ogni nodo ha fino a 2 childern, si può fare un array [R, L1, R1, L1L2, L1R2, R1L2, R1L2,...]. Permette di accedere tramite l'indice, ma non è la scelta più comoda.

### Traversal

Al contrario delle linked list o degli array, l'operazione traverse che scorre il Tree può essere effettuata con diverse regole. In tutti i casi si usa una logica ricursiva verificando prima il ramo sinistro e poi il ramo destro. A seconda del punto in cui si sceglie si "estrarre" il valore del nodo, si ottengono

- **pre-order**: si estrae il valore prima di chiamare la ricorsione del lato sinistro e destro
  - risulta un elenco di nodi che parte dalla root e scorre il lato sinistro per risalire e fare il destro
- **in-order**: si estrae il valore dopo aver chiamato la ricorsione del lato sinistro, ma prima del lato destro
  - risulta un elenco partendo dal dalla foglia più a sinistra e risalendo da sinistra
  - molto utilie per ordinare in modo crescente il Binary Search Tree
- **post-order**: si estrae il valore dopo aver chiamato sia la ricorsione del lato sinistro e che destro
  - risulta un elenco che prende prima le foglie e poi risale verso la radice
  - per questa ragione si usa per cancellare un tree

## Binary Search Tree

Il BST è un particolare tipo di Binary Tree dove, per ogni nodo, il valore del left child è minore del valore del nodo e il valore del nodo è minore del valore del right child:

- root = 10
  - left child = 5
  - right child = 13

### Complessità computazionale

Questo tipo di struttura avvantaggia le search, delete, insert senza dover fare shifting. Il vantaggio aumenta se il BST è "bilanciato"; nel caso fosse sbilanciato, la complessità computazionale peggiora:

- Bilanciato: O(logn) (come una binary search per gli array)
- Sbilanciato: O(n) (come una linear search per gli array)

Inoltre il vantaggio è che per insert e delete non c'è shifting

<table>
  <tr>
    <th>Data Structure</th>
    <th>Searching for a value</th>
    <th>Delete / Insert leads to shifting in memory</th>
  </tr>
  <tr>
    <td>Sorted Array</td>
    <td>O(logn)</td>
    <td>Yes</td>
  </tr>
  <tr>
    <td>Linked List</td>
    <td>O(n)</td>
    <td>No</td>
  </tr>
  <tr>
    <td>(Balanced) Binary Search Tree</td>
    <td>O(logn)</td>
    <td>No</td>
  </tr>
</table>

## AVL Tree

Si tratta di un particolare tipo di BST autobilanciante. Visto che essere bilanciato è fondamentale per le performance, è stata creata una struttura dati che permette, all'inserimento o rimozione di un nodo, di riposizionare i nodi rimanenti in modo che resti un BTS e sia bilanciato.

Queste operazioni di bilanciamento si chiamano **rotazioni** ed entrano in azione quando il Balance Factor è maggiore di 1 o minore di -1

- **Balance Factor**: la differenza tra l'altezza del ramo destro e quello sinistro
  - 0: i nodi sono bilanciati e hanno la stessa altezza
  - \>0: i nodi a destra sono più lunghi di quelli a sinistra
  - <0: i nodi a sinistra sono più lunghi di quelli a destra

Le operazioni di ribilanciamento sono fondamentalmente 4:

- Left-Left
- Right-Right
- Left-Right
- Right-Left

IMPORTANTE: a basso livello è piuttosto complesso e non vale la pena focalizzarsi oltre
