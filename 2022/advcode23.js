// https://adventofcode.com/2022/day/23
// --- Day 23: Unstable Diffusion ---
// Runtime: 1401.754150390625 ms

(function() {
console.time('Runtime');

const kDirs = [
  [[0, -1], [1, -1], [-1, -1]], // N, NE, or NW
  [[0, 1], [1, 1], [-1, 1]], // S, SE, or SW
  [[-1, 0], [-1, -1], [-1, 1]], // W, NW, or SW
  [[1, 0], [1, -1], [1, 1]], // E, NE, or SE
];

const kAllDirs = [
  [0, -1], [1, -1], [-1, -1], // N, NE, or NW
  [0, 1], [1, 1], [-1, 1], // S, SE, or SW
  [-1, 0], // W
  [1, 0], // E
];

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.split(''));
}

function toCoords(map) {
  let result = [];
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == '#') result.push([x, y]);
    }
  }
  return result;
}

function simulate(coords, round) {
  function getKey([x, y]) {
    // Runtime: 2519.26708984375 ms
    // return x + ',' + y;

    // Runtime: 1401.754150390625 ms
    const MAX = 4096;
    console.assert(-MAX < x && x < MAX);
    console.assert(-MAX < y && y < MAX);
    return ((x + MAX) << 16) | (y + MAX);
  }

  let coordsSet = new Set(coords.map(getKey));
  let nextCoords = [];
  for (let [x, y] of coords) {
    let proposed = [x, y];
    let around = kAllDirs
      .map(([dx, dy]) => [x + dx, y + dy])
      .map(getKey)
      .filter(key => coordsSet.has(key))
      .length;
    if (around == 0) {
      nextCoords.push(proposed);
      continue;
    }
    for (let k = 0; k < kDirs.length; ++k) {
      let dirs = kDirs[(round + k) % kDirs.length];
      let elves = dirs
        .map(([dx, dy]) => [x + dx, y + dy])
        .map(getKey)
        .filter(key => coordsSet.has(key))
        .length;
      if (elves == 0) {
        let [dx, dy] = dirs[0];
        proposed = [x + dx, y + dy];
        break;
      }
    }
    nextCoords.push(proposed);
  }
  let nextMap = new Map();
  nextCoords
    .map(getKey)
    .forEach(key => nextMap.set(key, (nextMap.get(key) || 0) + 1));
  coords = nextCoords.map(([nx, ny], index) => {
    let key = getKey([nx, ny]);
    return (nextMap.get(key) == 1) ? [nx, ny] : coords[index];
  });
  return coords;
}

function solve1(coords, rounds) {
  for (let r = 0; r < rounds; ++r) {
    coords = simulate(coords, r);
  }
  let minx = Math.min(...coords.map(([x, y]) => x));
  let maxx = Math.max(...coords.map(([x, y]) => x));
  let miny = Math.min(...coords.map(([x, y]) => y));
  let maxy = Math.max(...coords.map(([x, y]) => y));
  let SY = maxy - miny + 1;
  let SX = maxx - minx + 1;

  let map = new Array(SY).fill(0).map(row => Array(SX).fill('.'));
  coords.forEach(([x, y]) => map[y - miny][x - minx] = '#');
  // console.log(map.map(row => row.join('')).join('\n'));

  return SX * SY - coords.length;
}

function solve2(coords) {
  for (let r = 0;; ++r) {
    let nextCoords = simulate(coords, r);
    let isSame = nextCoords
      .every(([nx, ny], i) => nx == coords[i][0] && ny == coords[i][1]);
    if (isSame) return r + 1;
    coords = nextCoords;
  }
}

function solve(input) {
  let map = parseInput(input);
  let coords = toCoords(map);

  let answer1 = solve1(coords, 10);

  let answer2 = solve2(coords);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

