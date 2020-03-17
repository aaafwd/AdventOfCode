(function(){

function verify(prog, index) {
  console.assert(0 <= index);
  console.assert(index < prog.length);
  console.assert(0 <= prog[index]);
  console.assert(prog[index] < prog.length);
}

function getModes(x) {
    let result = [];
    while (x) {
        result.push(x % 10);
        x = Math.floor(x / 10);
    }
    return result;
}

function getArgument(prog, modes, opcodeIndex, argIndex) {
    const mode = modes[argIndex - 1] || 0;
    const index = opcodeIndex + argIndex;
    if (mode == 0) {
        verify(prog, index);
        return prog[prog[index]];
    } else if (mode == 1) {
        return prog[index];
    } else {
        console.assert(0, mode, index);
    }
}

function run(prog, input, output) {
  for (let i = 0; i < prog.length;) {
    const opcode = prog[i] % 100;
    let modes = getModes(Math.floor(prog[i] / 100));
    if (opcode == 99) break;
    if (opcode == 1) {
      prog[prog[i+3]] = getArgument(prog, modes, i, 1) + getArgument(prog, modes, i, 2);
      i += 4;
    } else if (opcode == 2) {
      prog[prog[i+3]] = getArgument(prog, modes, i, 1) * getArgument(prog, modes, i, 2);
      i += 4;
    } else if (opcode == 3) {
        console.assert(input.length);
        prog[prog[i+1]] = input.shift();
        i += 2;
    } else if (opcode == 4) {
        output.push(getArgument(prog, modes, i, 1));
        i += 2;
    } else if (opcode == 5) {
        if (getArgument(prog, modes, i, 1)) {
            i = getArgument(prog, modes, i, 2);
        } else {
            i += 3;
        }
    } else if (opcode == 6) {
        if (!getArgument(prog, modes, i, 1)) {
            i = getArgument(prog, modes, i, 2);
        } else {
            i += 3;
        }
    } else if (opcode == 7) {
        if (getArgument(prog, modes, i, 1) < getArgument(prog, modes, i, 2)) {
            prog[prog[i+3]] = 1;
        } else {
            prog[prog[i+3]] = 0;
        }
        i += 4;
    } else if (opcode == 8) {
        if (getArgument(prog, modes, i, 1) == getArgument(prog, modes, i, 2)) {
            prog[prog[i+3]] = 1;
        } else {
            prog[prog[i+3]] = 0;
        }
        i += 4;
    } else {
      console.assert(0, prog[i]);
      break;
    }
  }
  return prog[0];
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
        let result = 0;
        for (let i = 0; i < perm.length; ++i) {
            let input = [perm[i], result];
            let output = [];
            run(Array.from(prog), input, output);
            console.assert(output.length == 1);
            result = output[0];
        }
        if (best < result) {
            best = result;
        }
    }
    console.log(best);
    return best;
}


// test([3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0]);
// test([3,23,3,24,1002,24,10,24,1002,23,-1,23,
// 101,5,23,23,1,24,23,23,4,23,99,0,0]);
// test([3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
// 1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
// ]);

test([3,8,1001,8,10,8,105,1,0,0,21,42,67,84,109,122,203,284,365,446,99999,3,9,1002,9,3,9,1001,9,5,9,102,4,9,9,1001,9,3,9,4,9,99,3,9,1001,9,5,9,1002,9,3,9,1001,9,4,9,102,3,9,9,101,3,9,9,4,9,99,3,9,101,5,9,9,1002,9,3,9,101,5,9,9,4,9,99,3,9,102,5,9,9,101,5,9,9,102,3,9,9,101,3,9,9,102,2,9,9,4,9,99,3,9,101,2,9,9,1002,9,3,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99]);

})();
