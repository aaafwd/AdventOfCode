// https://adventofcode.com/2024/day/2
// --- Day 2: Red-Nosed Reports ---

(function() {

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.trim().split(/\s+/).map(x => +x));
}

function isSafe(nums) {
  for (let i = 1; i < nums.length; ++i) {
    if ((nums[i] > nums[i - 1]) != (nums[1] > nums[0])) return false;
    let diff = Math.abs(nums[i] - nums[i - 1]);
    if (diff < 1 || diff > 3) return false;
  }
  return true;
}

function isSafeAllowFix(nums) {
  if (isSafe(nums)) return true;
  return nums.some((_, i) => isSafe(nums.toSpliced(i, 1)));
}

function solve(input) {
  let reports = parseInput(input);

  let answer1 = reports.filter(isSafe).length;
  let answer2 = reports.filter(isSafeAllowFix).length;

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`);

solve(document.body.textContent);

})();

