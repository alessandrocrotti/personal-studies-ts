export function insertionSort(arr: number[]): number[] {
  const sortedArray: number[] = [];

  const n = arr.length;

  for (let i = 0; i < n; i++) {
    // Pop el from original array
    const [el] = arr.splice(0, 1);
    sortedArray.push(el);

    for (let j = sortedArray.length - 1; j > 0; j--) {
      if (sortedArray[j] < sortedArray[j - 1]) {
        [sortedArray[j], sortedArray[j - 1]] = [sortedArray[j - 1], sortedArray[j]];
      } else {
        break;
      }
    }
  }

  return sortedArray;
}

export function insertionSortW3C(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let insertIndex = i;
    const currentValue = arr[i];
    console.log("in", arr, insertIndex, currentValue);
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] > currentValue) {
        console.log(arr, insertIndex, currentValue, j);
        arr[j + 1] = arr[j];
        console.log("for", arr);
        insertIndex = j;
      } else {
        console.log("break");
        break;
      }
    }

    arr[insertIndex] = currentValue;
    console.log("out", arr);
  }

  return arr;
}
