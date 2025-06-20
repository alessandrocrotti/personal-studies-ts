# Array

Gli array sono strutture dati composte da una lista ordinata di elementi, questa lista ha una lunghezza definita o dinamica.
Le operazioni di insert e remove sono complesse perchè richiedono lo shifting degli elementi. Quindi l'aggiunta e la rimozione alla fine dell'array rende meno onerosa l'operazione.
Per questa ragione, i seguenti algoritmi che operano sugli array evitano lo shifting e al più fanno lo swap, cioè lo scambio di elementi all'interno dell'array

### Complessità Computazionale

<table>
  <tr>
    <th>Get</th>
    <td>O(1)</td>
  </tr>
  <tr>
    <th>Insert/Delete</th>
    <td>O(n)</td>
    <td>Nei linguaggi in cui si usano array a dimensione dinamica, generalmente inserire o cancellare l'elemento in ultima posizione può essere considerato O(1) "ammortizzato" (cioè che potrebbe dover richiedere ogni tanto un riallocamento di memoria, ma non ad ogni operazione e solo quella in cui si rialloca la memoria sarebbe più onerosa, quindi si ammortizza con le altre operazioni)</td>
  </tr>
</table>

## Documentazione ufficiale

Per una documentazione più dettagliata, fare riferimento a [W3CSchool](https://www.w3schools.com/dsa/dsa_data_arrays.php)

## Bubble Sort

Si controllano gli elementi a coppie, prendendo l'indice corrente e il suo successivo. Se il corrente è maggiore, fai lo swap e inverti gli elementi. Si compie con un ciclo innestato "i" e "j" dove "j < n-i-1", perchè tutti gli elementi che ad ogni iterazioni di "i" porti in fondo, sono già ordinati e non devono essere controllati nuovamente.
Inoltre, se ad una iterazione non hai compiuto alcuno swap, significa che anche i rimanenti elementi dell'array sono già ordinati e non serve proseguire.

### Complessità Computazionale

<table>
  <tr>
    <th>Operations</th>
    <td>(n-1)n/2</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>O(n^2)</td>
  </tr>
</table>

## Selection Sort

Scorri l'iteratore alla ricerca del valore minimo e quando lo trovi, fai lo swap con l'indice del primo elemento non controllato e incrementi il contatore dei valori controllati. In questo modo porti all'inizio quelli controllati e riduci ad ogni iterazione gli elementi da controllare.

### Complessità Computazionale

<table>
  <tr>
    <th>Operations</th>
    <td>n^2/2</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>O(n^2)</td>
  </tr>
</table>

## Insertion Sort

Consideri il tuo array come un insieme di 2 sub array: ordinati e da ordinare. Salvi il valore del primo dagli "da ordinare" e valuti se quell'elemento è minore del suo precedente. Considerato che tutti i suoi precedenti sono già ordinati, se è minore assegna il valore del minore al valore corrente e continui finche il suo valore non è maggiore o uguale del precedente. A quel punto assegni in quella posizione il valore che ti eri salvato, posizionandolo nel punto corretto della parte ordinata.

### Complessità Computazionale

<table>
  <tr>
    <th>Operations</th>
    <td>(n-1)n/2</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>O(n^2)</td>
  </tr>
</table>

# Quick Sort

Si basa su una funzione ricorsiva che prende un valore "pivot" (per esempio l'ultimo dell'array selezionato) con lo scopo si mettere tale valore nella posizione corretta all'interno dell'array. Questo significa che alla fine dell'iterazione, tutti i valori più piccoli del "pivot" saranno a sinistra e tutti i valori più grandi del "pivot" saranno alla sua destra.
Poi si seleziona applica la stessa logica ai 2 sotto array che si vengono a formare a destra e a sinistra del pivot. Facendo questo in maniera ricorsiva, si ordina l'intero array.

### Complessità Computazionale

Questo algoritmo ha la stessa complessità degli altri algoritmi per il worse case, in cui tutti gli elementi sono ordinati nel verso opposto, ma per un average case in cui sono ordinati casualmente, è più veloce e quindi migliore.

<table>
  <tr>
    <th>Operations</th>
    <td>n^2/2</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>O(n^2)</td>
  </tr>
  <tr>
    <th>Average Case</th>
    <td>O(nLog2n)</td>
  </tr>
</table>

# Counting Sort

**IMPORTANTE**: applicabile solamente ad array di valori interi positivi e non troppo alti.

Lo scopo è quello scorrere l'array originale e incrementare di 1 l'elemento del countingArray con indice==valore del elemento che sto valutando nell'array originale. Dopodichè si scorre il countingArray per ricostruire l'array originale ordinato.

Si prende il valore massimo dell'array e crea il countingArray con dimensione (max+1) e valori 0 in ogni elemento. Si fa pop() dall'array originale fino a che non è vuoto, per incrementare il countingArray. Si scorre il countingArray e si fa push() nell'array originale del valore dell'indice per un numero di volte pari al valore dell'elemento nel countingArray,

### Complessità Computazionale

Dipende molto quando è grande il valore più alto "k" rispetto ad "n".

<table>
  <tr>
    <th>Operations</th>
    <td>n*k</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>O(n^2)</td>
    <td>Se k è molto maggiore di n, può anche essere peggio</td>
  </tr>
  <tr>
    <th>Best Case</th>
    <td>O(n)</td>
    <td>Se k è una frazione di n</td>
  </tr>
</table>

# Radix Sort

**IMPORTANTE**: applicabile solamente ad array di valori interi positivi

Si crea un radixArray di 10 array. Questi 10 array raccolgono gli elementi che corrispondono ad una certa cifra.
Si calcola il valore massimo dell'array Math.max() per avere una condizione di stop.
Si itera sull'array originale, spostando ogni valore nel radixArray valutandone il valore della sua cifra "unità". Si fa pop() dall'array originale e push() nell'arrayRadix. Una volta popolato il radixArray, si itera sul arrayRadix e si fa pop() dei valori e push() nell'array originale. Questo avrà ordinato gli elementi per "unità". Si prosegue con la successiva cifra ("decine", "centinaia"...) fino a che non si supera il numero di cifre del max.
Si sfrutta il modulo 10 per avere l'unità; per avere la decina si fa valore/10 e si tiene la parte intera e poi si fa modulo 10, e così via.

**FONDAMENTALE**: si deve utilizzare di uno Stable Algorithm quando si mettono i valori nel radixArray e poi si riportano nel array originale. Questo significa che viene mantenuto l'ordinamento fatto negli step precedenti anche in quelli successivi (quando ordino per decine, devo mantenere l'ordinamento fatto precedentemente tramite unità). Per questo motivo si usa pop() e push()

