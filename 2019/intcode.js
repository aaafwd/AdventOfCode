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

function test(prog, input = []) {
  let output = [];
  console.assert(new Program(prog, input, output).isDone());
  console.log(output);
}

console.log(test([109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99]));
console.log(test([1102, 34915192, 34915192, 7, 4, 7, 99, 0]));
console.log(test([104, 1125899906842624, 99]));
})();
