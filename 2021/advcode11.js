// https://adventofcode.com/2021/day/11
// --- Day 11: Dumbo Octopus ---

(function() {

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, -1], [-1, 1]];

function doFlash(map, x, y) {
  let flashes = 1;
  map[y][x] = 0;
  for (let [dx, dy] of kDirs) {
    let nx = x + dx;
    let ny = y + dy;
    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
    if (map[ny][nx] == 0) continue;
    ++map[ny][nx];
    if (map[ny][nx] > 9) flashes += doFlash(map, nx, ny);
  }
  return flashes;
}

function simulateStep(map) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      ++map[y][x];
    }
  }
  let flashes = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] > 9) flashes += doFlash(map, x, y);
    }
  }
  return flashes;
}

function solve1(map, steps) {
  map = map.map(row => [...row]); // make a copy
  let flashes = 0;
  while (steps-- > 0) {
    flashes += simulateStep(map);
  }
  return flashes;
}

function solve2(map) {
  map = map.map(row => [...row]); // make a copy
  const total_size = map.length * map[0].length;
  for (let steps = 1;; ++steps) {
    if (simulateStep(map) == total_size) return steps;
  }
}

function solve(input) {
  let map = input.trim().split('\n').map(row => row.trim().split('').map(Number));
  let answer1 = solve1(map, 100);
  let answer2 = solve2(map);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`);

solve(document.body.textContent);

})();

