// https://adventofcode.com/2021/day/9
// --- Day 9: Smoke Basin ---

(function() {

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  return input.trim().split('\n').map(row => row.trim().split('').map(Number));
}

function getAdjacent(map, x, y) {
  let result = [];
  for (let [dx, dy] of kDirs) {
    let nx = x + dx;
    let ny = y + dy;
    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
    result.push([nx, ny]);
  }
  return result;
}

function solve1(map) {
  let result = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      let level = map[y][x];
      let has_lower = getAdjacent(map, x, y).some(([nx, ny]) => map[ny][nx] <= level);
      if (!has_lower) result += level + 1;
    }
  }
  return result;
}

function markBasin(map, x, y) {
  let size = 1;
  map[y][x] = 9;
  getAdjacent(map, x, y).forEach(([nx, ny]) => {
    if (map[ny][nx] != 9) size += markBasin(map, nx, ny);
  });
  return size;
}

function solve2(map) {
  let sizes = [];
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == 9) continue;
      sizes.push(markBasin(map, x, y));
    }
  }
  sizes.sort((x, y) => y - x);
  return sizes[0] * sizes[1] * sizes[2];
}

function solve(input) {
  let map = parseInput(input);
  let answer1 = solve1(map);
  let answer2 = solve2(map);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
2199943210
3987894921
9856789892
8767896789
9899965678
`);

solve(document.body.textContent);

})();

