// https://adventofcode.com/2020/day/13

(function() {

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

function solve(input) {
  let buses = input.trim().split(/[\n,]/).map(x => x == 'x' ? 0 : +x);
  const timestamp = buses.shift();

  if (timestamp) {
    let min = Infinity, busId;
    for (let id of buses) {
      if (id == 0) continue;
      let departure = Math.ceil(timestamp / id) * id;
      if (min > departure) {
        min = departure;
        busId = id;
      }
    }
    console.log("Answer 1:", (min - timestamp) * busId);
  }

  // Check all bus IDs are relatively prime.
  for (let i = 0; i < buses.length; ++i) {
    if (!buses[i]) continue;
    for (let j = i + 1; j < buses.length; ++j) {
      if (!buses[j]) continue;
      let [d] = gcdext(buses[i], buses[j]);
      console.assert(d == 1);
    }    
  }

  let remainders = [];
  let primes = [];
  for (let i = 0; i < buses.length; ++i) {
    if (!buses[i]) continue;
    remainders.push((buses[i] - i) % buses[i]);
    primes.push(buses[i]);
  }
  let answer2 = solveChineseRemainders(remainders, primes);
  console.log("Answer 2:", answer2);
}

solve(`
939
7,13,x,x,59,x,31,19
`);

solve(`
0
17,x,13,19
`);

solve(`
0
67,7,59,61
`);

solve(`
0
67,x,7,59,61
`);

solve(`
0
67,7,x,59,61
`);

solve(`
0
1789,37,47,1889
`);

solve(document.body.textContent);

})();

