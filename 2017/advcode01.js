// https://adventofcode.com/2017/day/1
// --- Day 1: Inverse Captcha ---

(function() {

function solve(input) {
  let nums = input.trim().split('').map(x => +x);
  let answer1 = 0;
  let answer2 = 0;
  for (let i = 0; i < nums.length; ++i) {
    let j = (i + 1) % nums.length;
    if (nums[i] == nums[j]) answer1 += nums[i];
    j = (i + nums.length / 2) % nums.length;
    if (nums[i] == nums[j]) answer2 += nums[i];
  }
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve("1122");
solve("1111");
solve("1234");
solve("91212129");

solve("1212");
solve("1221");
solve("123425");
solve("123123");
solve("12131415");

solve(document.body.textContent);

})();

