v// https://adventofcode.com/2024/day/18
// --- Day 18: RAM Run ---
// Runtime: 37.211181640625 ms (with the shortest path optimization)
// Runtime: 771.427978515625 ms (without the optimization)

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function mapsNew(X, Y) { return Array(Y).fill(0).map(row => Array(X).fill('.')); }
function mapsInRange(map, x, y) { return 0 <= y && y < map.length && 0 <= x && x < map[y].length; }

function toKey(x, y) {
  console.assert(0 <= x && x <= 0x7fff && 0 <= y && y <= 0xffff, x, y);
  return (x << 16) | y;
}
function fromKey(key) { return [key >> 16, key & 0xffff]; }

function parseInput(input) {
  return input.trim().split('\n').map(row => row.trim().split(',').map(x => +x));
}

function simulate(points, X, Y, size) {
  let map = mapsNew(X, Y);
  for (let i = 0; i < points.length && i < size; ++i) {
    let [x, y] = points[i];
    map[y][x] = '#';
  }
  return map;
}

function findPath(map) {
  let [sx, sy] = [0, 0];
  let [ex, ey] = [map[0].length - 1, map.length - 1];
  let queue = [[sx, sy]];
  let visited = new Map();
  visited.set(toKey(sx, sy), [-1, -1]);
  let steps = 0;
  while (queue.length > 0) {
    let wave = [];
    while (queue.length > 0) {
      let [x, y] = queue.pop();
      if (x == ex && y == ey) return [steps, getPath()];
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (!mapsInRange(map, nx, ny)) continue;
        if (map[ny][nx] == '#') continue;
        let key = toKey(nx, ny);
        if (visited.has(key)) continue;
        visited.set(key, [x, y]);
        wave.push([nx, ny]);
      }
    }
    queue = wave;
    ++steps;
  }
  function getPath() {
    let path = new Set();
    let [x, y] = [ex, ey];
    while (1) {
      let key = toKey(x, y);
      path.add(key);
      [x, y] = visited.get(key);
      if (x < 0) break;
    }
    return path;
  }
  return [-1, null];
}

function findFirstByteNotReachable(points, X, Y, L) {
  let map = mapsNew(X, Y);
  let steps = 0;
  let path = null;
  for (let i = 0; i < points.length; ++i) {
    let [x, y] = points[i];
    map[y][x] = '#';
    if (i < L) continue;
    // Optimization: fast check if the last shortest path was broken.
    if (path != null && !path.has(toKey(x, y))) continue;
    [steps, path] = findPath(map);
    if (steps == -1) return [x, y];
  }
  return [-1, -1];
}

function solve(input, X, Y, L) {
  let points = parseInput(input);

  let answer1 = findPath(simulate(points, X, Y, L))[0];

  let answer2 = findFirstByteNotReachable(points, X, Y, L);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2.join(','));
}

solve(`
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`, 7, 7, 12);

solve(document.body.textContent, 71, 71, 1024);

console.timeEnd('Runtime');
})();

