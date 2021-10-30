// https://adventofcode.com/2017/day/5
// --- Day 5: A Maze of Twisty Trampolines, All Alike ---

(function() {

function solve(input) {
  let nums = input.trim().split(/\s+/).map(x => +x);

  let answer1 = 0;
  let index = 0;
  while (index < nums.length) {
    let next = index + nums[index];
    ++nums[index];
    index = next;
    ++answer1;
  }

  let answer2 = 0;
  index = 0;
  nums = input.trim().split(/\s+/).map(x => +x);
  while (index < nums.length) {
    let next = index + nums[index];
    if (nums[index] >= 3) --nums[index];
    else ++nums[index];
    index = next;
    ++answer2;
  }

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`0 3 0 1 -3`);

solve(document.body.textContent);

})();

