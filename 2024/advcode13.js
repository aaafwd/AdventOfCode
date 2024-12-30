// https://adventofcode.com/2024/day/13
// --- Day 13: Claw Contraption ---
// Runtime: 1.504150390625 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let games = [];
  let lines = input.trim().split('\n');
  let regex1 = /Button [AB]: X\+(\d+), Y\+(\d+)/;
  let regex2 = /Prize: X=(\d+), Y=(\d+)/;
  for (let i = 0; i < lines.length; ++i) {
    let [, x1, y1] = lines[i++].match(regex1);
    let [, x2, y2] = lines[i++].match(regex1);
    let [, p1, p2] = lines[i++].match(regex2);
    games.push([+x1, +y1, +x2, +y2, +p1, +p2]);
  }
  return games;
}

function findMinCost(x1, y1, x2, y2, p1, p2) {
  // Answer: `i` times button A, `j` times button B, s.t.:
  // cost = i * 3 + j
  // x1 * i + x2 * j = p1
  // y1 * i + y2 * j = p2
  //
  // x1 * y1 * i + x2 * y1 * j = p1 * y1
  // x1 * y1 * i + x1 * y2 * j = p2 * x1
  // (x2 * y1 - x1 * y2) * j = p1 * y1 - p2 * x1
  let right = p1 * y1 - p2 * x1;
  let left = x2 * y1 - x1 * y2;
  if (left == 0 || (right % left) != 0) return 0;
  let j = right / left;
  if (j < 0) return 0;

  left = x1 * y1;
  right = p1 * y1 - x2 * y1 * j;
  console.assert(left != 0);
  if ((right % left) != 0) return 0;
  let i = right / left;
  if (i < 0) return 0;

  return i * 3 + j;
}

function findTotalMinCosts(games) {
  const offset = 10000000000000;
  let result1 = 0;
  let result2 = 0;
  for (let [x1, y1, x2, y2, p1, p2] of games) {
    result1 += findMinCost(x1, y1, x2, y2, p1, p2);
    result2 += findMinCost(x1, y1, x2, y2, p1 + offset, p2 + offset);
  }
  return [result1, result2];
}

function solve(input) {
  let games = parseInput(input);

  let [answer1, answer2] = findTotalMinCosts(games);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

