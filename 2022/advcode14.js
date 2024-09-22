// https://adventofcode.com/2022/day/14
// --- Day 14: Regolith Reservoir ---
//
// Also see: https://adventofcode.com/2018/day/17

(function() {

const kFallDirs = [[0, 1], [-1, 1], [1, 1]];

function parseInput(input, startx = 500) {
  let lines = input.trim()
    .split('\n')
    .map(line => line.trim()
      .split(/\s*->\s*/)
      .map(pair => pair.trim().split(',').map(Number)));
  let points = lines.flatMap(x => x);
  let minx = Math.min(...points.map(([x, y]) => x));
  let maxx = Math.max(...points.map(([x, y]) => x));
  let miny = 0;
  let maxy = Math.max(...points.map(([x, y]) => y));

  // Leave some gap for the sand to drain down.
  --minx;
  ++maxx;
  --miny;

  let map = Array(maxy - miny + 1)
    .fill(0)
    .map(_ => Array(maxx - minx + 1).fill('.'));  
  lines.forEach(points => points.forEach(pt => {
    pt[0] -= minx;
  }));
  
  for (let line of lines) {
    let [x, y] = line[0];
    for (let [nx, ny] of line) {
      console.assert(x == nx || y == ny, x, y, nx, ny);
      while (1) {
        map[y][x] = '#';
        if (x == nx && y == ny) break;
        if (x < nx) ++x;
        if (x > nx) --x;
        if (y < ny) ++y;
        if (y > ny) --y;
      }
    }
  }
  startx -= minx;
  return [map, startx];
}

function fillSand(map, sx, sy) {
  let count = 0;
  while (dropSand(sx, sy)) {}

  // Add up overflow in Part2.
  let left = map
    .map(row => row[0])
    .filter(ch => ch == 'o')
    .length;
  let right = map
    .map(row => row[row.length - 1])
    .filter(ch => ch == 'o')
    .length;
  count += left * (left - 1) / 2;
  count += right * (right - 1) / 2;

  return count;

  function dropSand(x, y) {
    if (map[y][x] == 'o') return false;
    while (y < map.length) {
      let settled = true;
      for (let [dx, dy] of kFallDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (ny >= map.length) return false;
        if (nx < 0 || nx >= map[ny].length) {
          // Triggered in Part 2.
          continue;
        }
        if (map[ny][nx] != '.') continue;
        settled = false;
        [x, y] = [nx, ny];
        break;
      }
      if (settled) {
        console.assert(map[y][x] == '.');
        map[y][x] = 'o';
        ++count;
        return true;
      }
    }
  }
}

function printMap(map) {
  console.log(map.map(row => row.join('')).join('\n'));
}

function solve(input) {
  let [map, startx] = parseInput(input);
  let answer1 = fillSand(map, startx, 0);
  // printMap(map);

  [map, startx] = parseInput(input);
  map.push(Array(map[0].length).fill('#'));
  let answer2 = fillSand(map, startx, 0);
  // printMap(map);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`);

solve(document.body.textContent);

})();

