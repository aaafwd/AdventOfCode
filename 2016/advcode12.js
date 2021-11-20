// https://adventofcode.com/2016/day/12
// --- Day 12: Leonardo's Monorail ---

(function() {

function parseInput(input) {
  return input.trim().split('\n').map(row => row.split(' ').map(str => str.trim()));
}

function execute(commands, registers) {
  function getRegisterOrValue(value) {
    let num = +value;
    if (!isNaN(num)) return num;
    return (registers[value] = registers[value] || 0);
  }

  for (let i = 0; i < commands.length; ++i) {
    let cmd = commands[i];
    if (cmd[0] == 'cpy') {
      let [, x, y] = cmd;
      registers[y] = getRegisterOrValue(x);
    } else if (cmd[0] == 'inc') {
      let [, y] = cmd;
      registers[y] = (registers[y] || 0) + 1;
    } else if (cmd[0] == 'dec') {
      let [, y] = cmd;
      registers[y] = (registers[y] || 0) - 1;
    } else if (cmd[0] == 'jnz') {
      let [, x, y] = cmd;
      if (getRegisterOrValue(x) == 0) continue;
      i += (+y) - 1;
    } else {
      console.assert(0, cmd);
    }
  }
}

function solve(input) {
  let commands = parseInput(input);

  let registers = {};
  execute(commands, registers);
  let answer1 = registers.a;
  console.log('Answer 1:', answer1);

  registers = {c: 1};
  execute(commands, registers);
  let answer2 = registers.a;
  console.log('Answer 2:', answer2);
}

solve(`
cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a
`);

solve(document.body.textContent);

})();

