// https://adventofcode.com/2021/day/24
// --- Day 24: Arithmetic Logic Unit ---
//
// Runtime: 955.10400390625 ms

(function() {
console.time('Runtime');

const kPower26 = (function() {
  let result = [1];
  for (let i = 0; i < 14; ++i) {
    result[i + 1] = result[i] * 26;
  }
  return result;
})();

function parseInput(input) {
  return input.trim().split('\n').map(row => row.trim().split(' '));
}

function solveReduced(constants, is_min = false) {
  function fastRunProgram(chunk_num, z, digit) {
    const [c4, c5, c15] = constants[chunk_num];
    let x = z % 26 + c5;
    if (c4 != 1) z = Math.trunc(z / c4);
    if (x != digit) {
      z *= 26;
      z += digit + c15;
    }
    return z;
  }

  let cache = new Map();
  cache.set(0, 0);

  const min_d = is_min ? 1 : 9;
  const diff_d = is_min ? 1 : -1;

  for (let i = 0; i < 14; ++i) {
    let new_cache = new Map();
    for (const [z, digits] of cache.entries()) {
      for (let d = min_d; 1 <= d && d <= 9; d += diff_d) {
        let new_z = fastRunProgram(i, z, d);
        if (new_z < 0) continue;
        if (new_z > kPower26[13 - i]) continue;
        if (new_cache.has(new_z)) continue;
        new_cache.set(new_z, digits * 10 + d);
      }
    }
    cache = new_cache;
  }

  return cache.get(0);
}

function splitIntoChunks(instructions) {
  let chunks = [];
  let chunk = [];
  for (let i = 0; i < instructions.length; ++i) {
    let cmd = instructions[i][0];
    if (cmd == 'inp') {
      if (chunk.length > 0) {
        chunks.push(chunk);
        chunk = [];
      }
    }
    chunk.push(instructions[i]);
  }
  chunks.push(chunk);
  console.assert(chunks.length == 14);
  return chunks;
}

// The input can be converted to the following reduced program:
//
// w := digit[i]
// x = z % 26 + c5
// z /= c4
// if (x != w) {
//   z *= 26;
//   z += w + c15;
// }
function reduceProgram(chunks) {
  let lens = chunks.map(chunk => chunk.length);
  console.assert(new Set(lens).size == 1);

  const chunk_len = lens[0];
  let diff_indexes = [];
  for (let i = 0; i < chunk_len; ++i) {
    let instr = chunks[0][i].join(' ');
    if (chunks.every(chunk => chunk[i].join(' ') == instr)) {
      continue; // Same instruction in every chunk.
    }
    diff_indexes.push(i);
  }
  console.assert(diff_indexes.length == 3);

  let constants = [];
  for (let i = 0; i < chunks.length; ++i) {
    let vars = [];
    for (let k of diff_indexes) {
      vars.push(+chunks[i][k][2]);
    }
    constants.push(vars)
  }
  return constants;
}

function solve(input) {
  let instructions = parseInput(input);
  let chunks = splitIntoChunks(instructions);
  let constants = reduceProgram(chunks);

  let answer1 = solveReduced(constants, false);
  let answer2 = solveReduced(constants, true);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

