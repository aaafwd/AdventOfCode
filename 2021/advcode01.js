// https://adventofcode.com/2021/day/1
// --- Day 1: Sonar Sweep ---

(function() {

function solve(input) {
  let nums = input.trim().split('\n').map(x => +x);
  let answer1 = 0;
  let answer2 = 0;
  for (let i = 1; i < nums.length; ++i) {
    if (nums[i] > nums[i - 1]) ++answer1;
    if (i >= 3 && nums[i] > nums[i - 3]) ++answer2;
  }
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(document.body.textContent);

})();

