// https://adventofcode.com/2024/day/1
// --- Day 1: Historian Hysteria ---

(function() {

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.split(/\s+/).map(x => +x));
}


function solve(input) {
  let pairs = parseInput(input);

  let arr1 = pairs.map(p => p[0]).sort((a, b) => a - b);
  let arr2 = pairs.map(p => p[1]).sort((a, b) => a - b);

  let answer1 = 0;
  for (let i = 0; i < arr1.length; ++i) {
    answer1 += Math.abs(arr1[i] - arr2[i]);
  }

  let answer2 = 0;
  for (let i = 0; i < arr1.length; ++i) {
    for (let j = 0; j < arr2.length; ++j) {
      if (arr1[i] == arr2[j]) answer2 += arr1[i];
    }
  }

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
3   4
4   3
2   5
1   3
3   9
3   3
`);

solve(document.body.textContent);

})();

