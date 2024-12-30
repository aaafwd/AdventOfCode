// https://adventofcode.com/2024/day/12
// --- Day 12: Garden Groups ---
// Runtime: 22.56298828125 ms

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.trim().split(''));
}

function toKey(x, y) {
  return (x << 16) | y;
  // return x + ',' + y;
}

function fromKey(key) {
  return [key >> 16, key & 0xffff];
  // return key.split(',').map(x => +x);
}

function visitRegion(map, x0, y0, visited) {
  let area = 0;
  let perimeter = 0;
  visited.add(toKey(x0, y0));
  let queue = [[x0, y0]];
  let boundary = [];
  while (queue.length > 0) {
    let [x, y] = queue.pop();
    ++area;
    for (let [dx, dy] of kDirs) {
      let nx = x + dx;
      let ny = y + dy;
      if (ny < 0 || ny >= map.length ||
          nx < 0 || nx >= map[ny].length ||
          map[ny][nx] != map[y0][x0]) {
        ++perimeter;
        boundary.push([x, y, dx, dy]);
        continue;
      }
      if (visited.has(toKey(nx, ny))) continue;
      visited.add(toKey(nx, ny));
      queue.push([nx, ny]);
    }
  }
  return [area, perimeter, boundary];
}

function countContinuousSides(points) {
  let sides = 0;
  let visited = new Set();
  points = new Set(points.map(([x, y]) => toKey(x, y)));
  for (let key of points) {
    if (visited.has(key)) continue;
    visited.add(key);
    ++sides;
    let [x, y] = fromKey(key);
    for (let [dx, dy] of kDirs) {
      for (let i = 1;; ++i) {
        let nx = x + dx * i;
        let ny = y + dy * i;
        let nkey = toKey(nx, ny)
        if (!points.has(nkey)) break;
        visited.add(nkey);
      }
    }
  }
  return sides;
}

function countSides(boundary) {
  let sides = 0;
  let grouped = kDirs
    .map(([dx, dy]) => boundary
      .filter(([x, y, ndx, ndy]) => ndx == dx && ndy == dy)
      .map(([x, y, ndx, ndy]) => [x, y]));
  for (let line of grouped) {
    sides += countContinuousSides(line);
  }
  return sides;
}

function fenceRegions(map) {
  let visited = new Set();
  let price1 = 0;
  let price2 = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (visited.has(toKey(x, y))) continue;
      let [area, perimeter, boundary] = visitRegion(map, x, y, visited);
      price1 += area * perimeter;
      let sides = countSides(boundary);
      price2 += area * sides;
    }
  }
  return [price1, price2];
}

function solve(input) {
  let map = parseInput(input);

  let [answer1, answer2] = fenceRegions(map);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
AAAA
BBCD
BBCC
EEEC
`);

solve(`
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO
`);

solve(`
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

