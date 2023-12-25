// https://adventofcode.com/2023/day/21
// --- Day 21: Step Counter ---
// Runtime: 158.91015625 ms

(function() {
console.time('Runtime');

const kDirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
const kQuadrants = [[1, 1], [-1, 1], [-1, -1], [1, -1]];

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim().split(''));
}

function findOnMap(map, ch) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == ch) return [x, y];
    }
  }
  console.assert(false);
}

function solve1(input, steps) {
  let map = parseInput(input);
  let [x, y] = findOnMap(map, 'S');
  let queue = [[x, y]];
  for (let step = 0; step < steps; ++step) {
    let next = [];
    let seen = new Set();
    while (queue.length > 0) {
      [x, y] = queue.pop();
      for (let [dx, dy] of kDirs) {
        let ny = y + dy;
        let nx = x + dx;
        if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
        if (map[ny][nx] == '#') continue;
        let key = (ny << 16) | nx;
        if (seen.has(key)) continue;
        seen.add(key);
        next.push([nx, ny]);
      }
    }
    queue = next;
  }
  console.log('Answer 1 (steps = %d):', steps, queue.length);
}

function reposition(map, [dx, dy]) {
  const SY = map.length;
  const SX = map[0].length;
  let nmap = map.map(row => row.slice());
  let [x0, y0] = findOnMap(map, 'S');
  for (let y = 0; y < SY; ++y) {
    for (let x = 0; x < SX; ++x) {
      let ny = (y0 + dy * y + SY) % SY;
      let nx = (x0 + dx * x + SX) % SX;
      nmap[y][x] = map[ny][nx];
    }
  }
  return nmap;
}

function double(map) {
  map = [...map, ...map];
  return map.map(row => [...row, ...row]);
}

function getDistanceMap(map) {
  const SY = map.length;
  const SX = map[0].length;
  const reachableCount = map
    .map(row => row.filter(ch => ch != '#').length)
    .reduce((a, b) => a + b, 0);

  let queue = [[0, 0]];
  let seen = new Set();
  let key = makeKey(0, 0);
  seen.add(key);
  let reached = 1;
  let distances = Array(SY).fill(0).map(_ => Array(SX).fill(-1));
  distances[0][0] = 0;

  let step = 0;
  while (queue.length > 0) {
    ++step;
    let next = [];
    while (queue.length > 0) {
      let [x, y] = queue.pop();
      for (let [dx, dy] of kDirs) {
        let ny = y + dy;
        let nx = x + dx;
        // if (nx < 0 || ny < 0 || nx >= SX || ny >= SY) continue;
        // if (nx < -SX || ny < -SY || nx > 2*SX || ny > 2*SY) continue;
        if (nx < -2 || ny < -2 || nx > SX+2 || ny > SY+2) continue;
        let iy = ((ny % SY) + SY) % SY;
        let ix = ((nx % SX) + SX) % SX;
        if (map[iy][ix] == '#') continue;
        let key = makeKey(nx, ny);
        if (seen.has(key)) continue;
        seen.add(key);
        next.push([nx, ny]);
        if (0 <= nx && nx < SX && 0 <= ny && ny < SY) {
          ++reached;
          distances[ny][nx] = step;
        }
      }
    }
    if (reached == reachableCount) break;
    queue = next;
  }

  return distances;

  function makeKey(x, y) {
    return x + "," + y;
  }
}

function printMap(map) {
  console.log(map.map(row => row.join('')).join('\n'));
}

