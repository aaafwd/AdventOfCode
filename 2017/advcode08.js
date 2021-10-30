// https://adventofcode.com/2017/day/8
// --- Day 8: I Heard You Like Registers ---

(function() {

function isTrue(value, op, count) {
  return eval(value + ' ' + op + ' ' + count);
}

function solve(input) {
  let lines = input.trim().split('\n');
  const regex = /^\s*(\w+)\s*(\w+)\s*([\-\+\d]+)\s*if\s*(\w+)\s*([<>!=]+)\s*([\-\+\d]+)\s*$/;

  let registers = {};
  let highest_ever = 0;
  for (let line of lines) {
    let [, reg1, op1, count1, reg2, op2, count2] = line.match(regex);
    count1 = +count1;
    count2 = +count2;
    let value = registers[reg2] || 0;
    if (!isTrue(value, op2, count2)) continue;
    registers[reg1] = registers[reg1] || 0;
    if (op1 == 'inc') {
      registers[reg1] += count1;
    } else if (op1 == 'dec') {
      registers[reg1] -= count1;
    } else {
      console.assert("Unknown op:", op1);
    }
    if (highest_ever < registers[reg1]) {
      highest_ever = registers[reg1];
    }
  }

  console.log("Answer 1:", Math.max(...Object.values(registers)), "Answer 2:", highest_ever);
}

solve(`
b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10
`);

solve(document.body.textContent);

})();

