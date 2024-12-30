// https://adventofcode.com/2024/day/10
// --- Day 10: Hoof It ---

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.trim().split('').map(x => +x));
}

function countPathsFrom(x0, y0, map) {
  let queue = [[x0, y0]];
  let step = 0;
  let paths = 0;
  while (queue.length > 0) {
    if (++step == 10) return queue;
    let wave = [];
    while (queue.length > 0) {
      let [x, y] = queue.pop();
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (ny < 0 || ny >= map.length) continue;
        if (nx < 0 || nx >= map[ny].length) continue;
        if (map[ny][nx] != step) continue;
        wave.push([nx, ny]);
      }
    }
    queue = wave;
  }
  return [];
}

function countPaths(map) {
  let totalPaths = 0;
  let totalTargets = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] != 0) continue;
      let paths = countPathsFrom(x, y, map);
      totalPaths += paths.length;
      let targets = new Set(paths.map(it => it.toString()));
      totalTargets += targets.size;
    }
  }
  return [totalTargets, totalPaths];
}

function solve(input) {
  let map = parseInput(input);
  let [answer1, answer2] = countPaths(map);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

