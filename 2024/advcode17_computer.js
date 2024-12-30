// https://adventofcode.com/2024/day/17
// --- Day 17: Chronospatial Computer ---
// Runtime: 2.7890625 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let lines = input.trim().split('\n');
  let regex = /Register [ABC]: (\d+)/;
  let [,a] = lines[0].match(regex);
  let [,b] = lines[1].match(regex);
  let [,c] = lines[2].match(regex);
  let instructions = lines[4].trim().replace(/Program:\s+/, '').split(',').map(x => +x);
  return [[BigInt(a), BigInt(b), BigInt(c)], instructions];
}

function simulate(registers, instructions) {
  let pos = 0;

  function toCombo(operand) {
    if (operand < 4) return operand;
    if (operand == 4) return registers[0];
    if (operand == 5) return registers[1];
    if (operand == 6) return registers[2];
    console.assert(false, operand);
  }

  let output = [];
  while (pos + 1 < instructions.length) {
    let opcode = instructions[pos++];
    let operand = BigInt(instructions[pos++]);
    switch (opcode) {
      case 0: // adv
        operand = toCombo(operand);
        registers[0] = registers[0] >> operand;
        break;
      case 1: // bxl
        registers[1] ^= operand;
        break;
      case 2: // bst
        operand = toCombo(operand);
        registers[1] = operand % 8n;
        break;
      case 3: // jnz
        if (registers[0] != 0) {
          pos = Number(operand);
        }
        break;
      case 4: // bxc
        registers[1] ^= registers[2];
        break;
      case 5: // out
        operand = toCombo(operand) % 8n;
        output.push(Number(operand));
        break;
      case 6: // bdv
        operand = toCombo(operand);
        registers[1] = registers[0] >> operand;
        break;
      case 7: // cdv
        operand = toCombo(operand);
        registers[2] = registers[0] >> operand;
        break;
      default:
        console.assert(false, opcode);
        break;
    }
  }
  return output;
}

function arraysEndsWith(arr1, arr2) {
  if (arr1.length < arr2.length) return false;
  for (let i = 0; i < arr2.length; ++i) {
    let a = arr1[arr1.length - i - 1];
    let b = arr2[arr2.length - i - 1];
    if (a != b) return false;
  }
  return true;
}

function findRegisterToCopySelf(instructions) {
  function findRecursive(a, index) {
    if (index < 0) return a;
    a <<= 3n;
    for (let x = 0; x < 8; ++x) {
      let output = simulate([a, 0n, 0n], instructions);
      if (index + output.length == instructions.length &&
          arraysEndsWith(instructions, output)) {
        let final = findRecursive(a, index - 1);
        if (final !== undefined) return final;
      }
      ++a;
    }
  }
  return findRecursive(0n, instructions.length - 1);
}

function solve(input) {
  let [registers, instructions] = parseInput(input);

  let answer1 = simulate(registers.slice(), instructions).join(',');

  let answer2 = findRegisterToCopySelf(instructions);

  console.log('Answer 1: ' + answer1, 'Answer 2: ' + answer2);
}

solve(`
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`);

solve(`
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`)

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

