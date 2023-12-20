// https://adventofcode.com/2023/day/3
// --- Day 3: Gear Ratios ---

(function() {

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, -1], [-1, 1]];

function parseInput(input) {
  return input.trim().split('\n').map(row => row.trim().split(''));
}

function hasAdjSymbol(map, y, x) {
  for (let [dx, dy] of kDirs) {
    let nx = x + dx;
    let ny = y + dy;
    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
    if (map[ny][nx] == '.') continue;
    if (/[0-9]/.test(map[ny][nx])) continue;
    return true;
  }
  return false;
}

function collectStars(map, y, x, stars) {
  for (let [dx, dy] of kDirs) {
    let nx = x + dx;
    let ny = y + dy;
    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
    if (map[ny][nx] == '*') {
      let key = ny + ',' + nx;
      stars[key] = 1;
    }
  }
}

function solve(input) {
  let map = parseInput(input);
  let parts = [];
  let gears = {};

  for (let y = 0; y < map.length; ++y) {
    let current = 0;
    let isValid = false;
    let stars = {};
    for (let x = 0, size = map[y].length; x <= size; ++x) {
      if (x == size || !/[0-9]/.test(map[y][x])) {
        if (isValid) {
          parts.push(current);
          Object.keys(stars).forEach(key => {
            gears[key] = gears[key] || [];
            gears[key].push(current);
          });
        }
        current = 0;
        isValid = false;
        stars = {};
        continue;
      }
      current = current * 10 + Number(map[y][x]);
      if (hasAdjSymbol(map, y, x)) isValid = true;
      collectStars(map, y, x, stars);
    }
  }

  let answer1 = parts.reduce((a, b) => a + b, 0);
  let answer2 = Object.values(gears)
    .filter(parts => parts.length == 2)
    .map(parts => parts[0] * parts[1])
    .reduce((a, b) => a + b, 0);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`);


solve(document.body.textContent);

})();

