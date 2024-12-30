// https://adventofcode.com/2024/day/15
// --- Day 15: Warehouse Woes ---
// Runtime: 21.14990234375 ms

(function() {
console.time('Runtime');

const kDirChars = "^>v<";
const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function mapsNew(X, Y) { return Array(Y).fill(0).map(row => Array(X).fill('.')); }
function mapsClone(map) { return map.slice().map(row => row.slice()); }
function mapsToString(map) { return map.map(row => row.join('')).join('\n'); }
function mapsPrint(map) { console.log(mapsToString(map)); }
function mapsInRange(map, x, y) { return 0 <= y && y < map.length && 0 <= x && x < map[y].length; }

function toKey(x, y) {
  console.assert(0 <= x && x <= 0x7fff && 0 <= y && y <= 0xffff, x, y);
  return (x << 16) | y;
}
function fromKey(key) { return [key >> 16, key & 0xffff]; }

function mapsFindChar(map, ch) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == ch) return [x, y];
    }
  }
  console.assert(false, map, ch);
}

function mapsDirFromChar(ch) {
  let i = kDirChars.indexOf(ch);
  console.assert(0 <= i && i < 4, ch);
  return kDirs[i];
}

function parseInput(input) {
  let [map, moves] = input.trim().split('\n\n');
  map = map.trim().split('\n').map(row => row.trim().split(''));
  moves = moves.replace('\n', '').replace(/\s+/g, '').split('');
  return [map, moves];
}

// Part 1.
function simulateSingleMove(map, x, y, dx, dy) {
  let steps = 1;
  while (1) {
    let nx = x + dx * steps;
    let ny = y + dy * steps;
    if (!mapsInRange(map, nx, ny)) return false;
    if (map[ny][nx] == '#') return false;
    if (map[ny][nx] == '.') break;
    ++steps;
  }
  for (let i = steps; i > 0; --i) {
    let nx = x + dx * i;
    let ny = y + dy * i;
    if (i == 1) {
      map[ny][nx] = '@';
      map[y][x] = '.';
      return true;
    } else {
      map[ny][nx] = 'O';
    }
  }
}

// Part 1.
function simulateMoves(map, moves) {
  map = mapsClone(map);
  let [x, y] = mapsFindChar(map, '@');
  for (let i = 0; i < moves.length; ++i) {
    let [dx, dy] = mapsDirFromChar(moves[i]);
    if (simulateSingleMove(map, x, y, dx, dy)) {
      x += dx;
      y += dy;
      console.assert(map[y][x] == '@');
    }
  }
  return map;
}

// Part 2.
function moveHorizontalInWidenedMap(map, x, y, dx, dy) {
  let steps = 1;
  while (1) {
    let nx = x + dx * steps;
    let ny = y + dy * steps;
    if (!mapsInRange(map, nx, ny)) return false;
    if (map[ny][nx] == '#') return false;
    if (map[ny][nx] == '.') break;
    ++steps;
  }
  for (let i = steps; i > 0; --i) {
    let nx = x + dx * i;
    let ny = y + dy * i;
    if (i == 1) {
      map[ny][nx] = '@';
      map[y][x] = '.';
      return true;
    }
    let px = x + dx * (i - 1);
    let py = y + dy * (i - 1);
    map[ny][nx] = map[py][px];
  }
}

// Part 2.
function moveVerticalInWidenedMap(map, ox, oy, dx, dy) {
  function tryMove(wave) {
    let next = new Set();
    for (let key of wave) {
      let [x, y] = fromKey(key);
      let nx = x + dx;
      let ny = y + dy;
      if (!mapsInRange(map, nx, ny)) return false;
      if (map[ny][nx] == '#') return false;
      if (map[ny][nx] == '.') continue;
      next.add(toKey(nx, ny));
      if (map[ny][nx] == '[') {
        next.add(toKey(nx + 1, ny));
      } else if (map[ny][nx] == ']') {
        next.add(toKey(nx - 1, ny));
      } else {
        console.assert(false);
      }
    }
    if (next.size > 0 && !tryMove(next)) {
      return false;
    }
    for (let key of wave) {
      let [x, y] = fromKey(key);
      let nx = x + dx;
      let ny = y + dy;
      console.assert(map[ny][nx] == '.');
      map[ny][nx] = map[y][x];
      map[y][x] = '.';
    }
    return true;
  }
  return tryMove(new Set([toKey(ox, oy)]));
}

function simulateWidenedMap(map, moves) {
  map = mapsClone(map);
  let [x, y] = mapsFindChar(map, '@');
  for (let i = 0; i < moves.length; ++i) {
    let [dx, dy] = mapsDirFromChar(moves[i]);
    let hasMoved = (dy == 0)
      ? moveHorizontalInWidenedMap(map, x, y, dx, dy)
      : moveVerticalInWidenedMap(map, x, y, dx, dy);
    if (hasMoved) {
      x += dx;
      y += dy;
      console.assert(map[y][x] == '@');
    }
  }
  return map;
}

function countCoords(map) {
  let result = 0;
  // mapsPrint(map);
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == 'O' || map[y][x] == '[') {
        result += 100 * y + x;
      }
    }
  }
  return result;
}

function makeWidenedMap(map) {
  return map.map(row => row.map(ch => {
    if (ch == '#') return ['#', '#'];
    if (ch == 'O') return ['[', ']'];
    if (ch == '.') return ['.', '.'];
    if (ch == '@') return ['@', '.'];
    console.assert(false);
  }).reduce((a, b) => [...a, ...b]));
}

function solve(input) {
  let [map, moves] = parseInput(input);

  let answer1 = countCoords(simulateMoves(map, moves));

  map = makeWidenedMap(map);
  let answer2 = countCoords(simulateWidenedMap(map, moves));

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^
`)

solve(`
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
`)

solve(`
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

