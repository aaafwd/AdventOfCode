(function() {

class Program {
  constructor(bytecodes, initialInput = [], outputBuffer = undefined) {
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
    console.assert(this.awaitsOutput(), this);
    const value = this.lastResult_.value;
    console.assert(value !== undefined, this);
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

function test(bytecodes) {
  let map = [[1]];
  let map90 = [];
  let [x, y, dx, dy] = [0, 0, -1, 0];
  let paints = 0;
  let program = new Program(bytecodes);
  while (!program.isDone()) {
      if (program.awaitsInput()) {
        map[y] = map[y] || [];
        map90[x] = map90[x] || []
        let value = map[y][x] || 0;
        program.provideInput(value);
      } else if (program.awaitsOutput()) {
        let value = program.consumeOutput();
        map[y] = map[y] || [];
        map90[x] = map90[x] || []
        if (map[y][x] == undefined) {
          ++ paints;
        }
        map90[x][y] = map[y][x] = value;

        value = program.consumeOutput();
        console.assert(value === 0 || value === 1, value);
        if (value == 0) {
            [dx, dy] = [dy, -dx];  // left
        } else {
            [dx, dy] = [-dy, dx];  // right
        }
        x += dx;
        y += dy;
      } else {
        program.run();
      }
  }
  let Y = 0;
  for (let x = 0; x < map90.length; ++x) {
    let arr = [];
    for (let y = 0; y >= -42; --y) {
      arr.push(map90[x][y] == 1 ? "#" : " ");
    }
    console.log(x, arr.join(""));
  }
  return paints;
}

console.log(test([3,8,1005,8,336,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,101,0,8,28,1006,0,36,1,2,5,10,1006,0,57,1006,0,68,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1002,8,1,63,2,6,20,10,1,106,7,10,2,9,0,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,1,8,10,4,10,102,1,8,97,1006,0,71,3,8,1002,8,-1,10,101,1,10,10,4,10,108,1,8,10,4,10,1002,8,1,122,2,105,20,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,101,0,8,148,2,1101,12,10,1006,0,65,2,1001,19,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,101,0,8,181,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,0,10,4,10,1002,8,1,204,2,7,14,10,2,1005,20,10,1006,0,19,3,8,102,-1,8,10,101,1,10,10,4,10,108,1,8,10,4,10,102,1,8,236,1006,0,76,1006,0,28,1,1003,10,10,1006,0,72,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,102,1,8,271,1006,0,70,2,107,20,10,1006,0,81,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,1,8,10,4,10,1002,8,1,303,2,3,11,10,2,9,1,10,2,1107,1,10,101,1,9,9,1007,9,913,10,1005,10,15,99,109,658,104,0,104,1,21101,0,387508441896,1,21102,1,353,0,1106,0,457,21101,0,937151013780,1,21101,0,364,0,1105,1,457,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21102,179490040923,1,1,21102,411,1,0,1105,1,457,21101,46211964123,0,1,21102,422,1,0,1106,0,457,3,10,104,0,104,0,3,10,104,0,104,0,21101,838324716308,0,1,21101,0,445,0,1106,0,457,21102,1,868410610452,1,21102,1,456,0,1106,0,457,99,109,2,22101,0,-1,1,21101,40,0,2,21101,0,488,3,21101,478,0,0,1106,0,521,109,-2,2105,1,0,0,1,0,0,1,109,2,3,10,204,-1,1001,483,484,499,4,0,1001,483,1,483,108,4,483,10,1006,10,515,1101,0,0,483,109,-2,2105,1,0,0,109,4,2101,0,-1,520,1207,-3,0,10,1006,10,538,21101,0,0,-3,22102,1,-3,1,21202,-2,1,2,21101,0,1,3,21101,557,0,0,1105,1,562,109,-4,2105,1,0,109,5,1207,-3,1,10,1006,10,585,2207,-4,-2,10,1006,10,585,22101,0,-4,-4,1106,0,653,21201,-4,0,1,21201,-3,-1,2,21202,-2,2,3,21102,604,1,0,1106,0,562,21202,1,1,-4,21101,0,1,-1,2207,-4,-2,10,1006,10,623,21102,0,1,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,645,21202,-1,1,1,21101,0,645,0,106,0,520,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0]));

})();

