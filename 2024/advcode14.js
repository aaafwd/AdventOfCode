// https://adventofcode.com/2024/day/14
// --- Day 14: Restroom Redoubt ---
// Runtime: 874.719970703125 ms

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  let lines = input.trim().split('\n');
  let regex = /p=(\d+),(\d+) v=([\d\-]+),([\d\-]+)/;
  let robots = [];
  for (let line of lines) {
    let [, x, y, vx, vy] = line.match(regex);
    robots.push([+x, +y, +vx, +vy]);
  }
  return robots;
}

function countQudrants(robots, X, Y) {
  let result = [0, 0, 0, 0];
  for (let [x, y, vx, vy] of robots) {
    if (x == (X - 1) / 2) continue;
    if (y == (Y - 1) / 2) continue;
    let x0 = (x < X / 2) ? 0 : 1;
    let y0 = (y < Y / 2) ? 0 : 1;
    let i = y0 * 2 + x0;
    result[i]++;
  }
  return result;
}

function simulate(robots, X, Y) {
  for (let i = 0; i < robots.length; ++i) {
    let [x, y, vx, vy] = robots[i];
    x += vx;
    y += vy;
    x %= X;
    y %= Y;
    if (x < 0) x += X;
    if (y < 0) y += Y;
    robots[i] = [x, y, vx, vy];
  }
}

function simulateRounds(robots, X, Y, rounds) {
  while (rounds-- > 0) {
    simulate(robots, X, Y);
  }
  return countQudrants(robots, X, Y);
}

function makeSpaceMap(robots, X, Y) {
  let map = Array(Y).fill(0).map(row => Array(X).fill('.'));
  for (let [x, y] of robots) {
    console.assert(0 <= x && x < X && 0 <= y && y < Y);
    map[y][x] = '#';
  }
  return map;
}

function mapToString(map) {
  return map.map(row => row.join('')).join('\n');
}

function findConnectedComponents(robots, X, Y) {
  let map = makeSpaceMap(robots, X, Y);
  let components = 0;
  for (let [x, y] of robots) {
    if (map[y][x] == '.') continue;
    ++components;
    let queue = [[x, y]];
    while (queue.length > 0) {
      [x, y] = queue.pop();
      map[y][x] = '.';
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (ny < 0 || ny >= Y || nx < 0 || nx >= X) continue;
        if (map[ny][nx] != '.') {
          queue.push([nx, ny]);
        }
      }
    }
  }
  return components;
}

function findEasterEgg(robots, X, Y) {
  let minComponents = Infinity;
  let minRounds = Infinity;
  let map = null;
  for (let round = 1; round <= 10000; ++round) {
    simulate(robots, X, Y);
    let components = findConnectedComponents(robots, X, Y);
    if (minComponents > components) {
      minComponents = components;
      minRounds = round;
      map = makeSpaceMap(robots, X, Y);
    }
  }
  console.log("minRounds:", minRounds, "minComponents:", minComponents);
  console.log(mapToString(map));
  return minRounds;
}

function solve(input, X, Y) {
  let robots = parseInput(input);

  let answer1 = simulateRounds(robots.slice(), X, Y, 100)
    .reduce((a, b) => a * b, 1);

  let answer2 = findEasterEgg(robots.slice(), X, Y);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
p=2,4 v=2,-3
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=9,5 v=-3,-3
`, 11, 7);

solve(document.body.textContent, 101, 103);

console.timeEnd('Runtime');
})();

