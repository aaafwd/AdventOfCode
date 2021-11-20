// https://adventofcode.com/2016/day/18
// --- Day 18: Like a Rogue ---
//
// Runtime: 1567.609130859375 ms

(function() {
console.time('Runtime');

function solve(input, rows) {
  let row = input.trim().split('');
  let count = 0;
  for (let i = 1;; ++i) {
    count += row.filter(ch => ch != '^').length;
    if (i >= rows) break;

    row = row.map((ch, index) => {
      let left = row[index - 1];
      let right = row[index + 1];
      let is_trap = (left == '^') ^ (right == '^');
      return is_trap ? '^' : '.';
    });
  }

  console.log('Answer for %d rows:', rows, count);
}

solve('.^^.^.^^^^', 10);

solve(document.body.textContent, 40);

solve(document.body.textContent, 400000);

console.timeEnd('Runtime');
})();

