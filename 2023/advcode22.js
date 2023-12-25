// https://adventofcode.com/2023/day/22
// --- Day 22: Sand Slabs ---
// Runtime: 1977.97216796875 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim()
      .split('~')
      .map(coords => coords.trim()
        .split(',')
        .map(x => +x)));
}

function findMinMax(array) {
  return [Math.min(...array), Math.max(...array)];
}

function interate([x1, y1, z1], [x2, y2, z2]) {
  let result = [];
  if (x1 > x2) [x1, x2] = [x2, x1];
  if (y1 > y2) [y1, y2] = [y2, y1];
  if (z1 > z2) [z1, z2] = [z2, z1];
  for (let z = z1; z <= z2; ++z) {
    for (let x = x1; x <= x2; ++x) {
      for (let y = y1; y <= y2; ++y) {
        result.push([x, y, z]);
      }
    }
  }
  return result;
}

function buildMap(cubes) {
  let [minx, maxx] = findMinMax(cubes.flatMap(ends => ends).map(coords => coords[0]));
  let [miny, maxy] = findMinMax(cubes.flatMap(ends => ends).map(coords => coords[1]));
  let [minz, maxz] = findMinMax(cubes.flatMap(ends => ends).map(coords => coords[2]));

  let sizex = maxx - minx + 1;
  let sizey = maxy - miny + 1;
  let sizez = maxz - minz + 1;
  let map = Array(sizez).fill(0)
    .map(z => Array(sizex).fill(0)
      .map(x => Array(sizey).fill(0)));
  let bricks = Array(cubes.length).fill(0).map(_ => []);
  let bases = Array(cubes.length).fill(0).map(_ => []);
  for (let i = 0; i < cubes.length; ++i) {
    let cube = cubes[i];
    interate(cube[0], cube[1]).forEach(([x, y, z]) => {
      x -= minx;
      y -= miny;
      z -= minz;
      map[z][x][y] = i + 1;
      bricks[i].push([x, y, z]);
    });
    let baze = Math.min(...bricks[i].map(([x, y, z]) => z));
    bases[i] = bricks[i].filter(([x, y, z]) => z == baze);
  }
  return [map, bricks, bases];
}

function findMaxFallingDepth(map, base) {
  for (let depth = 1 ;; ++depth) {
    if (!base.every(([x, y, z]) => z - depth >= 0 && map[z - depth][x][y] == 0)) {
      return depth - 1;
    }
  }
}

function findFallingBrick(map, bases, opt_skip = -1) {
  for (let i = 0; i < bases.length; ++i) {
    if (i == opt_skip) continue;
    let depth = findMaxFallingDepth(map, bases[i]);
    if (depth == 0) continue;
    return [i, depth];
  }
  return [-1, 0];
}
  
function fallDown(map, bricks, bases, opt_skip = -1) {
  let fallen = new Set();
  while (1) {
    let [brick, depth] = findFallingBrick(map, bases, opt_skip);
    if (brick == -1) break;
    let coords = bricks[brick];
    coords.forEach(([x, y, z]) => map[z][x][y] = 0);
    // `bases` is an in-place view and should not be updated.
    for (let i = 0; i < coords.length; ++i) {
      coords[i][2] -= depth;
    }
    coords.forEach(([x, y, z]) => map[z][x][y] = brick);
    fallen.add(brick);
  }
  return fallen;
}

function countDisintegrated(map, bricks, bases) {
  let result = 0;
  for (let i = 0; i < bricks.length; ++i) {
    let coords = bricks[i];
    coords.forEach(([x, y, z]) => map[z][x][y] = 0);
    if (findFallingBrick(map, bases, i)[0] == -1) ++result;
    coords.forEach(([x, y, z]) => map[z][x][y] = i + 1);
  }
  return result;
}

function cloneMap(map) {
  return map.map(z => z.map(x => x.slice()));
}

function countDisintegrated2(map, bricks, bases) {
  let result = 0;
  for (let i = 0; i < bricks.length; ++i) {
    let coords = bricks[i];
    coords.forEach(([x, y, z]) => map[z][x][y] = 0);
    let hasFalling = (findFallingBrick(map, bases, i)[0] != -1);

    if (hasFalling) {
      let nmap = cloneMap(map);
      let nbricks = bricks.map(coords => coords.map(xyz => xyz.slice()));
      let nbases = nbricks.map(nbrick => {
        let baze = Math.min(...nbrick.map(([x, y, z]) => z));
        return nbrick.filter(([x, y, z]) => z == baze);
      });
      
      let fallen = fallDown(nmap, nbricks, nbases, i);
      result += fallen.size;
    }
    
    coords.forEach(([x, y, z]) => map[z][x][y] = i + 1);
  }
  return result;
}

function solve(input) {
  let cubes = parseInput(input);
  let [map, bricks, bases] = buildMap(cubes);
  fallDown(map, bricks, bases);
  
  let answer1 = countDisintegrated(map, bricks, bases);
  let answer2 = countDisintegrated2(map, bricks, bases);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();
