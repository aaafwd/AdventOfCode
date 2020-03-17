(function() {

// Extended Euclidean algorithm.
// Returns [d, x, y] such that: d = a*x + b*y
function gcdext(a, b) {
  if (b == 0) return [a, 1, 0];
  let [d, x, y] = gcdext(b, a % b);
  return [d, y, x - Math.floor(a / b) * y];
}

// Returns: (a * b) % mod
function mult2mod(a, b, mod) {
  if (b < 0) [a, b] = [-a, -b];
  let result = 0;
  let power2 = a;
  while (b) {
    if (b % 2) {
      --b;
      result = (result + power2) % mod;
    } else {
      b /= 2;
      power2 = (power2 * 2) % mod;
    }
  }
  return result;
}

function input(str) {
  return str.trim().split('\n').map(row => {
    if (row == 'deal into new stack') return [0];
    if (row.startsWith('cut ')) {
      return [1, Number(row.substr(4))];
    }
    let prefix = 'deal with increment ';
    if (row.startsWith(prefix)) {
      return [2, Number(row.substr(prefix.length))];
    }
    console.assert(0, row);
  });
}

function getNextPosition(pos, N, ops) {
  for (let i = 0; i < ops.length; ++i) {
    const op = ops[i];
    if (op[0] == 0) {
      pos = N - 1 - pos;
    } else if (op[0] == 1) {
      const num = op[1];
      pos = (pos - num) % N;
      if (pos < 0) pos += N;
    } else if (op[0] == 2) {
      let num = op[1];
      pos = mult2mod(pos, num, N);
    } else {
      console.assert(0, i, op);
    }
  }
  return pos;
}

function getPrevPosition(pos, N, ops) {
  for (let i = ops.length - 1; i >= 0; --i) {
    const op = ops[i];
    if (op[0] == 0) {
      pos = N - 1 - pos;
    } else if (op[0] == 1) {
      const num = op[1];
      pos = (pos + num) % N;
      if (pos < 0) pos += N;
    } else if (op[0] == 2) {
      const num = op[1];
      let [d, x, y] = gcdext(N, num);
      pos = mult2mod(y, pos / d, N);
      if (pos < 0) pos += N;
    } else {
      console.assert(0, i, op);
    }
  }
  return pos;
}

// Multiplies two 2x2 matrixes:
// | a1 b1 |   | a2 b2 |
// |       | * |       |
// | c1 d1 |   | c2 d2 |
function matrix2mult([a1, b1, c1, d1], [a2, b2, c2, d2], mod) {
  let a3 = mult2mod(a1, a2, mod) + mult2mod(b1, c2, mod);
  let b3 = mult2mod(a1, b2, mod) + mult2mod(b1, d2, mod);
  let c3 = mult2mod(c1, a2, mod) + mult2mod(d1, c2, mod);
  let d3 = mult2mod(c1, b2, mod) + mult2mod(d1, d2, mod);
  return [a3 % mod, b3 % mod, c3 % mod, d3 % mod];
}

// Matrix 2x2 to the given power and modulo.
function matrix2pow([a, b, c, d], pow, mod) {
  let result = [1, 0, 0, 1];
  let power2 = [a, b, c, d];
  while (pow) {
    if (pow % 2) {
      --pow;
      result = matrix2mult(result, power2, mod);
    } else {
      pow /= 2;
      power2 = matrix2mult(power2, power2, mod);
    }
  }
  return result;
}

function solvePart2(
    str, FINAL_POS = 2020, N = 119315717514047, TIMES = 101741582076661) {
  const ops = input(str);

  let pos = FINAL_POS;
  let positions = [];
  for (let i = 0; i < 100; ++i) {
    positions.push(pos);
    pos = getPrevPosition(pos, N, ops);
  }

  // y1 = a*x1 + b
  // y2 = a*x2 + b
  let [x1, y1] = [positions[0], positions[1]];
  let [x2, y2] = [positions[1], positions[2]];

  // x2*y1 = x2*a*x1 + x2*b
  // x1*y2 = x1*a*x2 + x1*b
  // x2*y1 - x1*y2 = b * (x2-x1)
  // x2*y1 - x1*y2 = X * (x2-x1) + Y * N
  let [d, x, y] = gcdext(x2 - x1, N);
  let left = mult2mod(x2, y1, N) - mult2mod(x1, y2, N);
  console.assert(left % d === 0);
  const B = mult2mod(x, left / d, N);

  // y1 - B = a * x1
  // y1 - B = X * x1 + Y * N
  [d, x, y] = gcdext(x1, N);
  left = y1 - B;
  console.assert(left % d === 0);
  const A = mult2mod(x, left / d, N);

  // Self test.
  for (let i = 1; i < positions.length; ++i) {
    let prev = positions[i - 1];
    let next = (mult2mod(A, prev, N) + B) % N;
    if (next < 0) next += N;
    console.assert(positions[i] == next);
  }

  {
    // | A B |         | A B |   | FINAL_POS |
    // |     | * ... * |     | * |           |
    // | 0 1 |         | 0 1 |   |     1     |
    let [a, b, c, d] = matrix2pow([A, B, 0, 1], TIMES, N);
    console.assert(c === 0);
    console.assert(d === 1);
    let pos = (mult2mod(a, FINAL_POS, N) + b) % N;
    if (pos < 0) pos += N;
    console.log('Answer (part 2)', pos);
  }
}

function solve(str, pos, N) {
  const ops = input(str);
  console.log(
      'Answer (part 1): card ' + pos + ' is at:', getNextPosition(pos, N, ops));
}

function printFinalDeck(str, N) {
  const ops = input(str);
  let positions = Array(N);
  for (let i = 0; i < N; ++i) {
    positions[getNextPosition(i, N, ops)] = i;
  }
  console.log(positions);
}

printFinalDeck(`
deal with increment 3
`, 10);

printFinalDeck(`
deal with increment 7
deal into new stack
deal into new stack
`, 10);

printFinalDeck(`
cut 6
deal with increment 7
deal into new stack
`, 10);

printFinalDeck(`
deal with increment 7
deal with increment 9
cut -2
`, 10);

printFinalDeck(`
deal into new stack
cut -2
deal with increment 7
cut 8
cut -4
deal with increment 7
cut 3
deal with increment 9
deal with increment 3
cut -1
`, 10);

solve(`
deal with increment 54
cut -667
deal with increment 15
cut -1826
deal with increment 55
cut -8444
deal with increment 44
cut 910
deal with increment 63
cut 4025
deal with increment 45
cut 6430
deal with increment 53
cut -3727
deal into new stack
deal with increment 6
cut -5464
deal into new stack
deal with increment 48
cut 6238
deal with increment 23
cut 8614
deal with increment 50
cut -987
deal with increment 26
cut -9808
deal with increment 47
cut -8088
deal with increment 5
deal into new stack
cut 5787
deal with increment 49
cut 795
deal with increment 2
cut -536
deal with increment 26
deal into new stack
cut -6327
deal with increment 63
cut 2511
deal with increment 38
cut -2622
deal into new stack
deal with increment 9
cut 8201
deal into new stack
deal with increment 48
cut -2470
deal with increment 19
cut 8669
deal into new stack
deal with increment 28
cut -2723
deal into new stack
deal with increment 15
cut -5101
deal into new stack
cut 464
deal with increment 68
cut 2695
deal with increment 53
cut -8523
deal with increment 32
cut -1018
deal with increment 66
cut 9127
deal with increment 3
deal into new stack
deal with increment 14
cut 725
deal into new stack
cut -2273
deal with increment 65
cut 6306
deal with increment 55
cut -6710
deal with increment 54
cut 7814
deal with increment 23
cut 8877
deal with increment 60
cut 3063
deal with increment 40
cut -2104
deal with increment 72
cut -4171
deal with increment 21
cut 7919
deal with increment 53
cut -3320
deal with increment 49
deal into new stack
cut -8201
deal into new stack
deal with increment 54
deal into new stack
cut 6321
deal with increment 50
cut 7244
deal with increment 23
`, 2019, 10007);

solvePart2(`
deal with increment 54
cut -667
deal with increment 15
cut -1826
deal with increment 55
cut -8444
deal with increment 44
cut 910
deal with increment 63
cut 4025
deal with increment 45
cut 6430
deal with increment 53
cut -3727
deal into new stack
deal with increment 6
cut -5464
deal into new stack
deal with increment 48
cut 6238
deal with increment 23
cut 8614
deal with increment 50
cut -987
deal with increment 26
cut -9808
deal with increment 47
cut -8088
deal with increment 5
deal into new stack
cut 5787
deal with increment 49
cut 795
deal with increment 2
cut -536
deal with increment 26
deal into new stack
cut -6327
deal with increment 63
cut 2511
deal with increment 38
cut -2622
deal into new stack
deal with increment 9
cut 8201
deal into new stack
deal with increment 48
cut -2470
deal with increment 19
cut 8669
deal into new stack
deal with increment 28
cut -2723
deal into new stack
deal with increment 15
cut -5101
deal into new stack
cut 464
deal with increment 68
cut 2695
deal with increment 53
cut -8523
deal with increment 32
cut -1018
deal with increment 66
cut 9127
deal with increment 3
deal into new stack
deal with increment 14
cut 725
deal into new stack
cut -2273
deal with increment 65
cut 6306
deal with increment 55
cut -6710
deal with increment 54
cut 7814
deal with increment 23
cut 8877
deal with increment 60
cut 3063
deal with increment 40
cut -2104
deal with increment 72
cut -4171
deal with increment 21
cut 7919
deal with increment 53
cut -3320
deal with increment 49
deal into new stack
cut -8201
deal into new stack
deal with increment 54
deal into new stack
cut 6321
deal with increment 50
cut 7244
deal with increment 23
`);
})();
