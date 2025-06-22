# Linked Lists

Una linked list è una lista di nodi con un valore e un puntamento al nodo successivo. Ogni linked list ha una "head", cioè il nodo di partenza da cui si eseguono gli algoritmi, ma non è strettamente il primo della lista. Per esempio in una stack è l'ultimo elemento.
Ogni linked list è una struttura dati da definire per ogni linguaggio, al contrario degli array che sono predefiniti in ogni linguaggio.

## Documentazione ufficiale

Per una documentazione più dettagliata, fare riferimento a [W3CSchool](https://www.w3schools.com/dsa/dsa_theory_linkedlists.php)

## Differenza Linked List - Array

### Gestione della memoria

L'array occupa una sezione di memoria continua per ogni valore contenuto nell'array. Al contrario, gli elementi contenuti nell'array occupano spazi casuali nella memoria, ma al contrario dell'array ogni elemento occupa più memoria, in quanto deve contenere il dato e il puntamento al nodo successivo.

### Operazioni

Proprio per la differente gestione della memoria, le operazioni hanno complessità computazionali differenti:

- SEARCH/TRAVERSE: scorrere l'array dal primo all'ultimo elemento. La complessità è analoga, ma è eseguita in maniera differente. Con l'array si scorre l'indice, con la linked list si salta da un nodo all'altro partendo da head e chiamando il next
- GET: recuperare un elemento per indice è istantaneo per l'array, visto che è facilmente recuperabile quell'area di memoria, mentre per la linked list richiede l'operazione di traverse per raggiungere quell'indice
- INSERT/DELETE: inserire/cancellazione un valore all'interno di un array richiede un riallocamento di tutte le sezioni della memoria in cui sono stati memorizzati i valori seguenti alla posizione di insrimento/cancellazione, quindi è molto onerosa. La linked list, se si ha già accesso al nodo nella posizione precedente al nodo che si vuole inserire/cancellare, è istantaneo perchè basta cambiare i puntamenti del nodo precedente e successivo

## Tipi di linked list

- SINGLY LINKED LIST: Quella base con un link "next" al nodo successivo
- DOUBLY LINKED LIST: Un link "next" al nodo successivo e un link "prev" al nodo precedente
- CIRCULAR LINKED LIST: può essere applicata ad entrambi i nodi precedenti, il nodo finale ha un puntamento al nodo "head" (e viceversa nella doubly)

## Algoritmi di ordinamento e ricerca

Gli algoritmi di ordinamento e ricerca possono essere applicati anche alle Linked List, ma potrebbero essere un po' più complessi da scrivere. Sono esclusi tutti gli algoritmi che necessitano di accedere agli elementi per posizione, come il Binary Sort che prende ogni volta l'elemento a metà della lista: questa operazione è molto onerosa e non ha senso nel contesto delle linked list.
