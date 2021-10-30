// https://adventofcode.com/2017/day/14
// --- Day 14: Disk Defragmentation ---

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

function maskRegion(map, i, j) {
  let queue = [[i, j]];
  while (queue.length) {
    [i, j] = queue.shift();
    if (i < 0 || j < 0 || i >= map.length || j >= map[i].length) continue;
    if (map[i][j] != '1') continue;
    map[i][j] = '0';
    queue.push([i, j - 1], [i, j + 1], [i - 1, j], [i + 1, j]);
  }
}

function solve(input) {
  let map = [];
  for (let i = 0; i < 128; ++i) {
    let hash = calcKnotHash(input + '-' + i);
    map[i] = hash.split('').map(x => parseInt(x, 16)).map(x => x.toString(2).padStart(4, '0')).join('');
    console.assert(map[i].length == 128);
  }

  let answer1 = map.join('').replaceAll('0', '').length;

  map = map.map(row => row.split(''));
  let answer2 = 0;
  for (let i = 0; i < 128; ++i) {
    for (let j = 0; j < 128; ++j) {
      if (map[i][j] == '1') {
        ++answer2;
        maskRegion(map, i, j);
      }
    }
  }

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve('flqrgnkx');
solve('xlqgujun');

})();

