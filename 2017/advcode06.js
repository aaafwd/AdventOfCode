// https://adventofcode.com/2017/day/6
// --- Day 6: Memory Reallocation ---

(function() {

function solve(input) {
  let nums = input.trim().split(/\s+/).map(x => +x);

  let steps = 0;
  let cache = {};
  while (1) {
    let key = nums + '';
    if (cache[key]) break;
    cache[key] = ++steps;
    let index = 0;
    for (let i = index + 1; i < nums.length; ++i) {
      if (nums[index] < nums[i]) index = i;
    }
    let count = nums[index];
    nums[index++] = 0;
    for (let i = 0; i < count; ++i, ++index) {
      if (index == nums.length) index = 0;
      ++nums[index];
    }
  }

  let answer1 = steps;
  let answer2 = steps - cache[nums] + 1;
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`0 2 7 0`);

solve(document.body.textContent);

})();

