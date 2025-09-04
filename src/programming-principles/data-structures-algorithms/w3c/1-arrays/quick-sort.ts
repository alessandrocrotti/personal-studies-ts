/**
 * Get the pivot (as the "high" index) and move all greater elements on the right and the lower elements on the left,
 * then it puts in the right/sorted position the pivot in the array.
 * Eg.
 * starting array: ([12, 29, 3, -12, 45, 1, 321, 22])
 * pivot 22
 * final array ([12, 3, -12, 1, 22, 29, 321, 45]);
 * pivot is at index 4 and on its left there are all "lower than" elements and on the right "greater than" elements
 * @param array
 * @param low
 * @param high
 * @returns
 */
function partition(array: number[], low: number, high: number): number {
  console.log("partition", array, "low", low, "high", high);
  const pivot = array[high];
  // Indice degli elementi più piccoli del pivot
  let i = low;

  console.log("partition before for", "pivot", pivot, "i", i);

  // Scorriamo tutti gli elementi tranne il pivot (high)
  for (let j = low; j < high; j++) {
    console.log("partition in for", "i", i, "j", j, "array[j]", array[j], "Pivot", pivot);
    if (array[j] <= pivot) {
      // Se l'elemento corrente è più piccolo o uguale al pivot, scambialo con l'elemento all'indice i (anche se j e i sono uguali)
      console.log("partition", "i", i, "j", j);
      [array[i], array[j]] = [array[j], array[i]];
      // Incrementa l'indice degli elementi più piccoli del pivot per il prossimo elemento
      i++;
    }
    console.log("partition resulting arr", array);
  }

  // Scambia il pivot con l'elemento all'indice i, mettendo il pivot nella sua posizione corretta
  [array[i], array[high]] = [array[high], array[i]];
  console.log("partition final resulting arr", array);
  return i;
}

export function quickSortW3C(array: number[], low = 0, high = array.length - 1): number[] {
  if (low < high) {
    console.log("PARTITION CALL", array, low, high);
    const pivotIndex = partition(array, low, high);
    console.log("quickSortW3C 1 CALL", array, low, pivotIndex - 1);
    // sorting elements on the left of the pivot (already in the right/sorted position)
    quickSortW3C(array, low, pivotIndex - 1);
    console.log("quickSortW3C 2 CALL", array, pivotIndex + 1, high);
    // sorting elements on the right of the pivot (already in the right/sorted position)
    quickSortW3C(array, pivotIndex + 1, high);
  }
  return array;
}
/*
//partition pivot 22
// ([12, 29, 3, -12, 45, 1, 321, 22]);
  i  j                           p
// ([12, 29, 3, -12, 45, 1, 321, 22]);
     ij                          p
// ([12, 29, 3, -12, 45, 1, 321, 22]);
     i    j                      p
// ([12, 29, 3, -12, 45, 1, 321, 22]);
     i       j                   p
// ([12, 29, 3, -12, 45, 1, 321, 22]);
         i   j                   p
// ([12, 3, 29, -12, 45, 1, 321, 22]);
         i       j               p
// ([12, 3, 29, -12, 45, 1, 321, 22]);
             i    j              p
// ([12, 3, -12, 29, 45, 1, 321, 22]);
              i      j           p
// ([12, 3, -12, 29, 45, 1, 321, 22]);
              i          j       p
// ([12, 3, -12, 29, 45, 1, 321, 22]);        
                 i       j       p
// ([12, 3, -12, 1, 45, 29, 321, 22]);
                 i          j    p
// ([12, 3, -12, 1, 45, 29, 321, 22]);
                    i       j    p
// ([12, 3, -12, 1, 22, 29, 321, 45]);
                    ip      j    (i)
// EO partition 1

// recursive left (low = 0, high = 4-1)
  // partition pivot 1
  // ([12, 3, -12, 1, 22, 29, 321, 45]);
    i  j           p
  // ([12, 3, -12, 1, 22, 29, 321, 45]);
    i      j       p
  // ([12, 3, -12, 1, 22, 29, 321, 45]);
    i      j       p
  // ([12, 3, -12, 1, 22, 29, 321, 45]);
    i          j   p
  // ([12, 3, -12, 1, 22, 29, 321, 45]);
       i       j   p
  // ([-12, 3, 12, 1, 22, 29, 321, 45]);
       i       j   p
  // ([-12, 3, 12, 1, 22, 29, 321, 45]);
            i  j   p
  // ([-12, 1, 12, 3, 22, 29, 321, 45]);
            ip  j (i)
  // recursive left (low= 0, high=1-1)
    if (low < high) -> false - end recurisive function
  // recursive right (low=1+1, high=4-1)
    // partition pivot 3
    // ([-12, 1, 12, 3, 22, 29, 321, 45]);
              i  j   p
    // ([-12, 1, 12, 3, 22, 29, 321, 45]);
              i  j   p
    // ([-12, 1, 12, 3, 22, 29, 321, 45]);
                 ij  p
    // ([-12, 1, 3, 12, 22, 29, 321, 45]);
                pij (i)
    // recursive left (low=2, high=2-1)
      if (low < high) -> false - end recurisive function
    // recursive right (low=2+1, hight=3)
      if (low < high) -> false - end recurisive function
// recursive right (low = 4+1, high = array-length-1 (8-1))
  // partition pivot 45
  // ([-12, 1, 3, 12, 22, 29, 321, 45]);
                       i   j       p
  // ([-12, 1, 3, 12, 22, 29, 321, 45]);
                          ij       p
  // ([-12, 1, 3, 12, 22, 29, 321, 45]);
                          i   j    p
  // ([-12, 1, 3, 12, 22, 29, 321, 45]);
                              ij   p
  // ([-12, 1, 3, 12, 22, 29, 45, 321]);
                             ipj   (i)
  // recursive left (low=5, high=6-1)
    if (low < high) -> false - end recurisive function 
  // recursive right (low=6+1, high=7)
    if (low < high) -> false - end recurisive function 
*/
