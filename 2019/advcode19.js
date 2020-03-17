(function() {

function assert(condition) {
  if (condition) return;
  console.assert.apply(console, arguments);
  debugger;
  throw new Error('Assertion failed');
}

class Program {
  constructor(bytecodes, initialInput = [], outputBuffer = undefined) {
    this.executor_ = this.makeExecutor_(bytecodes, initialInput, outputBuffer);
    this.lastResult_ = this.executor_.next();
  }

  isDone() {
    return this.lastResult_.done;
  }

  awaitsInput() {
    return !this.lastResult_.done && this.lastResult_.value === undefined;
  }

  awaitsOutput() {
    return !this.lastResult_.done && this.lastResult_.value !== undefined;
  }

  provideInput(value) {
    assert(this.awaitsInput(), this);
    this.lastResult_ = this.executor_.next(value);
  }

  consumeOutput() {
    assert(this.awaitsOutput(), this);
    const value = this.lastResult_.value;
    this.lastResult_ = this.executor_.next();
    return value;
  }

  * makeExecutor_(prog, input = [], output = undefined) {
    const modesCache = {};
    let i = 0;
    let relative_base = 0;
    let opcode = 99;
    let modes = [];

    function getArgument(argIndex) {
      const mode = modes[argIndex - 1] || 0;
      const index = i + argIndex;
      assert(0 <= index && index < prog.length, index, prog.length);
      if (mode == 0) {
        assert(0 <= prog[index], prog[index]);
        return prog[prog[index]] || 0;
      } else if (mode == 1) {
        return prog[index];
      } else if (mode == 2) {
        let relative_index = relative_base + prog[index];
        assert(0 <= relative_index, relative_base, prog[index]);
        return prog[relative_index] || 0;
      } else {
        assert(0, 'Wrong mode for getArgument: ', mode, index);
      }
    }

    function setArgument(argIndex, value) {
      const mode = modes[argIndex - 1] || 0;
      const index = i + argIndex;
      assert(0 <= index && index < prog.length, index, prog.length);
      if (mode == 0) {
        assert(0 <= prog[index], prog[index]);
        prog[prog[index]] = value;
      } else if (mode == 2) {
        let relative_index = relative_base + prog[index];
        assert(0 <= relative_index, relative_base, prog[index]);
        prog[relative_index] = value;
      } else {
        assert(0, 'Wrong mode for setArgument: ', mode, index);
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
      const modesCode = Math.floor(prog[i] / 100);
      modes = (modesCode in modesCache) ?
          modesCache[modesCode] :
          (modesCache[modesCode] = calcDecimals(modesCode));
      if (opcode == 1) {
        setArgument(3, getArgument(1) + getArgument(2));
        i += 4;
      } else if (opcode == 2) {
        setArgument(3, getArgument(1) * getArgument(2));
        i += 4;
      } else if (opcode == 3) {
        const value = input.length ? input.shift() : yield;
        assert(value != undefined, value);
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
      } else if (opcode == 99) {
        break;
      } else {
        assert(0, 'Wrong opcode: ', prog[i], i);
        break;
      }
    }
    assert(!input.length, 'Unconsumed input: ', input);
  }
}

function getPoint(prog, x, y) {
  let program = new Program(Array.from(prog));
  program.provideInput(x);
  program.provideInput(y);
  return program.consumeOutput();
}

function test(prog) {
  let affected = 0;
  for (let y = 0; y < 50; ++y) {
    for (let x = 0; x < 50; ++x) {
      let result = getPoint(prog, x, y);
      if (result) ++affected;
    }
  }
  console.log("Answer part 1:", affected);

  const SIZE = 100;
  for (let y = 2000 ;; ++y) {
    let [minx, maxx] = [-1, -1];
    for (let x = 0 ;; ++x) {
      let result = getPoint(prog, x, y);
      if (result) {
        if (minx == -1) minx = x;
        maxx = x;
      } else {
        if (minx != -1) break;
      }
    }
    if (maxx - minx - 1 < SIZE) continue;
    let h = 0;
    let x = maxx - SIZE + 1;
    for (; h < SIZE; ++h) {
      let result = getPoint(prog, x, y + h);
      if (!result) break;
    }
    if (h == SIZE) {
      console.log("Answer part 2:", x*10000+y);
      break;
    }
  }
}

test([109,424,203,1,21102,11,1,0,1106,0,282,21101,0,18,0,1106,0,259,1201,1,0,221,203,1,21102,1,31,0,1106,0,282,21101,0,38,0,1106,0,259,20102,1,23,2,21202,1,1,3,21101,1,0,1,21101,0,57,0,1105,1,303,2101,0,1,222,20101,0,221,3,21001,221,0,2,21102,1,259,1,21101,0,80,0,1105,1,225,21101,185,0,2,21102,91,1,0,1106,0,303,1202,1,1,223,21001,222,0,4,21102,259,1,3,21101,225,0,2,21102,1,225,1,21101,0,118,0,1106,0,225,20102,1,222,3,21102,1,131,2,21101,133,0,0,1106,0,303,21202,1,-1,1,22001,223,1,1,21101,148,0,0,1105,1,259,2101,0,1,223,21002,221,1,4,21002,222,1,3,21101,0,16,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21101,0,195,0,106,0,109,20207,1,223,2,20101,0,23,1,21102,1,-1,3,21101,0,214,0,1105,1,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,1201,-4,0,249,22101,0,-3,1,22101,0,-2,2,21201,-1,0,3,21101,0,250,0,1106,0,225,21201,1,0,-4,109,-5,2106,0,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2106,0,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,22102,1,-2,-2,109,-3,2105,1,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,21201,-2,0,3,21101,343,0,0,1106,0,303,1105,1,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,22101,0,-4,1,21102,384,1,0,1106,0,303,1105,1,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,21201,1,0,-4,109,-5,2106,0,0]);

})();
