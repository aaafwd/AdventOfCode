// https://adventofcode.com/2023/day/16
// --- Day 16: The Floor Will Be Lava ---
// Runtime: 378.58203125 ms

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim().split(''));
}

function energize(map, x, y, dir) {
  let queue = [];
  let seen = new Set();
  let tiles = map.map(row => row.slice());

  enqueue(x, y, dir);
  while (queue.length > 0) {
    [x, y, dir] = queue.pop();
    tiles[y][x] = '#';

    let ch = map[y][x];
    if (ch == '.' ||
        (ch == '-' && dir == 1) ||
        (ch == '-' && dir == 3) ||
        (ch == '|' && dir == 0) ||
        (ch == '|' && dir == 2)) {
      move(x, y, dir);
    } else if (ch == '\\') {
      move(x, y, dir ^ 3);
    } else if (ch == '/') {
      move(x, y, dir ^ 1);
    } else if (ch == '-') {
      move(x, y, 1);
      move(x, y, 3);
    } else if (ch == '|') {
      move(x, y, 0);
      move(x, y, 2);
    } else {
      console.assert(false, ch);
    }
  }

  return tiles
    .map(row => row.filter(ch => ch == '#').length)
    .reduce((a, b) => a + b, 0);

  function move(x, y, dir) {
    let [dx, dy] = kDirs[dir];
    enqueue(x + dx, y + dy, dir);
  }

  function enqueue(x, y, dir) {
    if (y < 0 || y >= map.length) return;
    if (x < 0 || x >= map[y].length) return;
    // let key = [x, y, dir].join(',');
    let key = (x << 17) | (y << 2) | dir;
    if (seen.has(key)) return;
    seen.add(key);
    queue.push([x, y, dir]);
  }
}

function energizeMax(map) {
  let result = 0;
  for (let y = 0; y < map.length; ++y) {
    result = Math.max(result, energize(map, 0, y, 1));
    result = Math.max(result, energize(map, map[0].length - 1, y, 3));
  }
  for (let x = 0; x < map[0].length; ++x) {
    result = Math.max(result, energize(map, x, 0, 2));
    result = Math.max(result, energize(map, x, map.length - 1, 0));
  }
  return result;
}

function solve(input) {
  let map = parseInput(input);
  let answer1 = energize(map, 0, 0, 1);
  let answer2 = energizeMax(map);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

