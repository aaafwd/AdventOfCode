// https://adventofcode.com/2024/day/24
// --- Day 24: Crossed Wires ---
// Runtime: 6906.701171875 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let lines = input.trim().split('\n').map(row => row.trim()).filter(x => x);
  let regX = [];
  let regY = [];
  let gates = new Map();
  for (let line of lines) {
    let match;
    if (match = line.match(/^([xy])(\d+):\s*(\d+)$/)) {
      let [, reg, bit, value] = match;
      if (reg == 'x') regX[+bit] = +value;
      else if (reg == 'y') regY[+bit] = +value;
      else console.assert(false, line);
    } else if (match = line.match(/^(\S+) (\S+) (\S+) -> (\S+)$/)) {
      let[, a, op, b, name] = match;
      console.assert(!gates.has(name));
      gates.set(name, {a, op, b});
    } else {
      console.assert(false, line);
    }
  }
  return [gates, regX, regY];
}

const xNames = Array(100).fill(0).map((_, i) => 'x' + String(i).padStart(2, '0'));
const yNames = Array(100).fill(0).map((_, i) => 'y' + String(i).padStart(2, '0'));
const zNames = Array(100).fill(0).map((_, i) => 'z' + String(i).padStart(2, '0'));

function evaluate(gates, regX, regY, skipBits = []) {
  let cache = new Map();
  let regZ = [];
  for (let i = 0; i < regX.length; ++i) cache.set(xNames[i], regX[i]);
  for (let i = 0; i < regY.length; ++i) cache.set(yNames[i], regY[i]);
  for (let i = 0;; ++i) {
    let name = zNames[i];
    if (!gates.has(name)) break;
    if (skipBits[i]) continue;
    regZ[i] = evaluateByName_(name, gates, cache);
    if (regZ[i] == -1) return null;
  }
  return regZ;

  function evaluateByName_(name, gates, cache, cyclic = new Set()) {
    if (cache.has(name)) return cache.get(name);
    if (cyclic.has(name)) return -1;
    cyclic.add(name);

    let {a, op, b} = gates.get(name);
    let valueA = evaluateByName_(a, gates, cache, cyclic);
    if (valueA == -1) return -1;
    let valueB = evaluateByName_(b, gates, cache, cyclic);
    if (valueB == -1) return -1;

    let value;
    if (op == "AND") value = valueA & valueB;
    else if (op == "OR") value = valueA | valueB;
    else if (op == "XOR") value = valueA ^ valueB;
    else console.assert(false, op);

    cyclic.delete(name);
    cache.set(name, value);
    return value;
  }
}

function evaluateAndUpdateMismatchedBitsMask(gates, regX, regY, mask) {
  let regZ = evaluate(gates, regX, regY, mask);
  if (regZ == null) return false;
  let sum = 0;
  for (let i = 0; i < regZ.length; ++i) {
    if (i < regX.length) sum += regX[i];
    if (i < regY.length) sum += regY[i];
    if (regZ[i] != (sum & 1)) mask[i] = 1;
    sum >>= 1;
  }
  return true;
}

function getMismatchedBitsCount(gates, regX, regY) {
  let mask = [];

  for (let offset = 2; offset <= 4; ++offset) {
    regX = regX.map(_ => 0);
    regY = regY.map(_ => 0);
    for (let i = offset; i < regX.length; i += 3) {
      regX[i - 2] = 1;
      regX[i - 1] = 1;
      regY[i - 2] = 1;
      regY[i - 1] = 0;
    }
    if (!evaluateAndUpdateMismatchedBitsMask(gates, regX, regY, mask)) return Infinity;
    if (!evaluateAndUpdateMismatchedBitsMask(gates, regY, regX, mask)) return Infinity;
    if (!evaluateAndUpdateMismatchedBitsMask(gates, regX, regX, mask)) return Infinity;
  }

  regX = regX.map(_ => 0);
  regY = regY.map(_ => 0);
  if (!evaluateAndUpdateMismatchedBitsMask(gates, regX, regY, mask)) return Infinity;

  regX = regX.map((_, i) => (i & 1));
  regY = regY.map((_, i) => 0);
  if (!evaluateAndUpdateMismatchedBitsMask(gates, regX, regY, mask)) return Infinity;
  if (!evaluateAndUpdateMismatchedBitsMask(gates, regY, regX, mask)) return Infinity;
  if (!evaluateAndUpdateMismatchedBitsMask(gates, regX, regX, mask)) return Infinity;

  regX = regX.map((_, i) => (i & 1) ? 0 : 1);
  regY = regY.map((_, i) => 0);
  if (!evaluateAndUpdateMismatchedBitsMask(gates, regX, regY, mask)) return Infinity;
  if (!evaluateAndUpdateMismatchedBitsMask(gates, regY, regX, mask)) return Infinity;
  if (!evaluateAndUpdateMismatchedBitsMask(gates, regX, regX, mask)) return Infinity;

  let count = 0;
  for (let i = 0; i < mask.length; ++i) {
    if (mask[i]) ++count;
  }
  return count;
}

