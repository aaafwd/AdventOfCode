// https://adventofcode.com/2023/day/11
// --- Day 11: Cosmic Expansion ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim().split(''));
}

function isEmptyColumn(map, col) {
  for (let y = 0; y < map.length; ++y) {
    if (map[y][col] == '#') return false;
  }
  return true;
}
  
function findEmptyRowsAndColumns(map) {
  let rows = [];
  for (let i = 0; i < map.length; ++i) {
    if (map[i].indexOf('#') == -1) {
      rows.push(i);
    }
  }
  let columns = [];
  for (let i = 0; i < map[0].length; ++i) {
    if (isEmptyColumn(map, i)) {
      columns.push(i);
    }
  }
  return [rows, columns];
}

function findAllEndPoints(map) {
  let result = [];
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == '#') result.push([y, x]);
    }
  }
  return result;
}

function countBetween(array, x1, x2) {
  let result = 0;
  for (let x of array) {
    if ((x1 <= x && x <= x2) || (x2 <= x && x <= x1)) ++result;
  }
  return result;
}
  
function countPaths(map, rows, columns, factor) {
  let result = 0;
  let points = findAllEndPoints(map);
  for (let i = 0; i < points.length; ++i) {
    for (let j = i + 1; j < points.length; ++j) {
      let [y1, x1] = points[i];
      let [y2, x2] = points[j];
      let diff = Math.abs(y1 - y2) + Math.abs(x1 - x2);
      let expanded = countBetween(rows, y1, y2) + countBetween(columns, x1, x2);
      diff += expanded * (factor - 1);
      result += diff;
    }
  }
  return result;
}
  
function solve(input) {
  let map = parseInput(input);
  let [rows, columns] = findEmptyRowsAndColumns(map);
  let answer1 = countPaths(map, rows, columns, 2);
  let answer2 = countPaths(map, rows, columns, 1000000);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`);

solve(document.body.textContent);

})();

