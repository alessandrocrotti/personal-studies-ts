export default function runExercise() {
  console.log(predictPartyVictory("DDRRRR"));
}

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
  const n1 = buildNumber(l1!);
  const n2 = buildNumber(l2!);
  const result = n1 + n2;

  const lResult = new ListNode();
  let lCurrent = lResult;
  for (let i = 1; i <= result; i *= 10) {
    lCurrent = buildListNode(lCurrent, Math.floor(result / i) % 10);
  }

  return lResult;
}

function buildNumber(l: ListNode): number {
  let count = 1;
  let result = 0;
  const sum = (node: ListNode, count: number, result: number): number => {
    result += node.val * count;

    return node.next != null ? sum(node.next, count * 10, result) : result;
  };

  return sum(l, count, result);
}

function buildListNode(l: ListNode, value: number): ListNode {
  const newListNode = new ListNode(value);
  l.next = newListNode;
  return newListNode;
}

function gcdOfStrings(str1: string, str2: string): string {
  for (let i = 0; i < str1.length; i++) {
    for (let j = 0; j < str1.length; j++) {
      const substr1 = str1.slice(i, j);
      const split = str1.split(substr1);
    }
  }

  return "";
}

function reverseVowels(s: string): string {
  const result: string[] = [];

  const reversedVowelList = s.match(/[aeiou]/gi)?.reverse();
  if (reversedVowelList == null) {
    return s;
  }

  console.log(reversedVowelList);

  let reversedVowelListIndex = 0;

  for (let i = 0; i < s.length; i++) {
    // If defined, it contains a vowel case INSENSITIVE
    if (s.charAt(i).match(/[a,e,i,o,u]/i)) {
      console.log("TEST", s.charAt(i), reversedVowelList[reversedVowelListIndex]);
      result[i] = reversedVowelList[reversedVowelListIndex];
      reversedVowelListIndex++;
    }
    {
      result[i] = s.charAt(i);
    }
  }
  return result.join("");
}

function equalPairs(grid: number[][]): number {
  const invertedGrid: number[][] = Array(grid.length);
  // Loop on each row
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (invertedGrid[j] == null) {
        invertedGrid[j] = Array(grid.length);
      }
      invertedGrid[j][i] = grid[i][j];
      console.log(i, j, invertedGrid);
    }
  }

  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < invertedGrid.length; j++) {
      if (JSON.stringify(grid[i]) === JSON.stringify(invertedGrid[j])) {
        count++;
      }
    }
  }

  return count;
}

function asteroidCollision(asteroids: number[]): number[] {
  let size = 0;
  let direction = 0;
  let i = 0;
  while (i < asteroids.length) {
    const astSize = Math.abs(asteroids[i]);
    const astDirection = asteroids[i] > 0 ? 1 : -1;
    if (size === 0) {
      console.log("FIRST", size, direction, i, asteroids[i]);
      // First asteroid
      size = astSize;
      direction = astDirection;
      i += direction;
    } else if (direction === astDirection) {
      console.log("SAME DIRECTION", size, direction, i, asteroids[i]);
      // Same direction, get new asteroid size
      size = astSize;
      i += direction;
    } else if (direction < astDirection) {
      console.log("OPPOSITE DIRECTION NO COLLISION", size, direction, i, asteroids[i]);
      // Different direction, opposite way, no collision
      size = astSize;
      direction = astDirection;
      i += direction;
    } else if (size === astSize) {
      console.log("DESTROY BOTH", size, direction, i, asteroids[i]);
      // Opposite direction, same size, destroy both
      asteroids.splice(i - 1, 2);
      i -= 2 * direction;
      size = 0;
      direction = 0;
    } else if (size > astSize) {
      console.log("DESTROY CURRENT", size, direction, i, asteroids[i]);
      // Opposite direction, prev asteroid bigger, destroy current asteroid
      asteroids.splice(i, 1);
      i += direction;
    } else if (size < astSize) {
      console.log("DESTROY PREV", size, direction, i, asteroids[i]);
      // Opposite direction, current asteroid bigger, destroy prev asteroid
      asteroids.splice(i - 1, 1);
      size = astSize;
      direction = astDirection;
      i += direction;
    }
  }

  return asteroids;
}

