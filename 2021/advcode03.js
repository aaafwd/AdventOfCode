// https://adventofcode.com/2021/day/3
// --- Day 3: Binary Diagnostic ---

(function() {

function countBitsFreq(bits_array, index) {
  let counts = [0, 0];
  for (let bits of bits_array) {
    ++counts[bits[index]];
  }
  return counts;
}

function solve1(bits_array) {
  const bits_size = bits_array[0].length;
  let min = [], max = [];
  for (let i = 0; i < bits_size; ++i) {
    let [count0, count1] = countBitsFreq(bits_array, i);
    min[i] = (count0 < count1) ? 0 : 1;
    max[i] = (count0 < count1) ? 1 : 0;
  }
  let a = parseInt(min.join(''), 2);
  let b = parseInt(max.join(''), 2);
  return a * b;
}

function filterMinMax(bits_array, bit) {
  const bits_size = bits_array[0].length;
  for (let i = 0; i < bits_size && bits_array.length > 1; ++i) {
    let [count0, count1] = countBitsFreq(bits_array, i);
    let pivot = (count0 <= count1) ? bit : (bit ^ 1);
    bits_array = bits_array.filter(bits => bits[i] == pivot);
  }
  console.assert(bits_array.length == 1);
  return parseInt(bits_array[0].join(''), 2);
}

function solve(input) {
  let bits_array = input.trim().split('\n').map(row => row.split('').map(Number));
  let answer1 = solve1(bits_array);

  let min = filterMinMax(bits_array, 0);
  let max = filterMinMax(bits_array, 1);
  let answer2 = min * max;

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`);

solve(document.body.textContent);

})();

