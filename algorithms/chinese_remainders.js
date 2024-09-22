(function() {

/**
 * Extended Euclidean algorithm.
 * See https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
 *
 * Returns [d, x0, y0] such that: d = a * x0 + b * y0, where d >= 0
 * All solutions are:
 * x = x0 - (b / d) * N
 * y = y0 + (a / d) * N
 *
 * @param {number|BigInt} a
 * @param {number|BigInt} b
 * @return {number|BigInt}
 */
function gcdext(a, b) {
  // Note: Math.floor() does not work with BigInt.
  function floor(x) { return (typeof x == "bigint") ? x : Math.floor(x); }

  if (a < 0) {
    let [d, x, y] = gcdext(-a, b);
    return [d, -x, y];
  }
  if (b < 0) {
    let [d, x, y] = gcdext(a, -b);
    return [d, x, -y];
  }
  if (b == 0) return [a, (typeof a == "bigint") ? 1n : 1, b];
  let [d, x, y] = gcdext(b, a % b);
  return [d, y, x - floor(a / b) * y];
}

/**
 * Modular multiplicative inverse.
 * See https://en.wikipedia.org/wiki/Modular_multiplicative_inverse#Computation
 *
 * Returns `x` such that: (a * x) % mod == 1, i.e. x = a ^ (-1) % mod.
 *
 * @param {number|BigInt} a
 * @param {number|BigInt} mod > 1
 * @return {number|BigInt} in the range [1, mod)
 */
function modInverse(a, mod) {
  // a * x + mod * y = 1
  console.assert(mod > 1, mod);
  let [d, x, y] = gcdext(a, mod);
  console.assert(d == 1, d, a, mod);
  return x >= 0 ? x : x + mod;
}

/**
 * Finds a solution of a system of linear congruences that is guaranteed by
 * the Chinese Remainder Theorem.
 *
 * See https://en.wikipedia.org/wiki/Chinese_remainder_theorem
 *
 * Returns `x` such that:
 *   x ≡ reminders[0] (mod coprimes[0]), i.e. x % coprimes[0] = reminders[0]
 *   x ≡ reminders[1] (mod coprimes[1]), i.e. x % coprimes[1] = reminders[1]
 *   ...
 *   x ≡ reminders[N] (mod coprimes[N]), i.e. x % coprimes[N] = reminders[N]
 *
 * Usage example with moduli that are not pairwise coprime:
 * ```
 * let x = solveChineseRemainders(...makeReminderModuliCoprime(reminders, mods));
 * ```
 *
 * @param {!Array<number|BigInt>} reminders array of reminders
 * @param {!Array<number|BigInt>} coprimes pairwise coprime moduli, each of
 *     which is at least `2`
 * @return {number|BigInt} solution `x` to the system of linear congruences
 */
function solveChineseRemainders(reminders, coprimes) {
  const N = coprimes.length;
  console.assert(N > 0 && reminders.length == N, reminders, coprimes);
  console.assert(!coprimes.some(p => p < 2), coprimes);

  // answer = x1 + x2*p1 + x3*p1*p2 + ... + + xk*p1*p2*...*p(k-1)
  // r[i][j] = coprimes[i]^(-1) mod coprimes[j]
  let r = [];
  for (let i = 0; i < N; ++i) {
    r[i] = r[i] || [];
    for (let j = i + 1; j < N; ++j) {
      r[i][j] = modInverse(coprimes[i], coprimes[j]);
    }
  }
  let x = [];
  for (let i = 0; i < N; ++i) {
    x[i] = reminders[i];
    for (let j = 0; j < i; ++j) {
      x[i] = (r[j][i] * (x[i] - x[j])) % coprimes[i];
      if (x[i] < 0) x[i] += coprimes[i];
    }
  }
  let [result, factor] = (typeof coprimes[0] == "bigint") ? [0n, 1n] : [0, 1];
  for (let i = 0; i < N; ++i) {
    result += factor * x[i];
    factor *= coprimes[i];
  }
  return result;
}

/**
 * Reduces a system of linear congruences so that the moduli should be coprime.
 * @return {!Array<!Array<number|BigInt>=, !Array<number|BigInt>=>}
 *     new reminders and coprime moduli or an empty `Array` if the system has
 *     no solutions
 */
function makeReminderModuliCoprime(inputReminders, inputMods) {
  let reminders = inputReminders.slice();
  let coprimes = inputMods.slice();
  while (1) {
    // Ignore mods == 1.
    for (let i = coprimes.length - 1; i >= 0; --i) {
      if (coprimes[i] == 1) {
        coprimes.splice(i, 1);
        reminders.splice(i, 1);
      }
    }
    let changed = false;
    for (let i = 0; i < coprimes.length; ++i) {
      for (let j = i + 1; j < coprimes.length; ++j) {
        let [d] = gcdext(coprimes[i], coprimes[j]);
        if (d == 1) continue;
        let newR = reminders[i] % d;
        if (newR != (reminders[j] % d)) {
          console.warn("No solution for: X ≡ %d (mod %d), X ≡ %d (mod %d), " +
                       "with common divisor %d", reminders[i], coprimes[i],
                       reminders[j], coprimes[j], d);
          return [];
        }
        coprimes[i] /= d;
        coprimes[j] /= d;
        reminders.push(newR);
        coprimes.push(d);
        changed = true;
        i = j = coprimes.length;
        break;
      }
    }
    if (!changed) break;
  }
  console.assert(!coprimes.some(p => p < 2), coprimes);
  return [reminders, coprimes];
}

// ---------------------------------------------------------------------------
// TESTS
// ---------------------------------------------------------------------------
console.time("Runtime");

console.log("Testing `gcdext()`");
(function() {
  // [d, x0, y0] such that: d = a * x0 + b * y0
  for (let a = -200; a <= 200; ++a) {
    for (let b = -200; b <= 200; ++b) {
      let [d, x0, y0] = gcdext(a, b);
      console.assert(typeof d == "number", d);
      console.assert(typeof x0 == "number", x0);
      console.assert(typeof y0 == "number", y0);
      console.assert(d >= 0, d, a, b);
      console.assert(d == a * x0 + b * y0, d, a * x0 + b * y0, "a:", a, "b:", b);
    }
  }
  // Test with BigInt's.
  for (let a = -200n; a <= 200n; ++a) {
    for (let b = -200n; b <= 200n; ++b) {
      let [d, x0, y0] = gcdext(a, b);
      console.assert(typeof d == "bigint", d);
      console.assert(typeof x0 == "bigint", x0);
      console.assert(typeof y0 == "bigint", y0);
      console.assert(d >= 0, d, a, b);
      console.assert(d == a * x0 + b * y0, d, a * x0 + b * y0, "a:", a, "b:", b);
    }
  }
})();

console.log("Testing `modInverse()`");
(function() {
  // (a * x) % b == 1, i.e. x = a ^ (-1) % b.
  for (let a = -200; a <= 200; ++a) {
    for (let mod = 2; mod <= 200; ++mod) {
      let [d] = gcdext(a, mod);
      if (d != 1) continue;
      let x = modInverse(a, mod);
      console.assert(typeof x == "number", x);
      console.assert(0 < x && x < mod, x, a, mod);
      console.assert(((a * x) % mod + mod) % mod == 1, (a * x) % mod, "a:", a, "mod:", mod, "x:", x);
    }
  }
  // Test with BigInt's.
  for (let a = -200n; a <= 200n; ++a) {
    for (let mod = 2n; mod <= 200n; ++mod) {
      let [d] = gcdext(a, mod);
      if (d != 1) continue;
      let x = modInverse(a, mod);
      console.assert(typeof x == "bigint", x);
      console.assert(0 < x && x < mod, x, a, mod);
      console.assert(((a * x) % mod + mod) % mod == 1, (a * x) % mod, "a:", a, "mod:", mod, "x:", x);
    }
  }
})();

console.timeEnd("Runtime");
})();

