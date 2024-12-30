// https://adventofcode.com/2024/day/3
// --- Day 3: Mull It Over ---

(function() {

function parseInput(input) {
  return input.match(/mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\)/g);
}

function solve(input) {
  let instructions = parseInput(input);

  let answer1 = 0;
  let answer2 = 0;
  let isDo = true;
  for (let i = 0, str; str = instructions[i]; ++i) {
    if (str == "do()") {
      isDo = true;
    } else if (str == "don't()") {
      isDo = false;
    } else {
      let nums = str.replace(/[mul\(\)]+/g, '').split(',').map(x => +x);
      answer1 += nums[0] * nums[1];
      if (isDo) {
        answer2 += nums[0] * nums[1];
      }
    }
  }

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`);

solve(document.body.textContent);

})();

