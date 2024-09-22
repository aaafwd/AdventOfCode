// https://adventofcode.com/2022/day/10
// --- Day 10: Cathode-Ray Tube ---

(function() {

function parseInput(input) {
  let instructions = [];
  let lines = input.trim().split('\n');
  for (let line of lines) {
    if (line == "noop") {
      instructions.push(0);
    } else if (line.startsWith("addx ")) {
      let value = +line.substring(5);
      instructions.push(0, value);
    } else {
      console.assert(false, line);
    }
  }
  return instructions;
}

function solve1(instructions) {
  const indexes = [20, 60, 100, 140, 180, 220]
  let result = 0;
  let x = 1;
  for (let i = 0; i < instructions.length; ++i) {
    x += instructions[i];
    if (indexes.indexOf(i + 1) != -1) {
      result += (i + 1) * x;
    }
  }
  return result;
}

function solve2(instructions) {
  let result = Array(instructions.length).fill('.');
  let x = 1;
  for (let i = 0; i < instructions.length; ++i) {
    if (x - 1 <= (i % 40) && (i % 40) <= x + 1) {
      result[i] = '#';
    }
    x += instructions[i];
  }
  let map = [];
  while (result.length > 0) {
    map.push(result.splice(0, 40))
  }
  return map;
}

function solve(input) {
  let instructions = parseInput(input);
  console.assert(instructions.length == 240);

  let answer1 = solve1(instructions);
  console.log('Answer 1:', answer1);

  let map = solve2(instructions);
  console.log('Answer 2:');
  console.log(map.map(row => row.join('')).join('\n'));
}

solve(`
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`);

solve(document.body.textContent);

})();

