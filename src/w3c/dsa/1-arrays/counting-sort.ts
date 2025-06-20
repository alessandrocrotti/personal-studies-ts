export function countingSort(array: number[]): number[] {
  const countingArrayLength = max(array);
  const countingArray: number[] = [];
  for (let i = 0; i <= countingArrayLength; i++) {
    countingArray.push(0);
  }
  console.log("countingArray empty", countingArray);

  for (let i = 0; i < array.length; i++) {
    countingArray[array[i]]++;
  }

  console.log("countingArray full", countingArray);

  const sortedArray: number[] = [];
  for (let i = 0; i < countingArray.length; i++) {
    for (let j = 0; j < countingArray[i]; j++) {
      sortedArray.push(i);
    }
  }
  console.log(sortedArray);
  return sortedArray;
}

function max(array: number[]): number {
  let max = 0;
  for (let i = 0; i < array.length; i++) {
    if (max < array[i]) {
      max = array[i];
    }
  }
  return max;
}

export function countingSortW3C(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  // Find the maximum value to determine the size of the count array
  const maxVal = Math.max(...arr);
  const count = new Array(maxVal + 1).fill(0);

  // Simulate pop(0): remove from the front and count occurrences
  while (arr.length > 0) {
    const num = arr.shift()!; // 'shift' removes the first element
    count[num]++;
  }

  // Reconstruct the array in sorted order
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      arr.push(i); // Append the sorted values
      count[i]--;
    }
  }

  return arr;
}
