// https://adventofcode.com/2022/day/17
// --- Day 17: Pyroclastic Flow ---
// Runtime: 70.42578125 ms

(function() {
console.time('Runtime');

const kRocks = [
  '####',
  '.#.\n###\n.#.',
  '..#\n..#\n###',
  '#\n#\n#\n#',
  '##\n##'
].map(str => str.split('\n').map(row => row.split('')));

function parseInput(input) {
  return input.trim()
    .split('')
    .map(ch => (ch == '>') ? 1 : -1);
}

function simulate(moves, fallenCount) {
  let currentRock = 0;
  let currentMove = 0;
  let map = [];
  let height = 0;
  let cache = new Map();

  let count = 0;
  while (1) {
    if (++count > fallenCount) break;
    let rock = kRocks[currentRock++];
    currentRock %= kRocks.length;
    let left = 2;
    let bottom = map.length + 3;
    while (bottom >= 0) {
      left = doSideMove(rock, left, bottom);
      bottom = doFallDown(rock, left, bottom);
    }
    height += reduceMap();

    let key = getCacheKey();
    if (!cache.has(key)) {
      cache.set(key, [count, height]);
      continue;
    }
    let [prevCount, prevHeight] = cache.get(key);
    let diffCount = count - prevCount;
    let diffHeight = height - prevHeight;
    console.assert(diffCount > 0);

    // count + diffCount * N <= fallenCount
    // N <= (fallenCount - count) / diffCount
    let N = Math.floor((fallenCount - count) / diffCount);
    count += diffCount * N;
    height += diffHeight * N;
  }

  // console.log(map.slice().reverse().map(row => row.join('')).join('\n'));
  return height + map.length;

  function getCacheKey() {
    return [map.join(''), currentMove, currentRock].join('/');
  }

  function reduceMap() {
    const kDirs = [[-1, 0], [1, 0], [0, -1]];
    if (map.length < 2) return 0;
    let queue = Array(7).fill(0).map((_, index) => [index, map.length]);
    let seen = new Set();
    let height = map.length;
    while (queue.length > 0) {
      let [x, y] = queue.pop();
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (nx < 0 || nx >= 7) continue;
        if (ny < 0 || ny >= map.length) continue;
        if (map[ny][nx] == '#') continue;
        let key = ny * 7 + nx;
        if (seen.has(key)) continue;
        seen.add(key);
        queue.push([nx, ny]);
        height = Math.min(height, ny);
      }
    }
    if (height) {
      map.splice(0, height);
    }
    return height;
  }

  function doSideMove(rock, left, bottom) {
    let dx = moves[currentMove++];
    currentMove %= moves.length;
    if (isOverlap(rock, left + dx, bottom)) return left;
    return left + dx;
  }

  function doFallDown(rock, left, bottom) {
    --bottom;
    if (bottom >= map.length) return bottom;
    if (!isOverlap(rock, left, bottom)) return bottom;
    ++bottom;

    for (let y = rock.length - 1; y >= 0; --y) {
      let mapY = bottom + rock.length - 1 - y;
      if (mapY >= map.length) {
        console.assert(mapY == map.length);
        map.push('.......'.split(''));
      }
      for (let x = 0; x < rock[y].length; ++x) {
        if (rock[y][x] != '#') continue;
        console.assert(map[mapY][left + x] == '.');
        map[mapY][left + x] = '#';
      }
    }
    return -1;
  }

  function isOverlap(rock, left, bottom) {
    if (bottom < 0) return true;
    let RX = rock[0].length;
    if (left < 0 || left + RX > 7) return true;
    for (let y = rock.length - 1; y >= 0; --y) {
      let mapY = bottom + rock.length - 1 - y;
      if (mapY >= map.length) break;
      for (let x = 0; x < RX; ++x) {
        let mapX = left + x;
        console.assert(0 <= mapX && mapX < 7);
        if (map[mapY][mapX] == '#' && rock[y][x] == '#') {
          return true;
        }
      }
    }
    return false;
  }
}

function solve(input) {
  let moves = parseInput(input);

  let answer1 = simulate(moves, 2022);

  let answer2 = simulate(moves, 1000000000000);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

