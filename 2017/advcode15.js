// https://adventofcode.com/2017/day/15
// --- Day 15: Dueling Generators ---

(function() {
console.time("Runtime");

function calcMatches1(a, b) {
  let rounds = 40000000;
  let matches = 0;
  a = BigInt(a);
  b = BigInt(b);
  let factorA = BigInt(16807);
  let factorB = BigInt(48271);
  let mod = BigInt(2147483647);
  let mask = BigInt(0xffff);

  for (let i = 0; i < rounds; ++i) {
    a  = (a * factorA) % mod;
    b  = (b * factorB) % mod;
    if ((a & mask) == (b & mask)) ++matches;
  }

  return matches;
}

function calcMatches2(a, b) {
  let rounds = 5000000;
  let matches = 0;
  a = BigInt(a);
  b = BigInt(b);
  let factorA = BigInt(16807);
  let factorB = BigInt(48271);
  let mod = BigInt(2147483647);
  let mask = BigInt(0xffff);

  let mask_mult4 = BigInt(3);
  let mask_mult8 = BigInt(7);

  for (let i = 0; i < rounds; ++i) {
    while (1) {
      a  = (a * factorA) % mod;
      if ((a & mask_mult4) == 0) break;
    }
    while (1) {
      b  = (b * factorB) % mod;
      if ((b & mask_mult8) == 0) break;
    }
    if ((a & mask) == (b & mask)) ++matches;
  }
  return matches;
}

function solve(a, b) {
  console.log("\tSolving 1 for:", a, b);
  let answer1 = calcMatches1(a, b);
  console.log("\tSolving 2 for:", a, b);
  let answer2 = calcMatches2(a, b);;
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

// solve(65, 8921);
solve(722, 354);

console.timeEnd("Runtime");
})();

