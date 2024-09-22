// https://adventofcode.com/2022/day/2
// --- Day 2: Rock Paper Scissors ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim().split(' ')
      .map(ch => "ABCXYZ".indexOf(ch) % 3));
}

function score([a, b]) {
  let win = (a == (b + 2) % 3);
  return b + 1 + (a == b ? 3 : (win ? 6 : 0));
}

function remap([a, b]) {
  switch (b) {
    case 0: // lose
      return [a, (a + 2) % 3];
    case 1: // draw
      return [a, a];
    case 2: // win
      return [a, (a + 1) % 3];
    default:
      console.assert(false, b);
  }
}

function solve(input) {
  let turns = parseInput(input);

  let answer1 = turns
    .map(score)
    .reduce((a, b) => a + b);

  let answer2 = turns
    .map(remap)
    .map(score)
    .reduce((a, b) => a + b);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
A Y
B X
C Z
`);

solve(document.body.textContent);

})();

