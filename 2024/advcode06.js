// https://adventofcode.com/2024/day/6
// --- Day 6: Guard Gallivant ---
// Runtime: 1318.62890625 ms

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.trim().split(''));
}

function findStartPosition(map) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == '^') return [x, y];
    }
  }
  console.assert(false);
}

function toKey(x, y) {
  return (x << 16) | y;
}

function walkUntilOut(map) {
  let [x, y] = findStartPosition(map);
  let dir = 0;
  let visited = new Set();
  let states = new Set();
  
  while (1) {
    let key = toKey(x, y);
    visited.add(key);
    key = (key << 2) | dir;
    if (states.has(key)) return null;
    states.add(key);

    let [dx, dy] = kDirs[dir];
    let nx = x + dx;
    let ny = y + dy;
    if (ny < 0 || ny >= map.length) break;
    if (nx < 0 || nx >= map[ny].length) break;
    if (map[ny][nx] == '#') {
      dir = (dir + 1) & 3;
    } else {
      x = nx;
      y = ny;
    }
  }
  return visited;
}

function findLoopingObstructions(map, initiallyVisited) {
  let result = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] != '.') continue;
      // No point to try to put an obstruction at an initially unvisited spot.
      if (!initiallyVisited.has(toKey(x, y))) continue;
      map[y][x] = '#';
      if (walkUntilOut(map) == null) ++result;
      map[y][x] = '.';
    }
  }
  return result;
}

function solve(input) {
  let map = parseInput(input);

  let visited = walkUntilOut(map);
  let answer1 = visited.size;

  let answer2 = findLoopingObstructions(map, visited);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

