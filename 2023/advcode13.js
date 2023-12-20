// https://adventofcode.com/2023/day/13
// --- Day 13: Point of Incidence ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n\n')
    .map(map => map.trim()
      .split('\n')
      .map(row => row.trim().split('')));
}
  
function equalRows(map, row1, row2) {
  for (let x = 0; x < map[row1].length; ++x) {
    if (map[row1][x] != map[row2][x]) return false;
  }
  return true;
}
  
function findRowReflection(map, skipRow) {
  for (let y = 0; y + 1 < map.length; ++y) {
    if (y == skipRow) continue;
    let found = true;
    for (let dy = 0; y - dy >= 0 && y + dy + 1 < map.length; ++dy) {
      if (!equalRows(map, y - dy, y + dy + 1)) {
        found = false;
        break;
      }
    }
    if (found) return y;
  }
  return -1;
}

function equalColumns(map, col1, col2) {
  for (let y = 0; y < map.length; ++y) {
    if (map[y][col1] != map[y][col2]) return false;
  }
  return true;
}

function findColumnReflection(map, skipColumn) {
  for (let x = 0; x + 1 < map[0].length; ++x) {
    if (x == skipColumn) continue;
    let found = true;
    for (let dx = 0; x - dx >= 0 && x + dx + 1 < map[0].length; ++dx) {
      if (!equalColumns(map, x - dx, x + dx + 1)) {
        found = false;
        break;
      }
    }
    if (found) return x;
  }
  return -1;
}
  
function findReflection(map, skipped = [-1, -1]) {
  let row = findRowReflection(map, skipped[0]);
  let column = findColumnReflection(map, skipped[1]);
  if (row == -1 && column == -1) return null;
  return [row, column];
}

function findReflection2(map) {
  let skipped = findReflection(map);
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      map[y][x] = (map[y][x] == '.') ? '#' : '.';
      let result = findReflection(map, skipped);
      map[y][x] = (map[y][x] == '.') ? '#' : '.';
      if (result) return result;
    }
  }
  console.assert(false);
}

function summarize([row, column]) {
  console.assert(row == -1 || column == -1);
  console.assert(row != -1 || column != -1);
  if (row != -1) return (row + 1) * 100;
  return column + 1;
}
  
function solve(input) {
  let maps = parseInput(input);

  let answer1 = maps
    .map(map => findReflection(map))
    .map(summarize)
    .reduce((a, b) => a + b, 0);

  let answer2 = maps
    .map(map => findReflection2(map))
    .map(summarize)
    .reduce((a, b) => a + b, 0);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`);

solve(document.body.textContent);

})();

