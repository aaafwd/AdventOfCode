// https://adventofcode.com/2021/day/17
// --- Day 17: Trick Shot ---

(function() {

function maxHeight(dx, dy, x1, x2, y1, y2) {
  let x = 0;
  let y = 0;
  let highest_y = 0;
  while (1) {
    x += dx;
    y += dy;
    highest_y = Math.max(highest_y, y);
    if (x1 <= x && x <= x2 && y1 <= y && y <= y2) return highest_y;
    if (dx > 0) --dx;
    --dy;
    if (x > x2) break;
    if (dx == 0 && x < x1) break;
    if (dy <= 0 && y < y1) break;
  }
}

function solve(input) {
  const regex = /x=([-\d]+)\.\.([-\d]+),\s*y=([-\d]+)\.\.([-\d]+)/;
  let [, x1, x2, y1, y2] = input.match(regex).map(Number);
  if (x1 > x2) [x1, x2] = [x2, x1];
  if (y1 > y2) [y1, y2] = [y2, y1];

  let answer1 = 0;
  let answer2 = 0;
  let min_dy = Math.min(y1, 0);
  let max_dy = Math.max(Math.abs(y1), Math.abs(y2));
  for (let dx = 1; dx <= x2; ++dx) {
    for (let dy = min_dy; dy <= max_dy; ++dy) {
      let height = maxHeight(dx, dy, x1, x2, y1, y2);
      if (height !== undefined) {
        answer1 = Math.max(answer1, height);
        ++answer2;
      }
    }
  }

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`target area: x=20..30, y=-10..-5`);

solve(document.body.textContent);

})();

