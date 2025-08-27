export function radixSort(array: number[]): number[] {
  const max = Math.max(...array);

  for (let exp = 1; max > exp; exp *= 10) {
    // Create an Array of dimention 10 and for each element set an empty array
    const radixArray: number[][] = Array.from({ length: 10 }, () => []);
    console.log("before loop array exp", exp, array);
    // Move values from array to radixArray
    while (array.length > 0) {
      // Get last element out from the array (better than the first, so you don't need to handle shifting of remaining elements)
      const val = array.pop()!;
      // Divide the number for exp and remove decimals. In this way you move ahead on each number (123/1 = 123; 123/10 = 12; 123/100 = 1; 123/1000 = 0)
      // then get the module 10. In this way you get always the last digit (123%10 = 3; 12%10 = 2; 1%10 = 1; 0%10 = 0)
      const digit = Math.floor(val / exp) % 10;
      // Put the val in the right digit position of radixArray
      radixArray[digit].push(val);
      console.log("radixArray[digit]", radixArray[digit]);
    }

    console.log("radixArray", radixArray, "array", array);

    for (let i = 0; i < radixArray.length; i++) {
      while (radixArray[i].length > 0) {
        // Get last element out from the shiftArray[i] and put in the end of array
        array.push(radixArray[i].pop()!);
      }
    }
    console.log("exp", exp, "array", array);
  }

  return array;
}

export function radixSortW3C(array: number[]): number[] {
  const maxVal = Math.max(...array);
  let exp = 1;

  while (Math.floor(maxVal / exp) > 0) {
    // Initialize buckets for digits 0-9
    const radixArray: number[][] = Array.from({ length: 10 }, () => []);

    // Place numbers into buckets based on current digit
    while (array.length > 0) {
      const val = array.pop()!;
      const radixIndex = Math.floor(val / exp) % 10;
      radixArray[radixIndex].push(val);
    }

    // Collect numbers from buckets back into myArray
    for (const bucket of radixArray) {
      while (bucket.length > 0) {
        const val = bucket.pop()!;
        array.push(val);
      }
    }

    exp *= 10;
  }
  return array;
}
