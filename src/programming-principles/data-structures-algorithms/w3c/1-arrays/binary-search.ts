export function binarySearch(array: number[], searchElement: number, low = 0, high = array.length - 1): number {
  console.log(array, searchElement, low, high);

  if (low > high) {
    return -1;
  }

  let index = Math.floor((high + low) / 2);
  console.log("index", index, searchElement, array[index], searchElement < array[index], index + 1, high);

  if (searchElement === array[index]) {
    console.log("found");
    return index;
  }

  if (low == 4) return -1;
  if (searchElement < array[index]) {
    index = binarySearch(array, searchElement, low, index - 1);
  } else {
    index = binarySearch(array, searchElement, index + 1, high);
  }

  return index;
}

export function binarySearchW3C(arr: number[], targetVal: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    console.log("index", mid, targetVal, arr[mid], targetVal < arr[mid]);

    if (arr[mid] === targetVal) {
      return mid;
    }

    if (arr[mid] < targetVal) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1; // target not found
}
