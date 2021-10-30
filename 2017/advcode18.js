// https://adventofcode.com/2017/day/18
// --- Day 18: Duet ---

(function() {

class Program {
  constructor(id, instructions, input = [], output = []) {
    this.executor_ = this.makeExecutor_(id, instructions, input, output);
    this.lastResult_ = this.executor_.next();
  }

  awaits() {
    return !this.lastResult_.done;
  }

  resume() {
    console.assert(this.awaits());
    this.lastResult_ = this.executor_.next();
  }

  outputCount() {
    return this.lastResult_.value;
  }

  * makeExecutor_(id, instructions, input, output) {
    let registers = {p: id};
    let outputCount = 0;

    function getValue(value) {
      if ('a' <= value && value <= 'z') {
        return registers[value] || 0;
      }
      return +value;
    }

    for (let cp = 0; 0 <= cp && cp < instructions.length; ++cp) {
      let ins = instructions[cp];
      let op = ins[0];
      if (op == 'snd') {
        output.push(getValue(ins[1]));
        ++outputCount;
      } else if (op == 'set') {
        registers[ins[1]] = getValue(ins[2]);
      } else if (op == 'add') {
        registers[ins[1]] = getValue(ins[1]) + getValue(ins[2]);
      } else if (op == 'mul') {
        registers[ins[1]] = getValue(ins[1]) * getValue(ins[2]);
      } else if (op == 'mod') {
        registers[ins[1]] = getValue(ins[1]) % getValue(ins[2]);
      } else if (op == 'rcv') {
        while (input.length == 0) {
          yield outputCount; // Interrupt the program.
        }
        registers[ins[1]] = input.shift();
      } else if (op == 'jgz') {
        if (getValue(ins[1]) > 0) {
          let offset = getValue(ins[2]);
          cp += offset - 1;
        }
      } else {
        console.assert(0, op);
      }
    }
    return outputCount;
  }
}

function simulate1(instructions) {
  let registers = {};
  let frequency = -1;

  function getValue(value) {
    if ('a' <= value && value <= 'z') {
      return registers[value] || 0;
    }
    return +value;
  }

  for (let cp = 0; 0 <= cp && cp < instructions.length; ++cp) {
    let ins = instructions[cp];
    let op = ins[0];
    if (op == 'snd') {
      frequency = getValue(ins[1]);
    } else if (op == 'set') {
      registers[ins[1]] = getValue(ins[2]);
    } else if (op == 'add') {
      registers[ins[1]] = getValue(ins[1]) + getValue(ins[2]);
    } else if (op == 'mul') {
      registers[ins[1]] = getValue(ins[1]) * getValue(ins[2]);
    } else if (op == 'mod') {
      registers[ins[1]] = getValue(ins[1]) % getValue(ins[2]);
    } else if (op == 'rcv') {
      if (getValue(ins[1]) != 0) {
        break;
      }
    } else if (op == 'jgz') {
      if (getValue(ins[1]) > 0) {
        let offset = getValue(ins[2]);
        cp += offset - 1;
      }
    } else {
      console.assert(0, op);
    }
  }
  return frequency;
}

function simulate2(instructions) {
  let queue1 = [], queue2 = [];
  let p1 = new Program(0, instructions, queue1, queue2);
  let p2 = new Program(1, instructions, queue2, queue1);
  while (p1.awaits() && p2.awaits() && queue1.length + queue2.length > 0) {
    p1.resume();
    p2.resume();
  }
  return p2.outputCount();
}

function solve(input) {
  let instructions = input.trim().split('\n').map(str => str.split(/\s+/));
  let answer1 = simulate1(instructions);
  let answer2 = simulate2(instructions);
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2
`)

solve(`
snd 1
snd 2
snd p
rcv a
rcv b
rcv c
rcv d
`);

solve(document.body.textContent);

})();

