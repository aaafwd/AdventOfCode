[200~// https://adventofcode.com/2024/day/21
// --- Day 21: Keypad Conundrum ---
// Runtime: 6.126953125 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  return input.trim().split('\n').map(row => row.trim());
}

function mapsFindChar(map, ch) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == ch) return [x, y];
    }
  }
  console.assert(false, map, ch);
}

const numbericKeypad = [
  "789",
  "456",
  "123",
  " 0A"
];
const directionalKeypad = [
  " ^A",
  "<v>"  
];

function generateOnKeypadPaths(src, dst, isNumeric) {
  let map = isNumeric ? numbericKeypad : directionalKeypad;
  let [ex, ey] = mapsFindChar(map, dst);
  let generated = [];
  let current = [];
  function runGenerate(x, y) {
    if (x == ex && y == ey) {
      generated.push(current.join('') + 'A');
      return;
    }
    if (map[y][x] == ' ') return;
    if (x < ex) {
      current.push('>');
      runGenerate(x + 1, y, ex, ey, current);
      current.pop();
    }
    if (x > ex) {
      current.push('<');
      runGenerate(x - 1, y, ex, ey, current);
      current.pop();
    }
    if (y < ey) {
      current.push('v');
      runGenerate(x, y + 1, ex, ey, current);
      current.pop();
    }
    if (y > ey) {
      current.push('^');
      runGenerate(x, y - 1, ex, ey, current);
      current.pop();
    }
  }
  runGenerate(...mapsFindChar(map, src));
  console.assert(generated.length > 0);
  return generated;
}

class KeypadPath {
  constructor(path = "") {
    this.length = path.length;
    this.path = path;
  }

  append(other) {
    console.assert(other instanceof KeypadPath);
    this.length += other.length;
    if (this.path == null || other.path == null || this.length >= 1000) {
      this.path = null;
    } else {
      this.path += other.path;
    }
  }

  toString() {
    return this.path + " [" + this.length + "]";
  }
};

let keypadCaches = [];
function simulateRecursiveKeypads(code, index, numDirKeypads) {
  if (index > numDirKeypads) return new KeypadPath(code);

  let cache = null;
  if (index > 0) {
    let key = numDirKeypads - index;
    cache = keypadCaches[key] = keypadCaches[key] || new Map();
    if (cache.has(code)) return cache.get(code);
  }

  let isNumeric = (index == 0);
  let result = new KeypadPath("");
  let prev = 'A';
  for (let ch of code) {
    let paths = generateOnKeypadPaths(prev, ch, isNumeric);
    let minPath = paths
      .map(path => simulateRecursiveKeypads(path, index + 1, numDirKeypads))
      .sort((a, b) => a.length - b.length)[0];
    result.append(minPath);
    prev = ch;
  }
  if (cache != null) cache.set(code, result);
  return result;
}

function simulateAll(codes, numDirKeypads) {
  let result = 0;
  for (let code of codes) {
    let keypadPath = simulateRecursiveKeypads(code, 0, numDirKeypads);
    if (numDirKeypads <= 2) {
      console.log("\tcode:", code, "keypadPath:", keypadPath.toString());
    }
    let numCode = Number(code.replace('A', ''));
    result += keypadPath.length * numCode;
  }
  return result;
}

function solve(input) {
  let codes = parseInput(input);

  let answer1 = simulateAll(codes, 2);

  let answer2 = simulateAll(codes, 25);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
029A
980A
179A
456A
379A
`);

solve(document.body.textContent);

// Self test.
{
  let codes = parseInput(`
    340A
    149A
    582A
    780A
    463A
  `);
  console.assert(simulateAll(codes, 11) == 563909550);
  console.assert(simulateAll(codes, 12) == 1402763546);
  console.assert(simulateAll(codes, 14) == 8680719616);
  console.assert(simulateAll(codes, 15) == 21594112282);
  console.assert(simulateAll(codes, 16) == 53718519764);
  console.assert(simulateAll(codes, 17) == 133630883812);
  console.assert(simulateAll(codes, 18) == 332424457606);
  console.assert(simulateAll(codes, 19) == 826946673888);
  console.assert(simulateAll(codes, 25) == 195969155897936);
}

console.timeEnd('Runtime');
})();

