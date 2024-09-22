// https://adventofcode.com/2022/day/1
// --- Day 1: Calorie Counting ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n\n')
    .map(elf => elf.trim().split('\n').map(Number));
}

function solve(input) {
  let calories = parseInput(input);

  calories = calories
    .map(elf => elf.reduce((a, b) => a + b))
    .sort((a, b) => b - a);

  let answer1 = calories[0];

  let answer2 = calories[0] + calories[1] + calories[2];

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
`);

solve(document.body.textContent);

})();

