// https://adventofcode.com/2018/day/23
// --- Day 23: Experimental Emergency Teleportation ---
//
// Runtime: 46.2822265625 ms

(function() {
console.time('Runtime');

//   7------6
//  /|     /|
// 4------5 |
// | |    | |
// | 3----|-2
// |/     |/
// 0------1
const kUnitCubeVertices = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [0, 1, 0],
  [0, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 1],
];

class Cube {
  constructor(origin, size) {
    this.origin = origin;
    this.size = size;  // vertexes count on edges
  }

  makeHalfCubes() {
    let half_size = Math.floor(this.size / 2);
    console.assert(half_size > 0, this);
    return kUnitCubeVertices.map(([dx, dy, dz]) => {
      let x = this.origin[0] + dx * half_size;
      let y = this.origin[1] + dy * half_size;
      let z = this.origin[2] + dz * half_size;
      return new Cube([x, y, z], half_size);
    });
  }

  getMinMaxDistancesToPoint(point) {
    let min = 0, max = 0;
    for (let i = 0; i < 3; ++i) {
      let x1 = this.origin[i];
      let x2 = this.origin[i] + this.size - 1;
      let x = point[i];
      if (x <= x1) {
        min += x1 - x;
        max += x2 - x;
      } else if (x >= x2) {
        min += x - x2;
        max += x - x1;
      } else {
        max += Math.max(x - x1, x2 - x);
      }
    }
    return [min, max];
  }
}

class Nanobot {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }

  inRange(point) {
    return getDistance(this.center, point) <= this.radius;
  }
}

function getDistance([x1, y1, z1], [x2, y2, z2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
}

function getBoundingBox(nanobots) {
  let bounds =
      [[Infinity, -Infinity], [Infinity, -Infinity], [Infinity, -Infinity]];
  for (let nanobot of nanobots) {
    for (let i = 0; i < 3; ++i) {
      bounds[i][0] = Math.min(bounds[i][0], nanobot.center[i] - nanobot.radius);
      bounds[i][1] = Math.max(bounds[i][1], nanobot.center[i] + nanobot.radius);
    }
  }
  let origin = [bounds[0][0], bounds[1][0], bounds[2][0]];
  let size = 0;
  for (let i = 0; i < 3; ++i) {
    size = Math.max(size, bounds[i][1] - bounds[i][0] + 1);
  }
  let n2 = 1;
  while (n2 < size) n2 *= 2;
  size = n2;
  return new Cube(origin, size);
}

function findMaxInRangePoint(nanobots) {
  let best_in_range = -1;
  let best_distance = -1;

  let queue = [];
  queue.push({cube: getBoundingBox(nanobots), nanobots, in_range: 0});

  while (queue.length > 0) {
    let {cube, nanobots, in_range} = queue.shift();

    if (cube.size == 1 || nanobots.length == 0) {
      let count = in_range +
          nanobots.filter(nanobot => nanobot.inRange(cube.origin)).length;
      let [distance] = cube.getMinMaxDistancesToPoint([0, 0, 0]);
      if (best_in_range < count ||
          (best_in_range == count && best_distance > distance)) {
        best_in_range = count;
        best_distance = distance;
      }
      continue;
    }

    cube.makeHalfCubes().forEach(sub_cube => {
      let sub_in_range = in_range;
      let sub_nanobots = nanobots.filter(nanobot => {
        let [min, max] = sub_cube.getMinMaxDistancesToPoint(nanobot.center);
        if (min > nanobot.radius) return false;
        if (max <= nanobot.radius) {
          ++sub_in_range;
          return false;
        }
        return true;
      });
      queue.push({cube: sub_cube, in_range: sub_in_range, nanobots: sub_nanobots});
    });

    queue.sort((s1, s2) => {
      let upper_bound1 = s1.in_range + s1.nanobots.length;
      let upper_bound2 = s2.in_range + s2.nanobots.length;
      if (upper_bound1 != upper_bound2) return upper_bound2 - upper_bound1;
      let [min1] = s1.cube.getMinMaxDistancesToPoint([0, 0, 0]);
      let [min2] = s2.cube.getMinMaxDistancesToPoint([0, 0, 0]);
      if (min1 != min2) return min1 - min2;
      return s1.cube.size - s2.cube.size;
    });

    // Remove from the queue those that can not improve the solution.
    for (; queue.length > 0; --queue.length) {
      let last = queue[queue.length - 1];
      let upper_bound = last.in_range + last.nanobots.length;
      if (upper_bound > best_in_range) break;
      if (upper_bound == best_in_range) {
        let [min] = last.cube.getMinMaxDistancesToPoint([0, 0, 0]);
        if (min < best_distance) break;
      }
    }
  }

  return best_distance;
}

function parseInput(input) {
  const regex = /pos=<\s*([\d-]+),\s*([\d-]+),\s*([\d-]+)>\s*,\s*r=\s*([\d]+)/;
  return input.trim().split('\n').map(line => {
    let [, x, y, z, r] = line.match(regex);
    return new Nanobot([+x, +y, +z], +r);
  });
}

function solve(input) {
  let nanobots = parseInput(input);
  nanobots.sort((n1, n2) => n2.radius - n1.radius);
  let answer1 = nanobots.filter(n => nanobots[0].inRange(n.center)).length;
  let answer2 = findMaxInRangePoint(nanobots);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5
`);

solve(`
pos=<0,0,0>, r=4
pos=<1,0,0>, r=1
pos=<4,0,0>, r=3
pos=<0,2,0>, r=1
pos=<0,5,0>, r=3
pos=<0,0,3>, r=1
pos=<1,1,1>, r=1
pos=<1,1,2>, r=1
pos=<1,3,1>, r=1
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

