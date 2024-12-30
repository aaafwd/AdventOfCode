// https://adventofcode.com/2024/day/22
// --- Day 22: Monkey Market ---
// Runtime: 1182.544189453125 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => Number(row.trim()));
}

function nextSecret(number) {
  let secret = BigInt(number);
  secret = (secret ^ (secret << 6n)) & 16777215n;
  secret = (secret ^ (secret >> 5n)) & 16777215n;
  secret = (secret ^ (secret << 11n)) & 16777215n;
  return Number(secret);
}

function getNthSecret(secret, n) {
  for (let i = 0; i < n; ++i) {
    secret = nextSecret(secret);
  }
  return secret;
}

function toKey(numbers) {
  return numbers.reduce((acc, num) => acc * 20 + num + 9, 0);
}

function generateBananaSequence(secret, size) {
  let bananas = [];
  let diffs = [];
  for (let i = 0; i < size; ++i) {
    let next = nextSecret(secret);
    let diff = (next % 10) - (secret % 10);
    bananas.push(next % 10);
    diffs.push(diff);
    secret = next;
  }
  let bananaMap = new Map();
  for (let i = 3; i < diffs.length; ++i) {
    let key = toKey([diffs[i - 3], diffs[i - 2], diffs[i - 1], diffs[i]]);
    if (!bananaMap.has(key)) bananaMap.set(key, bananas[i]);
  }
  return bananaMap;
}

function simulateBananas(secrets) {
  let bananaMaps = secrets.map(secret => generateBananaSequence(secret, 2000));
  let maxBananas = 0;
  let summedMap = new Map();
  for (let map of bananaMaps) {
    for (let [key, value] of map) {
      value += summedMap.get(key) || 0;
      summedMap.set(key, value);
      if (maxBananas < value) maxBananas = value;
    }
  }
  return maxBananas;
}

function solve(input) {
  let secrets = parseInput(input);

  let answer1 = secrets
    .map(num => getNthSecret(num, 2000))
    .reduce((a, b) => a + b);

  let answer2 = simulateBananas(secrets);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
1
10
100
2024
`);

solve(`
1
2
3
2024
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

