// https://adventofcode.com/2021/day/2
// --- Day 2: Dive! ---

(function() {

function process1(commands) {
  let x = 0, depth = 0;
  for (let [cmd, value] of commands) {
    value = +value;
    if (cmd == 'forward') {
      x += value;
    } else if (cmd == 'up') {
      depth -= value;
    } else if (cmd == 'down') {
      depth += value;
    } else {
      console.assert(0, cmd);
    }
  }
  return x * depth;
}

function process2(commands) {
  let x = 0, depth = 0, aim = 0;
  for (let [cmd, value] of commands) {
    value = +value;
    if (cmd == 'forward') {
      x += value;
      depth += aim * value;
    } else if (cmd == 'up') {
      aim -= value;
    } else if (cmd == 'down') {
      aim += value;
    } else {
      console.assert(0, cmd);
    }
  }
  return x * depth;
}

function solve(input) {
  let commands = input.trim().split('\n').map(row => row.trim().split(' '));
  let answer1 = process1(commands);
  let answer2 = process2(commands);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
forward 5
down 5
forward 8
up 3
down 8
forward 2
`);

solve(document.body.textContent);

})();

