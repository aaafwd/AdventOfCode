// https://adventofcode.com/2022/day/12
// --- Day 12: Hill Climbing Algorithm ---

(function() {

const kDirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function parseInput(input) {
  let map = input.trim()
    .split('\n')
    .map(row => row.trim().split(''));
  let [sx, sy] = findOnMap(map, 'S');
  let [ex, ey] = findOnMap(map, 'E');
  map[sy][sx] = 'a';
  map[ey][ex] = 'z';
  map = map.map(row => row.map(ch => ch.charCodeAt(0) - 'a'.charCodeAt(0)));
  return [map, [sx, sy], [ex, ey]];
}

function findOnMap(map, ch) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == ch) return [x, y];
    }
  }
  console.assert(false);
}

function bfs(map, [sx, sy], [ex, ey]) {
  let seen = map.map(row => Array(row.length).fill(0));
  seen[sy][sx] = 1;
  let queue = [[sx, sy]];
  let steps = 0;
  while (queue.length > 0) {
    ++steps;
    let wave = [];
    while (queue.length > 0) {
      let [x, y] = queue.pop();
      for (let [dy, dx] of kDirs) {
        let ny = y + dy;
        let nx = x + dx;
        if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
        if (map[ny][nx] > map[y][x] + 1) continue;
        if (ny == ey && nx == ex) return steps;
        if (seen[ny][nx]) continue;
        seen[ny][nx] = 1;
        wave.push([nx, ny]);
      }
    }
    queue = wave;
  }
  return Infinity;
}

function solve(input) {
  let [map, start, end] = parseInput(input);

  let answer1 = bfs(map, start, end);

  let answer2 = Infinity;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == 0) {
        answer2 = Math.min(answer2, bfs(map, [x, y], end));
      }
    }
  }

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`);

solve(document.body.textContent);

})();

