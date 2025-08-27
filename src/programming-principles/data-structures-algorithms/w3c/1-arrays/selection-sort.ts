export function selectionSort(arr: number[]): number[] {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Remove element in position minIndex
    // const [minElement] = arr.splice(minIndex, 1);
    // // Add minElement after position i, without removing elements
    // arr.splice(i, 0, minElement);

    // Swap, better performance
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
  }

  return arr;
}
