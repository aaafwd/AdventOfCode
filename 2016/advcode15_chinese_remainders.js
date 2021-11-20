// https://adventofcode.com/2016/day/15
// --- Day 15: Timing is Everything ---
//
// Runtime: 1.3818359375 ms

(function() {
console.time('Runtime')

// Extended Euclidean algorithm.
// Returns [d, x0, y0] such that: d = a*x0 + b*y0
// All solutions are:
// x = x0 - (b/d) * N
// y = y0 + (a/d) * N
function gcdext(a, b) {
  if (b == 0) return [a, 1, 0];
  let [d, x, y] = gcdext(b, a % b);
  return [d, y, x - Math.floor(a / b) * y];
}

// Returns x such that: (a*x) % mod == 1,
// i.e. x = a^(-1) % mod
function gcdreverse(a, mod) {
  // a*x + mod*y=1
  let [d, x, y] = gcdext(a, mod);
  console.assert(d == 1);
  return x >= 0 ? x : x + mod;
}

// https://en.wikipedia.org/wiki/Chinese_remainder_theorem
function solveChineseRemainders(reminders, primes) {
  // Precondition: check all numbers in `primes` are relatively prime.
  for (let i = 0; i < primes.length; ++i) {
    for (let j = i + 1; j < primes.length; ++j) {
      let [d] = gcdext(primes[i], primes[j]);
      console.assert(d == 1);
    }    
  }

  // answer = x1 + x2*p1 + x3*p1*p2 + ... + + xk*p1*p2*...*p(k-1)
  // r[i][j] = primes[i]^(-1) mod primes[j]
  let r = [];
  for (let i = 0; i < primes.length; ++i) {
    r[i] = r[i] || [];
    for (let j = i + 1; j < primes.length; ++j) {
      r[i][j] = gcdreverse(primes[i], primes[j]);
    }
  }
  let x = [];
  for (let i = 0; i < primes.length; ++i) {
    x[i] = reminders[i];
    for (let j = 0; j < i; ++j) {
      x[i] = (r[j][i] * (x[i] - x[j])) % primes[i];
      if (x[i] < 0) x[i] += primes[i];
    }
  }
  let result = 0;
  let factor = 1;
  for (let i = 0; i < primes.length; ++i) {
    result += factor * x[i];
    factor *= primes[i];
  }
  return result;
}

function parseInput(input) {
  const regex = /^Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)\./;
  let lines = input.trim().split('\n');
  let discs = [];
  for (let line of lines) {
    let [, disc_num, size, offset] = line.match(regex).map(x => +x);
    console.assert(discs.length + 1 == disc_num, line);
    discs.push({size, offset});
  }
  return discs;
}

function solve(input) {
  let discs = parseInput(input);

  let remainders = [];
  let primes = [];

  function process({size, offset}, i) {
    // (x_time + i + 1 + offset) % size == 0
    // x_time % size = -(i + 1 + offset) % size
    let reminder = (size - ((i + 1 + offset) % size)) % size;
    remainders[i] = reminder;
    primes[i] = size;
  }
  discs.forEach(process);

  let answer1 = solveChineseRemainders(remainders, primes);
  console.log('Answer 1:', answer1);

  // Adding a new disc at the bottom.
  process({size: 11, offset: 0}, discs.length);
  let answer2 = solveChineseRemainders(remainders, primes);
  console.log('Answer 2:', answer2);
}

solve(`
Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.
`);

solve(document.body.textContent);

console.timeEnd('Runtime')
})();

