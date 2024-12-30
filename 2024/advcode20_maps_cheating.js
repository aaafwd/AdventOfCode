// https://adventofcode.com/2024/day/20
// --- Day 20: Race Condition ---
// Runtime: 371.48291015625 ms

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function mapsInRange(map, x, y) { return 0 <= y && y < map.length && 0 <= x && x < map[y].length; }

function toKey(x, y) {
  console.assert(0 <= x && x <= 0x7fff && 0 <= y && y <= 0xffff, x, y);
  return (x << 16) | y;
}

function mapsFindChar(map, ch) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == ch) return [x, y];
    }
  }
  console.assert(false, map, ch);
}

function parseInput(input) {
  return input.trim().split('\n').map(row => row.trim().split(''));
}

function findAllDistancesToEnd(map) {
  let distancesToEnd = map.map(row => Array(row.length).fill(-1));
  let [ex, ey] = mapsFindChar(map, 'E');
  let queue = [[ex, ey]];
  let steps = 0;
  distancesToEnd[ey][ex] = 0;
  while (queue.length > 0) {
    ++steps;
    let wave = [];
    while (queue.length > 0) {
      let [x, y] = queue.pop();
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (!mapsInRange(map, nx, ny)) continue;
        if (map[ny][nx] == '#') continue;
        if (distancesToEnd[ny][nx] != -1) continue;
        wave.push([nx, ny]);
        distancesToEnd[ny][nx] = steps;
      }
    }
    queue = wave;
  }
  let [sx, sy] = mapsFindChar(map, 'S');
  console.assert(distancesToEnd[sy][sx] != -1);
  return distancesToEnd;
}

function findAllCheats(map, distancesToEnd, cheatDuration, savingsThreshold) {
  let path = [];
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (distancesToEnd[y][x] != -1) path.push([x, y]);
    }
  }

  let cheats = 0;
  for (let i = 0; i < path.length; ++i) {
    let [x1, y1] = path[i];
    for (let j = i + 1; j < path.length; ++j) {
      let [x2, y2] = path[j];
      let diffCheat = Math.abs(x2 - x1) + Math.abs(y2 - y1);
      if (diffCheat > cheatDuration) continue;
      let diffNoCheat = Math.abs(distancesToEnd[y2][x2] - distancesToEnd[y1][x1]);
      let savings = diffNoCheat - diffCheat;
      if (savings >= savingsThreshold) {
        ++cheats;
      }
    }
  }
  return cheats;
}

function solve(input, savingsThreshold) {
  let map = parseInput(input);
  let distancesToEnd = findAllDistancesToEnd(map);

  let answer1 = findAllCheats(map, distancesToEnd, 2, savingsThreshold);

  let answer2 = findAllCheats(map, distancesToEnd, 20, savingsThreshold);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`, 50);

solve(document.body.textContent, 100);

console.timeEnd('Runtime');
})();

