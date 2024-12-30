// https://adventofcode.com/2024/day/19
// --- Day 19: Linen Layout ---
// Runtime: 54.4521484375 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let parts = input.trim().split('\n\n');
  return parts.map(part => part
    .trim()
    .split(/[\s\n,]+/)
    .map(row => row.trim().split('')));
}

function arraysStartsWith(arr1, arr2, offset = 0) {
  if (offset + arr2.length > arr1.length) return false;
  for (let i = 0; i < arr2.length; ++i) {
    let a = arr1[i + offset];
    let b = arr2[i];
    if (a != b) return false;
  }
  return true;
}

function countArrangements(design, towels) {
  let cache = new Map();

  function countImpl(index) {
    if (index >= design.length) return 1;
    if (cache.has(index)) return cache.get(index);
    let count = 0;
    for (let towel of towels) {
      if (arraysStartsWith(design, towel, index)) {
        count += countImpl(index + towel.length);
      }
    }
    cache.set(index, count)
    return count;
  }
  return countImpl(0);
}

function solve(input) {
  let [towels, designs] = parseInput(input);

  let counts = designs.map(d => countArrangements(d, towels));
  let answer1 = counts.filter(count => count > 0).length;

  let answer2 = counts.reduce((a, b) => a + b);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

