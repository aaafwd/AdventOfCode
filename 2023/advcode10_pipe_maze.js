// https://adventofcode.com/2023/day/10
// --- Day 10: Pipe Maze ---

(function() {

const kDirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim().split(''));
}

function findOnMap(map, ch) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == ch) return [x, y];
    }
  }
  console.assert(false);
}

function allowedMoveTo(dx, dy, nx, ny, map) {
  let ch = map[ny][nx];
  if (ch == '.') return false;
  if (ch == '-') return dy == 0;
  if (ch == '|') return dx == 0;
  if (ch == 'L') return (dy == 1 && dx == 0) || (dy == 0 && dx == -1);
  if (ch == 'J') return (dy == 1 && dx == 0) || (dy == 0 && dx == 1);
  if (ch == 'F') return (dy == -1 && dx == 0) || (dy == 0 && dx == -1);
  if (ch == '7') return (dy == -1 && dx == 0) || (dy == 0 && dx == 1);
  if (ch == 'S') return true;
  console.assert(false, ch);
}

function allowedMoveFrom(dx, dy, x, y, map) {
  let ch = map[y][x];
  if (ch == '-') return dy == 0;
  if (ch == '|') return dx == 0;
  if (ch == 'L') return (dy == -1 && dx == 0) || (dy == 0 && dx == 1);
  if (ch == 'J') return (dy == -1 && dx == 0) || (dy == 0 && dx == -1);
  if (ch == 'F') return (dy == 1 && dx == 0) || (dy == 0 && dx == 1);
  if (ch == '7') return (dy == 1 && dx == 0) || (dy == 0 && dx == -1);
  if (ch == 'S') return true;
  console.assert(false, ch);
}

function findCycle(map) {
  let [x0, y0] = findOnMap(map, 'S');
  let path = [[x0, y0]];
  while (true) {
    let [x, y] = path[path.length - 1];
    let [px, py] = path.length > 1 ? path[path.length - 2] : [-1, -1];
    for (let i = 0; i < kDirs.length; ++i) {
      let [dy, dx] = kDirs[i];
      let ny = y + dy;
      let nx = x + dx;
      if (nx == px && ny == py) continue;
      if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
      if (!allowedMoveFrom(dx, dy, x, y, map)) continue;
      if (!allowedMoveTo(dx, dy, nx, ny, map)) continue;
      if (nx == x0 && ny == y0) return path;
      path.push([nx, ny]);
      break;
    }
  }
  return path;
}

function getDirIndex(x, y, nx, ny) {
  for (let i = 0; i < kDirs.length; ++i) {
    let [dy, dx] = kDirs[i];
    if (ny == y + dy && nx == x + dx) return i;
  }
  console.assert(false);
}

function findInnerArea(map, path) {
  // Append a bottom-right corner as a marker for inner/outer space.
  map = map.map(row => Array(row.length + 1).fill('.'));

  // Mark border with '#'.
  for (let [x, y] of path) {
    map[y][x] = '#';
  }

  // Mark inner/outer area with 'I'.
  for (let i = 0; i < path.length; ++i) {
    let [x, y] = path[i];
    let [nx, ny] = path[(i + 1) % path.length];
    let dir = getDirIndex(x, y, nx, ny);
    let [dy, dx] = kDirs[(dir + 1) % kDirs.length];

    for (let [tx, ty] of [[x, y], [nx, ny]]) {
      ty = (ty + dy + map.length) % map.length;
      tx = (tx + dx + map[ty].length) % map[ty].length;      
      if (map[ty][tx] == '.') map[ty][tx] = 'I';
    }
  }

  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == 'I') fill(x, y);
    }
  }

  let count1 = map
    .map(row => row.filter(x => x == '.').length)
    .reduce((a, b) => a + b, 0);
  let count2 = map
    .map(row => row.filter(x => x == 'I').length)
    .reduce((a, b) => a + b, 0);
  // console.log(count1, count2);
  // console.log(map.map(row => row.join('')).join('\n'));

  let inverse = (map.pop().pop() == 'I');
  return inverse ? count1 : count2;

  function fill(x, y) {
    let ch = map[y][x];
    for (let [dy, dx] of kDirs) {
      let ny = (y + dy + map.length) % map.length;
      let nx = (x + dx + map[ny].length) % map[ny].length;
      if (map[ny][nx] == '.') {
        map[ny][nx] = ch;
        fill(nx, ny);
      }
    }
  }
}
  
function solve(input) {
  let map = parseInput(input);
  let path = findCycle(map);
  console.assert(path.length % 2 == 0);
  let answer1 = path.length / 2;
  let answer2 = findInnerArea(map, path);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
.....
.S-7.
.|.|.
.L-J.
.....
`);

solve(`
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`);

solve(`
...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........
`);

solve(`
..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........
`);

solve(`
.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...
`);

solve(`
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`);

solve(document.body.textContent);

})();

