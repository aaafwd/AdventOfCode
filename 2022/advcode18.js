// https://adventofcode.com/2022/day/18
// --- Day 18: Boiling Boulders ---
// Runtime: 41.0029296875 ms

(function() {
console.time('Runtime');

const kDirs3D = [
  [0, 0, 1], [0, 0, -1],
  [0, 1, 0], [0, -1, 0],
  [1, 0, 0], [-1, 0, 0],
];

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim().split(',').map(Number));
}

function getTotalSurface(cubes) {
  let result = cubes.length * 6;
  for (let i = 0; i < cubes.length; ++i) {
    let [x1, y1, z1] = cubes[i];
    for (let j = i + 1; j < cubes.length; ++j) {
      let [x2, y2, z2] = cubes[j];
      let dx = Math.abs(x1 - x2);
      let dy = Math.abs(y1 - y2);
      let dz = Math.abs(z1 - z2);
      if (dx + dy + dz == 1) result -= 2;
    }
  }
  return result;
}

function getExteriorSurface(cubes) {
  let [minx, miny, minz] = Array(3).fill(Infinity);
  let [maxx, maxy, maxz] = Array(3).fill(-Infinity);
  for (let [x, y, z] of cubes) {
    minx = Math.min(minx, x);
    miny = Math.min(miny, y);
    minz = Math.min(minz, z);
    maxx = Math.max(maxx, x);
    maxy = Math.max(maxy, y);
    maxz = Math.max(maxz, z);
  }
  let SX = maxx - minx + 3;
  let SY = maxy - miny + 3;
  let SZ = maxz - minz + 3;
  let map = Array(SX).fill(0)
    .map(x => Array(SY).fill(0)
      .map(y => Array(SZ).fill(-1)));
  for (let [x, y, z] of cubes) {
    map[x - minx + 1][y - miny + 1][z - minz + 1] = 1;
  }

  let result = 0;
  let queue = [[0, 0, 0]];
  while (queue.length > 0) {
    let [x, y, z] = queue.pop();
    if (x < 0 || x >= map.length) continue;
    if (y < 0 || y >= map[x].length) continue;
    if (z < 0 || z >= map[x][y].length) continue;
    if (map[x][y][z] == 0) continue;
    if (map[x][y][z] == 1) {
      ++result;
      continue;
    }
    map[x][y][z] = 0;
    for (let [dx, dy, dz] of kDirs3D) {
      queue.push([x + dx, y + dy, z + dz]);
    }
  }
  return result;
}

function solve(input) {
  let cubes = parseInput(input);

  let answer1 = getTotalSurface(cubes);

  let answer2 = getExteriorSurface(cubes);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

