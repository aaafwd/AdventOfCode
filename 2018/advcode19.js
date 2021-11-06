// https://adventofcode.com/2018/day/19
// --- Day 19: Go With The Flow ---

(function() {

const kOpcodeNames = [
  "addr", "addi", "mulr", "muli", "banr", "bani", "borr", "bori",
  "setr", "seti", "gtir", "gtri", "gtrr", "eqir", "eqri", "eqrr"
];

function parseInput(input) {
  let lines = input.trim().split('\n');
  let [, cp_reg] = lines.shift().match(/^#ip\s*(\d+)$/);
  let opcodes = lines.map(row => row.split(' ').map((x, i) => (i ? +x : x)));
  for (let opcode of opcodes) {
    let index = kOpcodeNames.indexOf(opcode[0]);
    console.assert(index >= 0, opcode);
    opcode[0] = index;
  }
  return {opcodes, cp_reg};
}

function runOpcode([op, A, B, C], registers) {
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

function runAllOpcodes(opcodes, cp_reg, registers) {
  let cp = 0;
  while (0 <= cp && cp < opcodes.length) {
    registers[cp_reg] = cp;
    runOpcode(opcodes[cp], registers);
    cp = registers[cp_reg];
    ++cp;
  }
}

function solve2() {
  // Registers: [a, b, c, d, e, f]
  //             0  1  2  3  4  5
  // #ip 3 => d (== cp)
  //  0  addi 3 16 3  cp += 16
  //  1  seti 1 5 1   b := 1
  //  2  seti 1 4 4   e := 1
  //  3  mulr 1 4 5   f := b * e
  //  4  eqrr 5 2 5   f := (f == c) ? 1 : 0
  //  5  addr 5 3 3   cp += f
  //  6  addi 3 1 3   cp++
  //  7  addr 1 0 0   a += b
  //  8  addi 4 1 4   e++
  //  9  gtrr 4 2 5   f := (e > c) ? 1 : 0
  // 10  addr 3 5 3   cp += f
  // 11  seti 2 6 3   cp := 2
  // 12  addi 1 1 1   b++
  // 13  gtrr 1 2 5   f := (b > c) ? 1 : 0
  // 14  addr 5 3 3   cp += f
  // 15  seti 1 1 3   cp := 1
  // 16  mulr 3 3 3   cp := cp * cp => exit()
  // 17  addi 2 2 2   c += 2
  // 18  mulr 2 2 2   c := c * c
  // 19  mulr 3 2 2   c *= 19
  // 20  muli 2 11 2  c *= 11
  // 21  addi 5 3 5   f += 3
  // 22  mulr 5 3 5   f *= 22
  // 23  addi 5 3 5   f += 3
  // 24  addr 2 5 2   c += f
  // 25  addr 3 0 3   cp += a
  // 26  seti 0 6 3   cp := a
  // 27  setr 3 8 5   f := 27
  // 28  mulr 5 3 5   f *= 28
  // 29  addr 3 5 5   f += 29
  // 30  mulr 3 5 5   f *= 30
  // 31  muli 5 14 5  f *= 14
  // 32  mulr 5 3 5   f *= 32
  // 33  addr 2 5 2   c += f
  // 34  seti 0 2 0   a := 0
  // 35  seti 0 2 3   cp := 0
 
  // Equivalent code:
  //
  //     let a = 0;
  //     let c = 10551305;
  //     for (let b = 1; b <= c; ++b) {
  //       for (let e = 1; e <= c; ++e) {
  //         if (b * e == c) a += b;
  //       }
  //     }
  //
  // So, this code calculates the sum of all divisors.

  let a = 0;
  let c = 10551305;
  for (let b = 1; b * b <= c; ++b) {
    if ((c % b) == 0) a += b + c / b;
  }
  return a;
}

function solve(input) {
  let {opcodes, cp_reg} = parseInput(input);

  let registers = Array(6).fill(0);
  runAllOpcodes(opcodes, cp_reg, registers);
  let answer1 = registers[0]

  let answer2 = solve2();

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5
`);

solve(document.body.textContent);

})();

