// https://adventofcode.com/2018/day/16
// --- Day 16: Chronal Classification ---

(function() {

function parseInput(input) {
  let [samples, program] = input.trim().split('\n\n\n');

  const regex_registers = /^(?:Before|After):\s*\[([\d-]+), ([\d-]+), ([\d-]+), ([\d-]+)\]\s*$/;
  samples = samples.trim().split('\n\n').map(sample => {
    let lines = sample.trim().split('\n');
    console.assert(lines.length == 3);
    let [, a1, b1, c1, d1] = lines[0].match(regex_registers).map(x => +x);
    let opcode = lines[1].split(' ').map(x => +x);
    let [, a2, b2, c2, d2] = lines[2].match(regex_registers).map(x => +x);
    console.assert(opcode.length == 4);
    return {opcode, before: [a1, b1, c1, d1], after: [a2, b2, c2, d2]};
  });

  program = program ? program.trim().split('\n').map(row => row.split(' ').map(x => +x)) : [];

  return {samples, program};
}

function runOpcode([op, A, B, C], registers = [0, 0, 0, 0]) {
  switch (op) {
    case 0: // addr
      registers[C] = registers[A] + registers[B];
      break;
    case 1: // addi
      registers[C] = registers[A] + B;
      break;
    case 2: // mulr
      registers[C] = registers[A] * registers[B];
      break;
    case 3: // muli
      registers[C] = registers[A] * B;
      break;
    case 4: // banr
      registers[C] = registers[A] & registers[B];
      break;
    case 5: // bani
      registers[C] = registers[A] & B;
      break;
    case 6: // borr
      registers[C] = registers[A] | registers[B];
      break;
    case 7: // bori
      registers[C] = registers[A] | B;
      break;
    case 8: // setr
      registers[C] = registers[A];
      break;
    case 9: // seti
      registers[C] = A;
      break;
    case 10: // gtir
      registers[C] = (A > registers[B]) ? 1 : 0;
      break;
    case 11: // gtri
      registers[C] = (registers[A] > B) ? 1 : 0;
      break;
    case 12: // gtrr
      registers[C] = (registers[A] > registers[B]) ? 1 : 0;
      break;
    case 13: // eqir
      registers[C] = (A == registers[B]) ? 1 : 0;
      break;
    case 14: // eqri
      registers[C] = (registers[A] == B) ? 1 : 0;
      break;
    case 15: // eqrr
      registers[C] = (registers[A] == registers[B]) ? 1 : 0;
      break;
    default:
      console.assert(0);
      break;
  }
}

function matchAllOpcodes({before, after, opcode}) {
  let matched = [];
  for (let op = 0; op < 16; ++op) {
    let input = Array.from(opcode);
    let registers = Array.from(before);
    input[0] = op;
    runOpcode(input, registers);
    if (registers.join(',') == after.join(',')) {
      matched.push(op);
    }
  }
  return matched;
}

function solve(input) {
  let {samples, program} = parseInput(input);

  let opcode_mapping = {};

  let answer1 = 0;
  for (let sample of samples) {
    let matched = matchAllOpcodes(sample);
    if (matched.length >= 3) ++answer1;
    let op = sample.opcode[0];
    if (opcode_mapping[op]) {
      matched = matched.filter(x => opcode_mapping[op].has(x));
    }
    console.assert(matched.length > 0);
    opcode_mapping[op] = new Set(matched);
  }
  console.log("Answer 1:", answer1);

  if (program.length == 0) return;

  // Construct 1/1 opcode mapping.
  let mask = [];
  let queue = [];
  while (1) {
    for (let op in opcode_mapping) {
      if (mask[op]) continue;
      if (opcode_mapping[op].size == 1) {
        queue.push([...opcode_mapping[op]][0]);
        mask[op] = 1;
      }
    }
    if (queue.length == 0) break;
    while (queue.length) {
      x = queue.shift();
      for (let op in opcode_mapping) {
        if (mask[op]) continue;
        opcode_mapping[op].delete(x);
      }
    }
  }

  // Renumerate.
  for (let prog of program) {
    let op = prog[0];
    op = [...opcode_mapping[op]][0];
    prog[0] = op;
  }

  // Run the program.
  let registers = [0, 0, 0, 0];
  for (let prog of program) {
    runOpcode(prog, registers);
  }
  let answer2 = registers[0];
  console.log("Answer 2:", answer2);
}

solve(`
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
`);

solve(document.body.textContent);

})();

