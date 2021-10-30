// https://adventofcode.com/2017/day/3
// --- Day 3: Spiral Memory ---

(function() {

function coords(target) {
  let inner = Math.floor(Math.sqrt(target - 1) + 1e-12);
  if (!(inner % 2)) --inner;

  let x = (inner + 1) / 2;
  let y = -(inner - 1) / 2;
  let current = inner * inner + 1;

  current += inner;
  y += inner;
  if (current >= target) return [x, y - (current - target)];

  current += inner + 1;
  x -= inner + 1;
  if (current >= target) return [x + (current - target), y];

  current += inner + 1;
  y -= inner + 1;
  if (current >= target) return [x, y + (current - target)];

  current += inner + 1;
  x += inner + 1;
  if (current >= target) return [x - (current - target), y];

  console.assert(0);
}

function simulateFill(max_limit) {
  let map = [[1]];
  for (let current = 2;; ++current) {
    let [x, y] = coords(current);
    let sum = 0;
    for (let i = -1; i <= 1; ++i) {
      if (!map[x + i]) continue;
      for (let j = -1; j <= 1; ++j) {
        if (!map[x + i][y + j]) continue;
        sum += map[x + i][y + j];
      }
    }
    map[x] = map[x] || [];
    map[x][y] = sum;
    if (sum > max_limit) return sum;
  }
}

function solve(input) {
  let [x, y] = coords(input);
  console.log(
      "Answer 1:", Math.abs(x) + Math.abs(y),
      "Answer 2:", simulateFill(input));
}

solve(1);
solve(12);
solve(23);
solve(1024);
solve(265149);

})();

