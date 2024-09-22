// https://adventofcode.com/2022/day/24
// --- Day 24: Blizzard Basin ---
// Runtime: 644.19287109375 ms

(function() {
console.time('Runtime');

// up (^), down (v), left (<), or right (>), or wait in place
const kDirs = [[0, -1], [0, 1], [-1, 0], [1, 0], [0, 0]];
const kDirNames = "^v<>".split('');

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim().split(''));
}

function gcd(a, b) {
  while (a && b) [a, b] = [b, a % b];
  return a + b;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function getMinSteps(map, hops = 1) {
  const BY = map.length - 2;
  const BX = map[0].length - 2;
  const PERIOD = lcm(BX, BY);

  let [sx, sy] = [map[0].indexOf('.'), 0];
  let queue = [[sx, sy, 0]];
  let steps = 0;
  let seen = new Set();
  seen.add(getKey(sx, sy, 0, 0));
  while (queue.length > 0) {
    let wave = [];
    ++steps;
    while (queue.length > 0) {
      let [x, y, hop] = queue.pop();
      for (let i = 0; i < kDirs.length; ++i) {
        let [dx, dy] = kDirs[i];
        let [nx, ny] = [x + dx, y + dy];
        if (ny < 0 || ny >= map.length) continue;
        if (nx < 0 || nx >= map[ny].length) continue;
        if (map[ny][nx] == '#') continue;
        let nhop = hop;
        if (ny == 0 && (hop & 1) == 1) {
          ++nhop;
        }
        if (ny == map.length - 1 && (hop & 1) == 0) {
          ++nhop;
        }
        if (nhop == hops) return steps;
        if (hasBlizzard(nx, ny, steps)) continue;
        let key = getKey(nx, ny, nhop, steps);
        if (seen.has(key)) continue;
        seen.add(key);
        wave.push([nx, ny, nhop]);
      }
    }
    queue = wave;
  }

  function getKey(x, y, hop, step) {
    // Runtime: 1185.0419921875 ms
    // return x + ',' + y + ',' + hop + ',' + (step % PERIOD);

    // Runtime: 644.19287109375 ms
    let key = y * map[0].length + x;
    key = key * hops + hop;
    key = key * PERIOD + (step % PERIOD);
    return key;
  }

  function hasBlizzard(x, y, step) {
    if (y == 0 || y == map.length - 1) return false;
    console.assert(x > 0);
    // offset to [1, 1]
    --x;
    --y;
    for (let i = 0; i < kDirNames.length; ++i) {
      let ch = kDirNames[i];
      let [dx, dy] = kDirs[i];
      let nx = (x - dx * step) % BX;
      if (nx < 0) nx += BX;
      let ny = (y - dy * step) % BY;
      if (ny < 0) ny += BY;
      // offset back to [0, 0]
      ++nx;
      ++ny;
      if (map[ny][nx] == ch) return true;
    }
    return false;
  }
}

function solve(input) {
  let map = parseInput(input);

  let answer1 = getMinSteps(map);

  let answer2 = getMinSteps(map, 3);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

