// https://adventofcode.com/2022/day/20
// --- Day 20: Grove Positioning System ---
// Runtime: 89.617919921875 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  return input.trim().split('\n').map(Number);
}

function mix(nums, rounds = 1) {
  const N = nums.length;
  let indexes = nums.map((_, i) => i);
  for (let r = 0; r < rounds; ++r) {
    for (let src = 0; src < N; ++src) {
      let i = indexes.indexOf(src);
      let j = (i - 1 + nums[src]) % (N - 1);
      if (j < 0) j += N - 1;
      ++j;
      if (i < j) {
        let tmp = indexes[i];
        for (; i < j; ++i) indexes[i] = indexes[i + 1];
        indexes[j] = tmp;
      } else if (i > j) {
        let tmp = indexes[i];
        for (; i > j; --i) indexes[i] = indexes[i - 1];
        indexes[j] = tmp;
      }
    }
  }
  return indexes.map(i => nums[i]);
}

function groove(nums) {
  let index0 = nums.indexOf(0);
  return [1000, 2000, 3000]
    .map(i => nums[(i + index0) % nums.length])
    .reduce((a, b) => a + b, 0);
}

function solve(input) {
  let nums = parseInput(input);

  let answer1 = groove(mix(nums));

  let answer2 = groove(mix(nums.map(x => x * 811589153), 10));

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
1
2
-3
3
-2
0
4
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

