// https://adventofcode.com/2017/day/23
// --- Day 23: Coprocessor Conflagration ---

(function() {

function newRegisters() {
  let registers = {};
  for (let i = 0; i < 8; ++i) {
    let name = String.fromCharCode('a'.charCodeAt(0) + i);
    registers[name] = 0;
  }
  return registers;
}

function simulate1(instructions, registers) {
  let mul_count = 0;

  function getValue(value) {
    if ('a' <= value && value <= 'z') {
      return registers[value] || 0;
    }
    return +value;
  }

  let watchdog = 0;
  for (let cp = 0; 0 <= cp && cp < instructions.length; ++cp) {
    if (watchdog++ == 1000000) {
      debugger;
      break;
    }

    let ins = instructions[cp];
    let op = ins[0];
    if (op == 'set') {
      registers[ins[1]] = getValue(ins[2]);
    } else if (op == 'sub') {
      registers[ins[1]] = getValue(ins[1]) - getValue(ins[2]);
    } else if (op == 'mul') {
      ++mul_count;
      registers[ins[1]] = getValue(ins[1]) * getValue(ins[2]);
    } else if (op == 'jnz') {
      if (getValue(ins[1]) != 0) {
        let offset = getValue(ins[2]);
        cp += offset - 1;
      }
    } else {
      console.assert(0, op);
    }
  }
  return mul_count;
}

function isPrime(x) {
  if (x == 2) return true;
  if (!(x % 2)) return false;
  for (let d = 3; d * d <= x; d += 2) {
    if (!(x % d)) return false;
  }
  return true;
}


function sumulate2() {
// Translate the input program into an equivalent code:
//
// --------------------------------------------------------
//
//   set b 57
//   set c b
//   jnz a 2
//   jnz 1 5
//   mul b 100
//   sub b -100000
//   set c b
//   sub c -17000
//   set f 1
//   set d 2
//   set e 2
//   set g d
//   mul g e
//   sub g b
//   jnz g 2
//   set f 0
//   sub e -1
//   set g e
//   sub g b
//   jnz g -8
//   sub d -1
//   set g d
//   sub g b
//   jnz g -13
//   jnz f 2
//   sub h -1
//   set g b
//   sub g c
//   jnz g 2
//   jnz 1 3
//   sub b -17
//   jnz 1 -23
//
// --------------------------------------------------------
//
//   let h = 0;
//   for (let b = 105700; b <= 122700; b += 17) {
//     let f = 1;
//     for (let d = 2; d <= b; ++d) {
//       for (let e = 2; e <= b; ++e) {
//         if (d * e == b) f = 0;
//       }
//     }
//     if (f == 0) ++h;
//   }
//   return h;
//
// --------------------------------------------------------

  // The code above just counts numbers in the range [105700, 122700]/17 that are NOT primes.
  let h = 0;
  for (let b = 105700; b <= 122700; b += 17) {
    if (!isPrime(b)) {
      ++h;
    }
  }
  return h;
}

function solve(input) {
  let instructions = input.trim().split('\n').map(str => str.split(/\s+/));

  let registers = newRegisters();
  let answer1 = simulate1(instructions, registers);
  let answer2 = sumulate2();

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(document.body.textContent);

})();

