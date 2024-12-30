// https://adventofcode.com/2024/day/7
// --- Day 7: Bridge Repair ---
// Runtime: 141.58203125 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines
    .map(row => row.split(/[:\s]+/).map(x => BigInt(x)))
    .map(nums => [nums.shift(), nums]);
}

function concatBigInts(a, b) {
  // String concat and parsing takes ~3x more time.
  // return BigInt(a + "" + b);
  let power10 = 10n;
  while (power10 <= b) power10 *= 10n;
  return a * power10 + b;
}

function checkEquation(result, nums, withConcat) {
  const hasZeros = nums.some(x => x == 0);
  function evalImpl(accum, index) {
    if (index == nums.length) {
      return accum == result;
    }
    if (accum > result && !hasZeros) {
      return false;
    }
    const current = nums[index++];
    if (evalImpl(accum + current, index)) {
      return true;
    }
    if (evalImpl(accum * current, index)) {
      return true;
    }
    if (withConcat && evalImpl(concatBigInts(accum, current), index)) {
      return true;
    }
    return false;
  }
  return evalImpl(nums[0], 1);
}

function solve(input) {
  let equations = parseInput(input);

  let answer1 = equations
    .filter(([result, nums]) => checkEquation(result, nums, false))
    .map(([result]) => result)
    .reduce((a, b) => a + b);

  let answer2 = equations
    .filter(([result, nums]) => checkEquation(result, nums, true))
    .map(([result]) => result)
    .reduce((a, b) => a + b);

  console.log('Answer 1: ' + answer1, 'Answer 2: ' + answer2);
}

solve(`
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

