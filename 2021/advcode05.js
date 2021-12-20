// https://adventofcode.com/2021/day/5
// --- Day 5: Hydrothermal Venture ---

(function() {

function parseInput(input) {
  return input.trim().split('\n').map(row =>
    row.trim().split(' -> ').map(pair =>
      pair.trim().split(',').map(Number)));
}

function paintLine([[x1, y1], [x2, y2]], map) {
  if (x1 == x2) {
    if (y1 > y2) [y1, y2] = [y2, y1];
    for (let y = y1; y <= y2; ++y) {
      console.assert(typeof map[y][x1] == 'number');
      ++map[y][x1];
    }
  } else if (y1 == y2) {
    if (x1 > x2) [x1, x2] = [x2, x1];
    for (let x = x1; x <= x2; ++x) {
      console.assert(typeof map[y1][x] == 'number');
      ++map[y1][x];
    }
  } else {
    if (x1 > x2) {
      [x1, x2] = [x2, x1];
      [y1, y2] = [y2, y1];
    }
    console.assert(x2 - x1 == Math.abs(y2 - y1), [x1, y1], [x2, y2]);
    for (let x = x1, y = y1; x <= x2; ++x, y += (y2 > y1) ? 1 : -1) {
      console.assert(typeof map[y][x] == 'number');
      ++map[y][x];
    }
  }
}

function countOverlaps(lines) {
  let points = [].concat(...lines);
  let max_x = Math.max(...points.map(pt => pt[0]));
  let max_y = Math.max(...points.map(pt => pt[1]));

  let map = Array(max_y + 1).fill(0).map(row => Array(max_x + 1).fill(0));
  lines.forEach(line => paintLine(line, map));

  let overlaps = [].concat(...map).filter(x => x > 1).length;
  return overlaps;
}

function solve(input) {
  let lines = parseInput(input);

  let answer1 = countOverlaps(
    lines.filter(([[x1, y1], [x2, y2]]) => x1 == x2 || y1 == y2));

  let answer2 = countOverlaps(lines);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`);

solve(document.body.textContent);

})();

