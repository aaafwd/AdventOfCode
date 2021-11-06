// https://adventofcode.com/2018/day/1
// --- Day 1: Chronal Calibration ---

(function() {

function solve(input) {
  let nums = input.trim().split('\n').map(x => +x);
  let answer1 = nums.reduce((x, y) => x + y);
 
  let answer2 = 0;
  let reached = {'0': 1};
  for (let i = 0, sum = 0;; i = (i + 1) % nums.length) {
    sum += nums[i];
    if (reached[sum]) {
      answer2 = sum;
      break;
    }
    reached[sum] = 1;
  }

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
+7
+7
-2
-7
-4`)

solve(document.body.textContent);

})();

