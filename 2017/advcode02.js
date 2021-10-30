// https://adventofcode.com/2017/day/2
// --- Day 2: Corruption Checksum ---

(function() {

function solve(input) {
  let nums = input.trim().split('\n')
    .map(row => row.split(/\s+/).map(x => +x));

  let answer1 = 0;
  for (let row of nums) {
    row.sort((x, y) => x - y);
    answer1 += row[row.length - 1] - row[0];
  }

  let answer2 = 0;
  for (let row of nums) {
    for (let i = 1; i < row.length; ++i) {
      for (let j = 0; j < i; ++j) {
        if (!(row[i] % row[j])) {
          answer2 += row[i] / row[j];
        }
      }
    }
  }

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
5 1 9 5
7 5 3
2 4 6 8
`);

solve(`
5 9 2 8
9 4 7 3
3 8 6 5
`);

solve(document.body.textContent);

})();

