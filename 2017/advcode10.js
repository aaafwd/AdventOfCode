// https://adventofcode.com/2017/day/10
// --- Day 10: Knot Hash ---

(function() {

function reverse(nums, left, right) {
  while (left < right) {
    let i = left % nums.length;
    let j = right % nums.length;
    [nums[i], nums[j]] = [nums[j], nums[i]];
    ++left;
    --right;
  }
}

function doPermutations(nums, lengths, rounds = 1) {
  let pos = 0;
  let skip_size = 0;
  while (rounds-- > 0) {
    for (let len of lengths) {
      reverse(nums, pos, pos + len - 1);
      pos = (pos + len + skip_size) % nums.length;
      ++skip_size;
    }
  }
}

function calcDenseHash(nums) {
  let output = [];
  for (let i = 0; i < nums.length; i += 16) {
    let x = nums.slice(i, i + 16).reduce((x, y) => x ^ y);
    let str = x.toString(16);
    if (x < 16) str = '0' + str;
    output.push(str);
  }
  return output.join('');
}

function calcKnotHash(str) {
  let lengths = str.split('').map(x => x.charCodeAt(0));
  lengths = lengths.concat([17, 31, 73, 47, 23]);
  let nums = Array(256).fill(0).map((x, i) => i);
  doPermutations(nums, lengths, 64);
  return calcDenseHash(nums);
}

function solve1(size, lengths) {
  let nums = Array(size).fill(0).map((x, i) => i);
  doPermutations(nums, lengths);
  console.log("Answer 1:", nums[0] * nums[1]);
}

function solve2(input) {
  console.log("Answer 2:", calcKnotHash(input));
}

solve1(5, [3,4,1,5]);
solve1(256, [102,255,99,252,200,24,219,57,103,2,226,254,1,0,69,216]);

solve2('');
solve2('AoC 2017');
solve2('1,2,3');
solve2('1,2,4');
solve2('102,255,99,252,200,24,219,57,103,2,226,254,1,0,69,216');

})();

