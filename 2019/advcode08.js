(function() {

function verify(prog, index, relative_base) {
  console.assert(0 <= index);
  console.assert(index < prog.length);
  console.assert(0 <= relative_base + prog[index]);
  console.assert(relative_base + prog[index] < prog.length);
}

function getModes(x) {
  let result = [];
  while (x) {
    result.push(x % 10);
    x = Math.floor(x / 10);
  }
  return result;
}

function* genrun(prog, input) {
  let i = 0;
  let relative_base = 0;
  let opcode = 99;
  let modes = [];

  function getArgument(argIndex) {
    const mode = modes[argIndex - 1] || 0;
    const index = i + argIndex;
    if (mode == 0) {
      verify(prog, index, 0);
      return prog[prog[index]];
    } else if (mode == 1) {
      return prog[index];
    } else if (mode == 2) {
      verify(prog, index, relative_base);
      return prog[relative_base + prog[index]];
    } else {
      console.assert(0, mode, index);
    }
  }

  function setArgument(argIndex, value) {
    const mode = modes[argIndex - 1] || 0;
    const index = i + argIndex;
    if (mode == 0) {
      verify(prog, index, 0);
      prog[prog[index]] = value;
    } else if (mode == 1) {
      console.assert(0, 'Wrong mode for setArgument: ', mode, index);
    } else if (mode == 2) {
      verify(prog, index, relative_base);
      prog[relative_base + prog[index]] = value;
    } else {
      console.assert(0, mode, index);
    }
  }

  while (i < prog.length) {
    opcode = prog[i] % 100;
    modes = getModes(Math.floor(prog[i] / 100));
    if (opcode == 99) break;
    if (opcode == 1) {
      setArgument(3, getArgument(1) + getArgument(2));
      i += 4;
    } else if (opcode == 2) {
      setArgument(3, getArgument(1) * getArgument(2));
      i += 4;
    } else if (opcode == 3) {
      setArgument(1, input.length ? input.shift() : yield);
      i += 2;
    } else if (opcode == 4) {
      yield getArgument(1);
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
      console.assert(0, prog[i]);
      break;
    }
  }
  return prog[0];
}

function run(prog, input, output) {}

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
    let generators = [];
    for (let i = 0; i < perm.length; ++i) {
      let input = [perm[i] + 5];
      let gen = genrun(Array.from(prog), input);
      console.assert(!gen.next().done);
      generators.push(gen);
    }
    let last = 0;
    let amp_e = -1;
    for (let i = 0; i < generators.length; ++i) {
      let gen = generators[i];
      let res = gen.next(last);
      if (res.done) {
        break;
      }
      console.assert(res.value != undefined, res);
      last = res.value;
      if (i == generators.length - 1) {
        amp_e = last;
        i = -1;
      }
      gen.next();
    }
    if (best < amp_e) {
      best = amp_e;
    }
  }
  console.log(best);
  return best;
}

})();
