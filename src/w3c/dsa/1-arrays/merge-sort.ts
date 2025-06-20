export function mergeSortW3C(arr: number[]): number[] {
  if (arr.length <= 1) {
    return arr;
  }
  console.log("Array", arr);
  const mid = Math.floor(arr.length / 2);
  const leftHalf = arr.slice(0, mid);
  const rightHalf = arr.slice(mid);
  console.log("split with mid", mid, "left", leftHalf, "right", rightHalf);

  console.log("merge left");
  const sortedLeft = mergeSortW3C(leftHalf);
  console.log("merge right");
  const sortedRight = mergeSortW3C(rightHalf);

  return merge(sortedLeft, sortedRight);
}

function merge(left: number[], right: number[]): number[] {
  let result: number[] = [];
  let i = 0,
    j = 0;
  console.log("merge. left", left, "right", right);
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      console.log("left element is min. push", left[i]);
      result.push(left[i]);
      i++;
    } else {
      console.log("right element is min. push", right[j]);
      result.push(right[j]);
      j++;
    }
  }

  // Add remaining elements
  result = result.concat(left.slice(i)).concat(right.slice(j));
  console.log("merge. add remaining element from left", left.slice(i), "add remaining element from right", right.slice(j), "resulting array", result);
  return result;
}
