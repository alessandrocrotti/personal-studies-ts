# Hash Tables

Le hash table risolvono il problema che Array e Linked List hanno O(n) per trovare l'elemento, inserirlo e rimuoverlo.
Utilizzando le hash table la complessità tende a O(1) anche se teoricamente nel worst case è sempre o(n)
**IMPORTANTE**: nelle hash table non sono permessi valori duplicati. Questo perchè è una struttura ottimizzata per la ricerca e avere valori duplicati renderebbe più lenta questa operazione.

## Documentazione ufficiale

Per una documentazione più dettagliata, fare riferimento a [W3CSchool](https://www.w3schools.com/dsa/dsa_theory_hashtables.php)

## Funzione di hash e buckets

Lo scopo è crearsi una tabella (array di array) di dimensione "x" su cui distribuire gli "n" valori da inserire.

La funzione di hash serve a trasformare il valore da inserire in un numero a cui si applica Modulo "x": facendo modulo della dimensione della tabella di hash, si ottiene un valore da 0 a x-1.
**IMPORTANTE**:Questa funzione deve sempre ritornare lo stesso numero dato lo stesso input.

Ad ogni indice della tabella di hash è presente un array, chiamato bucket. Quando si aggiunge/rimuove/cerca un elemento, tramite la funzione di hash si riesce ad accedere istantaneamente al bucket, dentro cui si farà una normale operazione sull'array per aggiungere/rimuover/cercare.

## Ottimizzazione del hash table

Ovviamente nei vari linguaggi queste strutture sono già definite con le relative **funzioni di hash ottimizzate per distribuire equamente i valori nei bucket**, ma la logica è che si deve bilancare la dimensione della tabella di hash rispetto al numero di elementi.

- se si ha una dimensione "x" molto maggiore degli "n" elementi, la tabella occuperà tanta memoria inutilmente
- se si ha una dimensione "x" molto minore degli "n" elementi, ci saranno molti elementi in pochi bucket aumentando la complessità computazionale

## Implemntazioni del hash table: hash set e hash map

- HashSet: la funzione di hash si applica al valore stesso delle elemento inserito nel bucket
- HashMap: la funzione di hash si applica alla chiave di una coppia chiave-valore che viene inserita nel bucket
