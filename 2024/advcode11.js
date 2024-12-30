// https://adventofcode.com/2024/day/11
// --- Day 11: Plutonian Pebbles ---
// Runtime: 84.806884765625 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  return input.trim().split(/\s+/).map(x => BigInt(x));
}

function digitsCount(num) {
  let result = 1;
  let power10 = 10n;
  while (power10 <= num) {
    power10 *= 10n;
    ++result;
  }
  return result;
}

function splitEvenDigits(num, digits) {
  digits /= 2;
  let power10 = 1n;
  while (digits-- > 0) {
    power10 *= 10n;
  }
  return [num / power10, num % power10];
}

class VectorMap {
  constructor() {
    this.map_ = new Map();
    this.size_ = 0;
  }

  get size() {
    return this.size_;
  }

  set(keys, value) {
    let map = this.map_;
    for (let i = 0; i + 1 < keys.length; ++i) {
      let key = keys[i];
      if (map.has(key)) {
        map = map.get(key);
      } else {
        let next = new Map();
        map.set(key, next);
        map = next;
      }
    }
    let key = keys[keys.length - 1];
    if (!map.has(key)) ++this.size_;
    map.set(key, value);
  }

  has(keys) {
    let map = this.map_;
    for (let key of keys) {
      if (!map.has(key)) return false;
      map = map.get(key);
    }
    return true;
  }

  get(keys) {
    let map = this.map_;
    for (let key of keys) {
      if (!map.has(key)) return undefined;
      map = map.get(key);
    }
    return map;
  }

  delete(keys) {
    let map = this.map_;
    for (let i = 0; i + 1 < keys.length; ++i) {
      let key = keys[i];
      if (!map.has(key)) return false;
      map = map.get(key);
    }
    let key = keys[keys.length - 1];
    if (!map.has(key)) return false;
    --this.size_;
    return map.delete(key);
  }

  clear() {
    this.size_ = 0;
    return this.map_.clear();
  }
}

function memoize(fn) {
  let cache = new VectorMap();
  let memoized = function(...args) {
    let result = cache.get(args);
    if (result !== undefined) return result;
    result = fn.apply(this, args);
    console.assert(result !== undefined);
    cache.set(args, result);
    return result;
  }
  memoized.__cache = cache;
  return memoized;
}

const simulate = memoize(function(stone, rounds) {
  if (rounds == 0) return 1;
  if (stone == 0) {
    count = simulate(1n, rounds - 1);
  } else {
    let digits = digitsCount(stone);
    if ((digits & 1) == 0) {
      let [a, b] = splitEvenDigits(stone, digits);
      count = simulate(a, rounds - 1) + simulate(b, rounds - 1);
    } else {
      count = simulate(stone * 2024n, rounds - 1)
    }
  }
  return count;
});

function simulateAll(stones, rounds) {
  let count = 0;
  for (let i = 0; i < stones.length; ++i) {
    count += simulate(stones[i], rounds);
  }
  return count;
}

function solve(input) {
  let stones = parseInput(input);

  let answer1 = simulateAll(stones, 25);
  let answer2 = simulateAll(stones, 75);
  // console.log(simulate.__cache);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
125 17
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

