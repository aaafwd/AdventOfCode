// https://adventofcode.com/2017/day/4
// --- Day 4: High-Entropy Passphrases ---

(function() {

function solve(input) {
  let rows = input.trim().split('\n').map(row => row.split(/\s+/));

  let answer1 = 0;
  let answer2 = 0;
  for (let row of rows) {
    if (new Set(row).size != row.length) continue;
    ++answer1
    row = row.map(word => word.split('').sort().join(''));
    if (new Set(row).size != row.length) continue;
    ++answer2
  }

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
aa bb cc dd ee
aa bb cc dd aa
`);

solve(document.body.textContent);

})();

