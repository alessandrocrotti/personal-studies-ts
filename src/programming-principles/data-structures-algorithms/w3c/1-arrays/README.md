# Array

- [Array](#array)
  - [Descrizione](#descrizione)
    - [Complessità Computazionale](#complessità-computazionale)
  - [Documentazione ufficiale](#documentazione-ufficiale)
  - [Algoritmi di Sort](#algoritmi-di-sort)
    - [Bubble Sort](#bubble-sort)
      - [Complessità Computazionale](#complessità-computazionale-1)
    - [Selection Sort](#selection-sort)
      - [Complessità Computazionale](#complessità-computazionale-2)
    - [Insertion Sort](#insertion-sort)
      - [Complessità Computazionale](#complessità-computazionale-3)
    - [Quick Sort](#quick-sort)
      - [Complessità Computazionale](#complessità-computazionale-4)
    - [Counting Sort](#counting-sort)
      - [Complessità Computazionale](#complessità-computazionale-5)
    - [Radix Sort](#radix-sort)
      - [Complessità Computazionale](#complessità-computazionale-6)
    - [Merge Sort](#merge-sort)
      - [Complessità Computazionale](#complessità-computazionale-7)
  - [Algoritmi di Search](#algoritmi-di-search)
    - [Linear Search](#linear-search)
    - [Binary Search](#binary-search)

## Descrizione

Gli array sono strutture dati composte da una lista ordinata di elementi, questa lista ha una lunghezza definita o dinamica.
Le operazioni di insert e remove sono complesse perchè richiedono lo shifting degli elementi. Quindi l'aggiunta e la rimozione alla fine dell'array rende meno onerosa l'operazione.
Per questa ragione, i seguenti algoritmi che operano sugli array evitano lo shifting e al più fanno lo swap, cioè lo scambio di elementi all'interno dell'array

### Complessità Computazionale

<table>
  <tr>
    <th>Get</th>
    <td>$O(1)$</td>
  </tr>
  <tr>
    <th>Insert/Delete</th>
    <td>$O(n)$</td>
    <td>Nei linguaggi in cui si usano array a dimensione dinamica, generalmente inserire o cancellare l'elemento in ultima posizione può essere considerato O(1) "ammortizzato" (cioè che potrebbe dover richiedere ogni tanto un riallocamento di memoria, ma non ad ogni operazione e solo quella in cui si rialloca la memoria sarebbe più onerosa, quindi si ammortizza con le altre operazioni)</td>
  </tr>
</table>

## Documentazione ufficiale

Per una documentazione più dettagliata, fare riferimento a [W3CSchool](https://www.w3schools.com/dsa/dsa_data_arrays.php)

## Algoritmi di Sort

### Bubble Sort

Si controllano gli elementi a coppie, prendendo l'indice corrente e il suo successivo. Se il corrente è maggiore, fai lo swap e inverti gli elementi. Si compie con un ciclo innestato "i" e "j" dove "j < n-i-1" perchè tutti gli elementi che ad ogni iterazioni di "i" porti in fondo, sono già ordinati e non devono essere controllati nuovamente. L'algoritmo internamente utilizza solo l'indice "j" e "j+1", mentre l'indice "i" serve solo per ripetere dall'inizio l'algoritmo fatto dall'indice "j".
Inoltre, se ad una iterazione non hai compiuto alcuno swap, significa che anche i rimanenti elementi dell'array sono già ordinati e non serve proseguire.

#### Complessità Computazionale

<table>
  <tr>
    <th>Operations</th>
    <td>$(n - 1) \cdot \frac{n}{2}$</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>$O(n^2)$</td>
  </tr>
</table>

### Selection Sort

Scorri l'iteratore alla ricerca del valore minimo e quando lo trovi, fai lo swap con l'indice del primo elemento non controllato e incrementi il contatore dei valori controllati. In questo modo porti all'inizio quelli controllati e riduci ad ogni iterazione gli elementi da controllare.

#### Complessità Computazionale

<table>
  <tr>
    <th>Operations</th>
    <td>$(n - 1) \cdot \frac{n}{2} + (n - 1)$</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>$O(n^2)$</td>
  </tr>
</table>

### Insertion Sort

Consideri il tuo array come un insieme teorico di 2 sub array: "ordinati" e "da ordinare" (questa divisione dipende solo dall'indice dell'iteratore che distingue la parte iniziale degli "ordinati" da quella finale degli "da ordinare", iniziando da "i=1", così che negli "ordinati" c'è già un elemento).
Tieni da parte il valore di "i", che è sempre il primo degli "da ordinare". Ora fai un loop su "j" a ritroso degli "ordinati", parti dall'ultimo e confronti se è più grande del valore che stai controllando: se è più grande, sovrascrivi il valore di "j+1" col valore di "j" e tieni l'indice "j" come "insertIndex". Questo passaggio è importante: temporaneamente l'array non conterrà più il valore da controllare, mentre ci sarà un valore duplicato.
Quando la condizione non è più vera, il ciclo si interrompe e, fuori dal ciclo, si assegnerà nella posizione "insertIndex" il valore tenuto da parte. Questo approccio è fondamentale per evitare degli shifting.
Logicamente, si può spiegare più facilmente dicendo che, si fa un loop per prendere il primo elemento "da ordinare" e lo si sposta dentro a quelli "ordinati" facendo degli swap sequenziali a partire dall'ultimo degli ordinati fino a che non arriva in posizione.

#### Complessità Computazionale

<table>
  <tr>
    <th>Operations</th>
    <td>$(n - 1) \cdot \frac{n}{2}$</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>$O(n^2)$</td>
  </tr>
</table>

### Quick Sort

Si basa su una funzione ricorsiva che prende un valore "pivot" (per esempio l'ultimo dell'array selezionato) con lo scopo di mettere tale valore nella posizione corretta all'interno dell'array. Questo significa che alla fine dell'iterazione, tutti i valori più piccoli del "pivot" saranno a sinistra e tutti i valori più grandi del "pivot" saranno alla sua destra.
Poi si seleziona applica la stessa logica ai 2 sotto array che si vengono a formare a destra e a sinistra del pivot. Facendo questo in maniera ricorsiva, si ordina l'intero array.
L'algoritmo si divide in 2 metodi:

- **SORT**: il metodo di "sort" riceve l'array e i valori "low" e "high" che indicano gli indici da cui partire e a cui arrivare (il sottoarray) per applicare il metodo "partition". Una volta ordinato il "pivot" attraverso il "partition", si richiama ricorsivamente settando come "low" e "high" la parte di quel sottoarray prima (low, pivot-1) e dopo (pivot+1, high) del pivot. Se "low" non è minore di "high", si interrompe la ricorsione.
- **PARTITION**: la funzione "partition" riceve l'array, "low" e "high", quindi seleziona un pivot (ad esempio l'ultimo elemento del sottoarray, cioè "high") e cerca di posizionarlo nell'indice corretto all'interno di quel sottoarray. Lo fa con l'indice "i" (partendo da "low-1") che rappresenta dove sono i numeri più piccoli del pivot e un loop su "j", che scorre il sottoarray, che ogni volta che trova un numero più piccolo del pivot, incrementa "i" e fa swap dell'elemento trovato "j" mettendolo in posizione "i". La logica è "ho trovato uno più piccolo, quindi avanzo l'indice dei più piccoli e ci metto j". Alla fine del loop faccio swap del "pivot" con "i+1", cioè la posizione appena dopo il suo l'elemento più piccolo

#### Complessità Computazionale

Questo algoritmo ha la stessa complessità degli altri algoritmi per il worse case, in cui tutti gli elementi sono ordinati nel verso opposto, ma per un average case in cui sono ordinati casualmente, è più veloce e quindi migliore.

<table>
  <tr>
    <th>Operations</th>
    <td>$n \cdot \frac{n}{2}$</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>$O(n^2)$</td>
  </tr>
  <tr>
    <th>Average Case</th>
    <td>$O(n \cdot \log_2 n)$</td>
  </tr>
</table>

### Counting Sort

**IMPORTANTE**: applicabile solamente ad array di valori interi positivi e non troppo alti.

Lo scopo è quello scorrere l'array originale e incrementare di 1 l'elemento del countingArray con indice==valore del elemento che sto valutando nell'array originale. Dopodichè si scorre il countingArray per ricostruire l'array originale ordinato.

Si prende il valore massimo dell'array e crea il countingArray con dimensione (max+1) e valori 0 in ogni elemento. Si fa pop() dall'array originale fino a che non è vuoto, per incrementare il countingArray. Si scorre il countingArray e si fa push() nell'array originale del valore dell'indice per un numero di volte pari al valore dell'elemento nel countingArray,

#### Complessità Computazionale

Dipende molto quando è grande il valore più alto "k" rispetto ad "n".

<table>
  <tr>
    <th>Operations</th>
    <td>$n \cdot k$</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>$O(n^2)$</td>
    <td>Se k è molto maggiore di n, può anche essere peggio</td>
  </tr>
  <tr>
    <th>Best Case</th>
    <td>$O(n)$</td>
    <td>Se k è una frazione di n</td>
  </tr>
</table>

### Radix Sort

**IMPORTANTE**: applicabile solamente ad array di valori interi positivi

Si crea un radixArray di 10 array. Questi 10 array raccolgono gli elementi che corrispondono ad una certa cifra.
Si calcola il valore massimo dell'array Math.max() per avere una condizione di stop.
Si itera sull'array originale, spostando ogni valore nel radixArray valutandone il valore della sua cifra "unità". Si fa pop() dall'array originale e push() nell'arrayRadix. Una volta popolato il radixArray, si itera sul arrayRadix e si fa pop() dei valori e push() nell'array originale. Questo avrà ordinato gli elementi per "unità". Si prosegue con la successiva cifra ("decine", "centinaia"...) fino a che non si supera il numero di cifre del max.
Si sfrutta il modulo 10 per avere l'unità; per avere la decina si fa valore/10 e si tiene la parte intera e poi si fa modulo 10, e così via.

**FONDAMENTALE**: si deve utilizzare di uno Stable Algorithm quando si mettono i valori nel radixArray e poi si riportano nel array originale. Questo significa che viene mantenuto l'ordinamento fatto negli step precedenti anche in quelli successivi (quando ordino per decine, devo mantenere l'ordinamento fatto precedentemente tramite unità). Per questo motivo si usa pop() e push()

#### Complessità Computazionale

"k" è il numero di cifre del valore max. L'average case è una approssimazione considerando "k" relativamente più piccolo di "n". Per valori di "k" molto più piccoli di "n", l'algoritmo è particolarmente performante, potenzialmente il più veloce.

<table>
  <tr>
    <th>Operations</th>
    <td>$2 \cdot n \cdot k$</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>$O(n \cdot k)$</td>
  </tr>
  <tr>
    <th>Average Case</th>
    <td>$O(n \cdot \log n)$</td>
  </tr>
</table>

### Merge Sort

Questo algoritmo, è diviso in due parti:

- **Splitting**: si divide in maniera ricorsiva l'array in 2 array più piccoli, prendendo l'indice a metà. Poi si ripete per il sotto array di destra e sinistra, fino ad ottenere array di dimesione 1
- **Merge**: prende 2 array precedentemente splittati (left e right) e confronta i valori. Scorrendo entrambi da sinistra a destra, confronta i valori dei due, rimuove il valore più basso dal relativo sotto array e lo usa per popolare un array risultante che in questo modo sarà ordinato.

#### Complessità Computazionale

<table>
  <tr>
    <th>All Cases</th>
    <td>$O(n \cdot \log n)$</td>
  </tr>
</table>

## Algoritmi di Search

### Linear Search

Classica ricerca scorrendo l'array fino a che non trovi un elemento col valore che cercavi e ne ritorni l'indice, se non lo trovi ritorni -1

<table>
  <tr>
    <th>Worst Cases</th>
    <td>$O(n)$</td>
  </tr>
</table>

### Binary Search

**IMPORTANTE**: si può applicare solamente con array ordinati

Confronti l'elemento a metà dell'array con l'elemento cercato: se quello che cerchi è più piccolo, ripeti ricorsivamente nel sotto array a sinistra dell'elemento scelto, altrimenti nel sotto array a destra.

<table>
  <tr>
    <th>Worst Cases</th>
    <td>$O(log_2 n)$</td>
  </tr>
</table>
