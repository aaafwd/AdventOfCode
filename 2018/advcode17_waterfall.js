// https://adventofcode.com/2018/day/17
// --- Day 17: Reservoir Research ---
//
// Runtime: 39.423828125 ms

(function() {
console.time("Runtime");

function parseInput(input, start_x = 500) {
  let lines = input.trim().split('\n');
  const regex_x = /^x=(\d+), y=(\d+)\.\.(\d+)$/;
  const regex_y = /^y=(\d+), x=(\d+)\.\.(\d+)$/;
  let match, min_x = +Infinity, min_y = +Infinity, max_x = -Infinity, max_y = -Infinity;
  let lines_x = [];
  let lines_y = [];
  for (let line of lines) {
    if ((match = line.match(regex_x))) {
      let [, x, y1, y2] = match.map(x => +x);
      min_x = Math.min(min_x, x);
      max_x = Math.max(max_x, x);
      min_y = Math.min(min_y, y1, y2);
      max_y = Math.max(max_y, y1, y2);
      lines_x.push([x, y1, y2]);
    } else if ((match = line.match(regex_y))) {
      let [, y, x1, x2] = match.map(x => +x);
      min_x = Math.min(min_x, x1, x2);
      max_x = Math.max(max_x, x1, x2);
      min_y = Math.min(min_y, y);
      max_y = Math.max(max_y, y);
      lines_y.push([y, x1, x2]);
    } else {
      console.assert(0, line);
    }
  }

  // Leave some gap for the water to drain down.
  --min_x;
  ++max_x;

  let map = Array(max_y - min_y + 1).fill(0).map(_ => Array(max_x - min_x + 1).fill('.'));  
  for (let [x, y1, y2] of lines_x) {
    x -= min_x;
    y1 -= min_y;
    y2 -= min_y;
    for (; y1 <= y2; ++y1) map[y1][x] = '#';
  }
  for (let [y, x1, x2] of lines_y) {
    y -= min_y;
    x1 -= min_x;
    x2 -= min_x;
    for (; x1 <= x2; ++x1) map[y][x1] = '#';
  }
  start_x -= min_x;
  return {map, start_x};
}

function fillWater(map, x, y) {
  if (y >= map.length) return 0; // down the drain
  if (map[y][x] == '|') {
    return 0;
  }
  if (map[y][x] == '#' || map[y][x] == '~') {
    return 1;
  }
  console.assert(map[y][x] == '.');
  map[y][x] = '|';
  if (!fillWater(map, x, y + 1)) return 0;

  // Spread water to the left and right.
  let draining = false;
  let right_x = x + 1;
  for (;; ++right_x) {
    if (map[y][right_x] != '.') {
      if (map[y][right_x] == '|') draining = true;
      break;
    }
    map[y][right_x] = '|';
    if (!fillWater(map, right_x, y + 1)) {
      draining = true;
      break;
    }
  }
  let left_x = x - 1;
  for (;; --left_x) {
    if (map[y][left_x] != '.') {
      if (map[y][left_x] == '|') draining = true;
      break;
    }
    map[y][left_x] = '|';
    if (!fillWater(map, left_x, y + 1)) {
      draining = true;
      break;
    }
  }
  if (draining) return 0;

  for (let x = left_x + 1; x < right_x; ++x) {
    map[y][x] = '~';
  }
  return 1;
}

function countWaterTiles(map) {
  let settled = map.map(row => row.filter(x => x =='~').length).reduce((x, y) => x + y);
  let other = map.map(row => row.filter(x => x == '|').length).reduce((x, y) => x + y);
  return [settled, other];
}

function printMap(map) {
  console.log(map.map(row => row.join('')).join('\n'));
}

function solve(input) {
  let {map, start_x} = parseInput(input);
  fillWater(map, start_x, 0);
  // printMap(map);

  let [settled, other] = countWaterTiles(map);
  let answer1 = settled + other;
  let answer2 = settled;

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504
`);

solve(document.body.textContent);

console.timeEnd("Runtime");
})();

