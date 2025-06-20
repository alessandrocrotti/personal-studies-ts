/**
 * Build by myself from specific. Not optimized! more iterations than bubbleSortW3C
 * @param arr
 * @param unsortedIndex
 * @param iterationCount
 * @returns
 */
export function bubbleSort(arr: number[], unsortedIndex = arr.length, iterationCount = 0): number[] {
  if (arr.length < 2) {
    return arr;
  }

  if (unsortedIndex < 2) {
    return arr;
  }

  for (let i = 0; i < arr.length - 1 && i < unsortedIndex; i++) {
    console.log("bubbleSort iterationCount", ++iterationCount, "unsortedIndex", unsortedIndex);
    if (arr[i] > arr[i + 1]) {
      const current = arr[i];
      arr[i] = arr[i + 1];
      arr[i + 1] = current;
    }
  }

  return bubbleSort(arr, --unsortedIndex, iterationCount);
}

export function bubbleSortW3C(arr: number[]): number[] {
  let iterationCount = 0;
  const n = arr.length;
  console.log("BubbleSortW3C");

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      // console.log(arr[j], arr[j + 1])
      console.log("bubbleSortW3C iterationCount", ++iterationCount);
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        // console.log(arr);
      }
    }
    if (!swapped) {
      break;
    }
  }

  return arr;
}