function solve2Quarter(map, steps) {
  // printMap(map);
  const SY = map.length;
  const SX = map[0].length;
  console.assert(SX % 2 == 0);
  console.assert(SY % 2 == 0);

  let distanceMap = getDistanceMap(map);

  // HACK: Assume special form of the input data.
  console.assert(distanceMap[0][SX - 1] == SX - 1);
  console.assert(distanceMap[SY - 1][0] == SY - 1);
  for (let y = 0; y < SY; ++y) {
    console.assert(distanceMap[y][0] == y);
    let d = distanceMap[y][SX - 1];
    if (d == -1) continue;
    console.assert(d == SX - 1 + y || d == SX - 1 + y + 2, d, SX - 1, y);
  }
  for (let x = 0; x < SX; ++x) {
    console.assert(distanceMap[0][x] == x);
    let d = distanceMap[SY - 1][x];
    if (d == -1) continue;
    console.assert(d == SY - 1 + x || d == SY - 1 + x + 2, d, SY - 1, x);
  }
  
  let distances = Array(SX * SY).fill(0);
  
  let maxDistance = -Infinity;
  for (let y = 0; y < SY; ++y) {
    for (let x = 0; x < SX; ++x) {
      let d = distanceMap[y][x];
      if (d < 0) continue;
      console.assert(d < distances.length);
      if ((d & 1) != (steps & 1)) continue;
      distances[d]++;
      maxDistance = Math.max(maxDistance, d);
    }
  }
  for (let i = 1; i < distances.length; ++i) {
    distances[i] += distances[i - 1];
  }
  let maxReachable = distances[distances.length - 1];

  let result = 0;
  for (let ox = 0; ox * SX <= steps; ++ox) {
    let oy = Math.floor((steps - ox * SX) / SY);
    for (; oy >= 0; --oy) {
      let left = steps - ox * SX - oy * SY;
      console.assert(left >= 0);
      if (left >= maxDistance) break;
      result += distances[left];
    }
    result += (oy + 1) * maxReachable;
  }

  // ------------------------------------
  // Remove half of what's on the border.
  // ------------------------------------
  let onBorder = 0;

  distances = Array(SX + SY).fill(0);
  maxDistance = -Infinity;
  for (let x = 0; x < SX; ++x) {
    let d = distanceMap[0][x];
    if (d < 0) continue;
    console.assert(d < SX);
    if ((d & 1) != (steps & 1)) continue;
    distances[d]++;
    maxDistance = Math.max(maxDistance, d);
  }
  for (let i = 1; i < distances.length; ++i) {
    distances[i] += distances[i - 1];
  }
  maxReachable = distances[distances.length - 1];
  
  let ox = Math.floor(steps / SX);
  for (; ox >= 0; --ox) {
    let left = steps - ox * SX;
    console.assert(left >= 0);
    if (left >= maxDistance) break;
    onBorder += distances[left];
  }
  onBorder += (ox + 1) * maxReachable;

  distances = Array(SX + SY).fill(0);
  maxDistance = -Infinity;
  for (let y = 0; y < SY; ++y) {
    let d = distanceMap[y][0];
    if (d < 0) continue;
    if ((d & 1) != (steps & 1)) continue;
    distances[d]++;
    maxDistance = Math.max(maxDistance, d);
  }
  for (let i = 1; i < distances.length; ++i) {
    distances[i] += distances[i - 1];
  }
  maxReachable = distances[distances.length - 1];
  
  let oy = Math.floor(steps / SY);
  for (; oy >= 0; --oy) {
    let left = steps - oy * SY;
    console.assert(left >= 0);
    if (left >= maxDistance) break;
    onBorder += distances[left];
  }
  onBorder += (oy + 1) * maxReachable;

  console.assert(onBorder % 2 == 0, onBorder);
  result -= onBorder / 2;

  return result;
}

function solve2(input, steps) {
  let map = parseInput(input);
  let result = steps % 2 == 0 ? 1 : 0;
  for (let q of kQuadrants) {
    result += solve2Quarter(double(reposition(map, q)), steps);
  }
  console.log('Answer 2 (steps = %d):', steps, result);
}

solve1(`
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`, 6);

solve1(document.body.textContent, 64);

solve2(document.body.textContent, 26501365);

console.timeEnd('Runtime');
})();