function asteroidCollision2(asteroids: number[]): number[] {
  const stack: number[] = [];
  for (let i = 0; i < asteroids.length; i++) {
    const size = stack.length > 0 ? Math.abs(stack[stack.length - 1]) : 0;
    const direction = stack.length > 0 ? (stack[stack.length - 1] > 0 ? 1 : -1) : 0;
    const astSize = Math.abs(asteroids[i]);
    const astDirection = asteroids[i] > 0 ? 1 : -1;
    if (size === 0) {
      console.log("FIRST", size, direction, i, asteroids[i]);
      // First asteroid
      stack.push(asteroids[i]);
    } else if (direction === astDirection) {
      console.log("SAME DIRECTION", size, direction, i, asteroids[i]);
      // Same direction, get new asteroid size
      stack.push(asteroids[i]);
    } else if (direction < astDirection) {
      console.log("OPPOSITE DIRECTION NO COLLISION", size, direction, i, asteroids[i]);
      // Different direction, opposite way, no collision
      stack.push(asteroids[i]);
    } else if (size === astSize) {
      console.log("DESTROY BOTH", size, direction, i, asteroids[i]);
      // Opposite direction, collision, same size, destroy both
      stack.pop();
    } else if (size > astSize) {
      console.log("DESTROY CURRENT", size, direction, i, asteroids[i]);
      // Opposite direction, prev asteroid bigger, destroy current asteroid
    } else if (size < astSize) {
      console.log("DESTROY PREV", size, direction, i, asteroids[i]);
      // Opposite direction, current asteroid bigger, destroy prev asteroid
      stack.pop();
      stack.push(asteroids[i]);
    }
  }

  return stack;
}

function predictPartyVictory(senate: string): string {
  const f = (senate: string): string => {
    let newSenate = "";
    for (let i = 0; i < senate.length; i++) {
      const senator = senate.charAt(i);
      if (senator === "R") {
        newSenate += senator;
        let dFound = false;
        // REMOVE NEXT OPPONENT
        for (let j = i + 1; j < senate.length; j++) {
          if (senate.charAt(j) === "D") {
            senate = senate.substring(0, j) + senate.substring(j + 1);
            dFound = true;
            break;
          }
        }
        // IF NOT FOUND, REMOVE PREVIOUS OPPONENT
        if (!dFound) {
          for (let j = 0; j < newSenate.length; j++) {
            if (newSenate.charAt(j) === "D") {
              dFound = true;
              newSenate = newSenate.substring(0, j) + newSenate.substring(j + 1);
              break;
            }
          }
        }
        if (!dFound) {
          return "Radiant";
        }
      } else if (senator === "D") {
        newSenate += senator;
        let rFound = false;
        // REMOVE NEXT OPPONENT
        for (let j = i + 1; j < senate.length; j++) {
          if (senate.charAt(j) === "R") {
            console.log("REMOVE", i, j, senate.charAt(j), senate);
            senate = senate.substring(0, j) + senate.substring(j + 1);
            console.log("NEW SENATE", senate);
            rFound = true;
            break;
          }
        }
        // IF NOT FOUND, REMOVE PREVIOUS OPPONENT
        if (!rFound) {
          for (let j = 0; j < newSenate.length; j++) {
            if (newSenate.charAt(j) === "R") {
              rFound = true;
              newSenate = newSenate.substring(0, j) + newSenate.substring(j + 1);
              break;
            }
          }
        }
        if (!rFound) {
          return "Dire";
        }
      }
      console.log("ROUND END", newSenate, senate);
    }
    return f(newSenate);
  };

  return f(senate);
}
