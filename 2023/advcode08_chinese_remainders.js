// https://adventofcode.com/2023/day/8
// --- Day 8: Haunted Wasteland ---

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

// Will also resolve any non co-primes in `primes`.
// Returns `null` if there is no solution.
// https://en.wikipedia.org/wiki/Chinese_remainder_theorem
function solveChineseRemainders(reminders, primes) {
  reminders = reminders.slice();
  primes = primes.slice();
  while (1) {
    for (let i = 0; i < primes.length; ++i) {
      if (primes[i] == 1) {
        primes.splice(i, 1);
        reminders.splice(i, 1);
      }
    }
    let changed = false;
    for (let i = 0; i < primes.length; ++i) {
      for (let j = i + 1; j < primes.length; ++j) {
        let [d] = gcdext(primes[i], primes[j]);
        if (d == 1) continue;
        let newR = reminders[i] % d;
        if (newR != (reminders[j] % d)) {
          console.warn("No solution for: X ≡ %d (mod %d), X ≡ %d (mod %d), " +
                       "with common divisor %d", reminders[i], primes[i],
                       reminders[j], primes[j], d);
          return null;
        }
        primes[i] /= d;
        primes[j] /= d;
        reminders.push(newR);
        primes.push(d);
        changed = true;
        i = j = primes.length;
        break;
      }
    }
    if (!changed) break;
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

//       +-<---<---<-+
//       |           |
// A->-Z-+->-Z->-Z->-+
//
// Returns: Array[[offset, period]], such that the final node is reached after
//          `offset + period * k` steps, where k >= 0, and period can be ZERO.
function countStepsToFinalZ(current, moves, map) {
  let stops = [];
  let steps = 0;
  let path = {};

  while (1) {
    let index = steps % moves.length;
    let key = current + index;
    if (key in path) {
      let period = steps - path[key];
      let periodStart = path[key];
      return stops.map(stop => [stop, stop < periodStart ? 0 : period]);
    }
    path[key] = steps;

    let dir = moves[index];
    steps++;
    let node = map[current];
    current = (dir == 'L') ? node[0] : node[1];
    if (current.endsWith('Z')) stops.push(steps);
  }
  
}

function parseInput(input) {
  let [moves, lines] = input.trim().split('\n\n');
  lines = lines.trim()
    .split('\n')
    .map(line => line.trim().split(/[\s=(),]+/).filter(x => x));
  let map = {};
  for (let nodes of lines) {
    let start = nodes.shift();
    map[start] = nodes;
  }
  return [moves.trim().split(''), map];
}

function solve1(input) {
  let [moves, map] = parseInput(input);

  let steps = 0;
  let current = 'AAA';
  while (1) {
    let dir = moves[steps % moves.length];
    steps++;
    let node = map[current];
    console.assert(node);
    current = (dir == 'L') ? node[0] : node[1];
    if (current == 'ZZZ') break;
  }

  console.log('Answer 1:', steps);
}

function solve2(input) {
  let [moves, map] = parseInput(input);

  let steps = 0;
  let starts = Object.keys(map)
    .filter(node => node.endsWith('A'))
    .map(start => countStepsToFinalZ(start, moves, map));

  // SHORTCUT HACK! Observed the input to satisfy the following condition:
  let periods = starts
    .map(arrays => arrays.filter(([offset, period]) => offset == period))
    .map(arrays => {
      console.assert(arrays.length == 1);
      return arrays[0][0];
    });

  let answer2 = solveChineseRemainders(periods, periods);
  console.log('Answer 2:', answer2);
}

solve1(`
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`);

solve1(`
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`);

solve1(document.body.textContent);

solve2(`
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`);

solve2(document.body.textContent);

})();

