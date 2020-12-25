// https://adventofcode.com/2020/day/8

(function() {

function process(opcodes) {
  let accum = 0;
  let visited = Array(opcodes.length);
  for (let i = 0; i < opcodes.length; ++i) {
    console.assert(0 <= i && i < opcodes.length);
    if (visited[i]) return [accum, false];
    visited[i] = true;
    let [op, count] = opcodes[i];
    if (op == "acc") {
      accum += count;
    } else if (op == "jmp") {
      i += count - 1;
    } else {
      console.assert(op == "nop");
    }
  }
  return [accum, true];
}

function solve(input) {
  let opcodes = input.trim().split('\n').map(line => {
    let [,op,count] = line.match(/^(\w+)\s+([+-]\d+)$/);
    return [op, Number(count)]
  });
  console.log("Answer 1:", process(opcodes)[0]);

  for (let opcode of opcodes) {
    let result;
    if (opcode[0] == "nop") {
      opcode[0] = "jmp";
      result = process(opcodes);
      opcode[0] = "nop";
    } else if (opcode[0] == "jmp") {
      opcode[0] = "nop";
      result = process(opcodes);
      opcode[0] = "jmp";
    } else {
      continue;
    }
    if (result[1]) {
      console.log("Answer 2:", result[0]);
    }
  }
}

solve(`
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
`);

solve(document.body.textContent);

})();

