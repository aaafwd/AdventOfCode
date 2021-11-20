// https://adventofcode.com/2016/day/25
// --- Day 25: Clock Signal ---

(function() {

function parseInput(input) {
  return input.trim().split('\n').map(row => row.split(' ').map(str => str.trim()));
}

function execute(commands, registers) {
  function isRegister(name) {
    return 'a' <= name && name <= 'z';
  }

  function getRegisterOrValue(value) {
    if (isRegister(value)) {
      return (registers[value] = registers[value] || 0);
    }
    return +value;
  }

  function toggle(cmd) {
    if (cmd.length == 2) {
      cmd[0] = (cmd[0] == 'inc') ? 'dec' : 'inc';
    } else {
      cmd[0] = (cmd[0] == 'jnz') ? 'cpy' : 'jnz';
    }
  }

  let last_out = 1;
  function executeAt(cmd, index) {
    if (cmd[0] == 'cpy') {
      let [, x, y] = cmd;
      if ('a' <= y && y <= 'z') {
        registers[y] = getRegisterOrValue(x);
      }
    } else if (cmd[0] == 'inc') {
      let [, y] = cmd;
      if (isRegister(y)) {
        registers[y] = (registers[y] || 0) + 1;
      }
    } else if (cmd[0] == 'dec') {
      let [, y] = cmd;
      if (isRegister(y)) {
        registers[y] = (registers[y] || 0) - 1;
      }
    } else if (cmd[0] == 'jnz') {
      if (getRegisterOrValue(cmd[1]) != 0){
        let y = getRegisterOrValue(cmd[2]);
        index += y - 1;
      }
    } else if (cmd[0] == 'tgl') {
      let x = getRegisterOrValue(cmd[1]);
      let tgl_index = index + x;
      if (0 <= tgl_index && tgl_index < commands.length) {
        toggle(commands[tgl_index]);
        optimise();
      }
    } else if (cmd[0] == 'mult') {
      let [, x, y, z] = cmd; // z += x * y;
      console.assert(isRegister(z));
      registers[z] = (registers[z] || 0) + getRegisterOrValue(x) * getRegisterOrValue(y);
    } else if (cmd[0] == 'out') {
      let [, x] = cmd; // z += x * y;
      let value = getRegisterOrValue(x);
      if (last_out != (value ^ 1)) should_halt = true;
      last_out = value;
    } else {
      console.assert(0, cmd);
    }
    return index;
  }


  let optimisedCommands = [];
  function optimise() {
    optimisedCommands = [];
    // Dynamically detect 'mult' commands:
    //
    // cpy b c
    // inc a
    // dec c
    // jnz c -2
    // dec d
    // jnz d -5
    //
    // a += b * d;
    // c = 0;
    // d = 0;
    for (let i = 5; i < commands.length; ++i) {
      if (commands[i][0] != 'jnz' || commands[i][2] != -5) continue;
      if (commands[i - 1][0] != 'dec' || commands[i - 1][1] != commands[i][1]) continue;
      if (commands[i - 2][0] != 'jnz' || commands[i - 2][2] != -2) continue;
      if (commands[i - 3][0] != 'dec' || commands[i - 3][1] != commands[i - 2][1]) continue;
      if (commands[i - 4][0] != 'inc') continue;
      if (commands[i - 5][0] != 'cpy' || commands[i - 5][2] != commands[i - 3][1]) continue;
      optimisedCommands[i - 5] = {
        offset: 6,
        replacements: [
          ['mult', commands[i - 5][1], commands[i][1], commands[i - 4][1]], // a += b * d;
          ['cpy', 0, commands[i - 5][2]],
          ['cpy', 0, commands[i][1]],
        ]
      };
    }
  }
  optimise();

  let should_halt = false;
  let watchdog = 0;
  for (let index = 0; !should_halt && 0 <= index && index < commands.length; ++index) {
    if (++watchdog == 1000000) {
      return true;
    }

    if (optimisedCommands[index]) {
      let {offset, replacements} = optimisedCommands[index];
      replacements.forEach(executeAt);
      index += offset - 1;
    } else {
      index = executeAt(commands[index], index);
    }
  }
  return false;
}

function solve(input) {
  let commands = parseInput(input);
  for (let a = 0;; ++a) {
    let registers = {a};
    if (execute(commands, registers)) {
      console.log('Answer:', a);
      break;
    }
  }
}

solve(document.body.textContent);

})();