function fixAddProgramBySwappingGates(gates, regX, regY) {
  let queue = [];
  let gateNames = Array.from(gates.keys());
  let baseMismatchedBitsCount = getMismatchedBitsCount(gates, regX, regY);
  queue.push({
    mismatchedBitsCount: baseMismatchedBitsCount,
    swapped: new Set(),
    swapPairs: []
  });
  let discardedSwaps = [];
  while (queue.length > 0) {
    queue.sort((b, a) => {
      let diff = a.mismatchedBitsCount - b.mismatchedBitsCount;
      if (diff != 0) return diff;
      diff = a.swapped.size - b.swapped.size;
      return diff;
    });
    let {mismatchedBitsCount, swapped, swapPairs} = queue.pop();
    console.log("\titerating mismatchedBitsCount:", mismatchedBitsCount,
                "swapped:", String(Array.from(swapped)));
    for (let [gate1, gate2] of swapPairs) {
      swapGates_(gate1, gate2);
    }
    for (let i = 0; i < gateNames.length; ++i) {
      let gate1 = gateNames[i];
      if (swapped.has(gate1)) continue;
      discardedSwaps[i] = discardedSwaps[i] || [];
      for (let j = i + 1; j < gateNames.length; ++j) {
        if (discardedSwaps[i][j]) continue;
        let gate2 = gateNames[j];
        if (swapped.has(gate2)) continue;

        swapGates_(gate1, gate2);
        let newCount = getMismatchedBitsCount(gates, regX, regY);
        if (newCount < mismatchedBitsCount) {
          let newSwapped = new Set(swapped);
          newSwapped.add(gate1);
          newSwapped.add(gate2);
          console.log("\tenqueue mismatchedBitsCount:", newCount,
                      "swapped:", String(Array.from(newSwapped)));
          if (newCount == 0) {
            return Array.from(newSwapped).sort().join(',');
          }
          if (newSwapped.size == 8) continue;
          let newSwapPairs = swapPairs.slice();
          newSwapPairs.push([gate1, gate2]);
          queue.push({
            mismatchedBitsCount: newCount,
            swapped: newSwapped,
            swapPairs: newSwapPairs
          });
        }
        if (swapped.size == 0 && newCount > baseMismatchedBitsCount) {
          discardedSwaps[i][j] = true;
        }
        swapGates_(gate1, gate2);
      }
    }
    for (let [gate1, gate2] of swapPairs) {
      swapGates_(gate1, gate2);
    }
  }
  return null;

  function swapGates_(gate1, gate2) {
    let val1 = gates.get(gate1);
    let val2 = gates.get(gate2);
    console.assert(val1 && val2);
    gates.set(gate1, val2);
    gates.set(gate2, val1);
  }
}

function solve(input, fixAddProgram) {
  let [gates, regX, regY] = parseInput(input);

  let answer1 = evaluate(gates, regX, regY);
  answer1 = parseInt(answer1.reverse().join(''), 2);
  console.log('Answer 1:', answer1);

  if (fixAddProgram) {
    let answer2 = fixAddProgramBySwappingGates(gates, regX, regY);
    console.log('Answer 2:', answer2);
  }
}

solve(`
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02
`);

solve(`
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj
`);

solve(`
x00: 0
x01: 1
x02: 0
x03: 1
x04: 0
x05: 1
y00: 0
y01: 0
y02: 1
y03: 1
y04: 0
y05: 1

x00 AND y00 -> z05
x01 AND y01 -> z02
x02 AND y02 -> z01
x03 AND y03 -> z03
x04 AND y04 -> z04
x05 AND y05 -> z00
`);

solve(document.body.textContent, true);

console.timeEnd('Runtime');
})();

