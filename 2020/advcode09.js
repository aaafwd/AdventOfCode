// https://adventofcode.com/2020/day/9

(function() {

function addToMapValue(map, key, increment) {
  map.set(key, (map.get(key) || 0) + increment);
}

function findFirstInvalid(numbers, preambleSize) {
  let map = new Map();
  for (let i = 0; i < preambleSize; ++i) {
    for (let j = i + 1; j < preambleSize; ++j) {
      addToMapValue(map, numbers[i] + numbers[j], 1);
    }    
  }
  for (let i = preambleSize; i < numbers.length; ++i) {
    if (!map.get(numbers[i])) return numbers[i];
    const first = i - preambleSize;
    for (let j = first + 1; j < i; ++j) {
      addToMapValue(map, numbers[first] + numbers[j], -1);
      addToMapValue(map, numbers[i] + numbers[j], 1);
    }
  }
}

function findContiguousSet(numbers, sum) {
  let accumSums = Array(numbers.length);
  accumSums[0] = numbers[0];
  for (let i = 1; i < numbers.length; ++i) {
    accumSums[i] = numbers[i] + accumSums[i - 1];
  }
  for (let i = 0; i < numbers.length; ++i) {
    for (let j = i + 1; j < numbers.length; ++j) {
      let diff = accumSums[j];
      if (i) diff -= accumSums[i - 1];
      if (diff == sum) return numbers.slice(i, j + 1);
    }
  }
}

function solve(input, preambleSize) {
  let numbers = input.trim().split('\n').map(x => +x);

  let invalidNumber = findFirstInvalid(numbers, preambleSize)
  console.log("Answer 1:", invalidNumber);

  let subarray = findContiguousSet(numbers, invalidNumber);
  console.log("Answer 2:", Math.min(...subarray) + Math.max(...subarray));
}

solve(`
35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576
`, 5);

solve(document.body.textContent, 25);

})();

