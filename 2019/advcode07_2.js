(function(){

class Program {
  constructor(bytecodes, initialInput = [], outputBuffer = undefined) {
    this.outputBuffer_ = outputBuffer;
    this.lastResult_ = null;
    this.executor_ = this.makeExecutor_(bytecodes, initialInput, outputBuffer);
  }

  isDone() {
    return this.lastResult_ != null && this.lastResult_.done;
  }

  awaitsInput() {
    return this.lastResult_ != null && !this.lastResult_.done &&
        this.lastResult_.value === undefined;
  }

  awaitsOutput() {
    return this.lastResult_ != null && !this.lastResult_.done &&
        this.lastResult_.value !== undefined;
  }

  provideInput(value) {
    if (this.lastResult_ == null) {
      this.run();
    }
    console.assert(this.awaitsInput(), this);
    this.lastResult_ = this.executor_.next(value);
  }

  consumeOutput() {
    if (this.lastResult_ == null) {
      this.run();
    }
    console.assert(this.outputBuffer_ == undefined, this);
    console.assert(this.awaitsOutput(), this);
    const value = this.lastResult_.value;
    this.lastResult_ = this.executor_.next();
    return value;
  }

  run() {
    console.assert(!this.isDone(), this);
    console.assert(!this.awaitsInput(), this);
    console.assert(!this.awaitsOutput(), this);
    this.lastResult_ = this.executor_.next();
  }

  runSync() {
    this.run();
    console.assert(this.isDone(), this);
  }

  * makeExecutor_(prog, input = [], output = undefined) {
    let i = 0;
    let relative_base = 0;
    let opcode = 99;
    let modes = [];

    function getArgument(argIndex) {
      const mode = modes[argIndex - 1] || 0;
      const index = i + argIndex;
      console.assert(0 <= index && index < prog.length, index, prog.length);
      if (mode == 0) {
        console.assert(0 <= prog[index]);
        return prog[prog[index]] || 0;
      } else if (mode == 1) {
        return prog[index];
      } else if (mode == 2) {
        console.assert(0 <= relative_base + prog[index]);
        return prog[relative_base + prog[index]] || 0;
      } else {
        console.assert(0, 'Wrong mode for getArgument: ', mode, index);
      }
    }

    function setArgument(argIndex, value) {
      const mode = modes[argIndex - 1] || 0;
      const index = i + argIndex;
      console.assert(0 <= index && index < prog.length, index, prog.length);
      if (mode == 0) {
        console.assert(0 <= prog[index]);
        prog[prog[index]] = value;
      } else if (mode == 2) {
        console.assert(0 <= relative_base + prog[index]);
        prog[relative_base + prog[index]] = value;
      } else {
        console.assert(0, 'Wrong mode for setArgument: ', mode, index);
      }
    }

    function calcDecimals(x) {
      let result = [];
      while (x) {
        result.push(x % 10);
        x = Math.floor(x / 10);
      }
      return result;
    }

    while (i < prog.length) {
      opcode = prog[i] % 100;
      modes = calcDecimals(Math.floor(prog[i] / 100));
      if (opcode == 99) break;
      if (opcode == 1) {
        setArgument(3, getArgument(1) + getArgument(2));
        i += 4;
      } else if (opcode == 2) {
        setArgument(3, getArgument(1) * getArgument(2));
        i += 4;
      } else if (opcode == 3) {
        const value = input.length ? input.shift() : yield;
        console.assert(value != undefined, value);
        setArgument(1, value);
        i += 2;
      } else if (opcode == 4) {
        const value = getArgument(1);
        if (output) {
          output.push(value);
        } else {
          yield value;
        }
        i += 2;
      } else if (opcode == 5) {
        if (getArgument(1)) {
          i = getArgument(2);
        } else {
          i += 3;
        }
      } else if (opcode == 6) {
        if (!getArgument(1)) {
          i = getArgument(2);
        } else {
          i += 3;
        }
      } else if (opcode == 7) {
        if (getArgument(1) < getArgument(2)) {
          setArgument(3, 1);
        } else {
          setArgument(3, 0);
        }
        i += 4;
      } else if (opcode == 8) {
        if (getArgument(1) == getArgument(2)) {
          setArgument(3, 1);
        } else {
          setArgument(3, 0);
        }
        i += 4;
      } else if (opcode == 9) {
        relative_base += getArgument(1);
        i += 2;
      } else {
        console.assert(0, 'Wrong opcode: ', prog[i], i);
        break;
      }
    }
    console.assert(!input.length, 'Unconsumed input: ', input);
  }
}

function permutations(n) {
    let result = [];
    let current = Array(n);
    let mask = Array(n).fill(0);
    function gen(i) {
        if (i == n) {
            result.push(Array.from(current));
            return;
        }
        for (let k = 0; k < n; ++k) {
            if (mask[k]) continue;
            mask[k] = 1;
            current[i] = k;
            gen(i + 1);
            mask[k] = 0;
        }
    }
    gen(0);
    return result;
}

function test(prog) {
  let perms = permutations(5);
  let best = -1;
  for (let perm of perms) {
    let programs = [];
    for (let i = 0; i < perm.length; ++i) {
      let input = [perm[i] + 5];
      programs.push(new Program(Array.from(prog), input));
    }
    let last = 0;
    let amp_e = -1;
    for (let i = 0; i < programs.length; ++i) {
      let program = programs[i];
      if (program.isDone()) break;
      program.provideInput(last);
      last = program.consumeOutput();
      if (i == programs.length - 1) {
        amp_e = last;
        i = -1;
      }
    }
    if (best < amp_e) {
      best = amp_e;
    }
  }
  console.log(best);
  return best;
}

test([3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5]);

test([3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10]);

test([3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0]);
test([3,23,3,24,1002,24,10,24,1002,23,-1,23,
101,5,23,23,1,24,23,23,4,23,99,0,0]);
test([3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
]);

test([3,8,1001,8,10,8,105,1,0,0,21,42,67,84,109,122,203,284,365,446,99999,3,9,1002,9,3,9,1001,9,5,9,102,4,9,9,1001,9,3,9,4,9,99,3,9,1001,9,5,9,1002,9,3,9,1001,9,4,9,102,3,9,9,101,3,9,9,4,9,99,3,9,101,5,9,9,1002,9,3,9,101,5,9,9,4,9,99,3,9,102,5,9,9,101,5,9,9,102,3,9,9,101,3,9,9,102,2,9,9,4,9,99,3,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99]);

})();