### Complessità Computazionale

"k" è il numero di cifre del valore max. L'average case è una approssimazione considerando "k" relativamente più piccolo di "n". Per valori di "k" molto più piccoli di "n", l'algoritmo è particolarmente performante, potenzialmente il più veloce.

<table>
  <tr>
    <th>Operations</th>
    <td>2*n*k</td>
  </tr>
  <tr>
    <th>Worse Case</th>
    <td>O(n*k)</td>
  </tr>
  <tr>
    <th>Average Case</th>
    <td>O(nLogn)</td>
  </tr>
</table>

# Merge Sort

Questo algoritmo, è diviso in due parti:

- Splitting: si divide in maniera ricorsiva l'array in 2 array più piccoli, prendendo l'indice a metà. Poi si ripete per il sotto array di destra e sinistra, fino ad ottenere array di dimesione 1
- Merge: prende 2 array precedentemente splittati (left e right) e confronta i valori. Scorrendo entrambi da sinistra a destra, confronta i valori dei due, rimuove il valore più basso dal relativo sotto array e lo usa per popolare un array risultante che in questo modo sarà ordinato.

### Complessità Computazionale

<table>
  <tr>
    <th>All Cases</th>
    <td>O(nLogn)</td>
  </tr>
</table>

# Linear Search

Classica ricerca scorrendo l'array fino a che non trovi un elemento col valore che cercavi e ne ritorni l'indice, se non lo trovi ritorni -1

<table>
  <tr>
    <th>Worst Cases</th>
    <td>O(n)</td>
  </tr>
</table>

# Binary Search

**IMPORTANTE**: si può applicare solamente con array ordinati

Confronti l'elemento a metà dell'array con l'elemento cercato: se quello che cerchi è più piccolo, ripeti ricorsivamente nel sotto array a sinistra dell'elemento scelto, altrimenti nel sotto array a destra.

<table>
  <tr>
    <th>Worst Cases</th>
    <td>O(nLog2n)</td>
  </tr>
</table>
