// https://adventofcode.com/2022/day/4
// --- Day 4: Camp Cleanup ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim()
      .split(',')
      .map(pair => pair.trim().split('-').map(Number)));
}

function fullyOverlap([[a1, a2], [b1, b2]]) {
  console.assert(a1 <= a2 && b1 <= b2);
  return (a1 <= b1 && b2 <= a2) || (b1 <= a1 && a2 <= b2);
}

function overlap([[a1, a2], [b1, b2]]) {
  console.assert(a1 <= a2 && b1 <= b2);
  return Math.max(a1, b1) <= Math.min(a2, b2);
}

function solve(input) {
  let pairs = parseInput(input);

  let answer1 = pairs.filter(fullyOverlap).length;

  let answer2 = pairs.filter(overlap).length;

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`);

solve(document.body.textContent);

})();

