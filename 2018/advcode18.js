// https://adventofcode.com/2018/day/18
// --- Day 18: Settlers of The North Pole ---
//
// Runtime: 104.49609375 ms

(function() {
console.time("Runtime");

function parseInput(input) {
  return input.trim().split('\n').map(row => row.split(''));
}

function mapToString(map) {
  return map.map(row => row.join('')).join('\n');
}

function countAdjacent(map, x, y, ch) {
  let count = 0;
  for (let dy = -1; dy <= 1; ++dy) {
    let ny = y + dy;
    if (ny < 0 || ny >= map.length) continue;
    for (let dx = -1; dx <= 1; ++dx) {
      if (!dx && !dy) continue;
      let nx = x + dx;
      if (nx < 0 || nx >= map[ny].length) continue;
      if (map[ny][nx] == ch) ++count;
    }
  }
  return count;
}

function transform(map) {
  let new_map = [];
  for (let y = 0; y < map.length; ++y) {
    new_map[y] = [];
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == '.') {
        let count = countAdjacent(map, x, y, '|');
        new_map[y][x] = (count >= 3) ? '|' : '.';
      } else if (map[y][x] == '|') {
        let count = countAdjacent(map, x, y, '#');
        new_map[y][x] = (count >= 3) ? '#' : '|';
      } else if (map[y][x] == '#') {
        let count1 = countAdjacent(map, x, y, '#');
        let count2 = countAdjacent(map, x, y, '|');
        new_map[y][x] = (count1 >= 1 && count2 >= 1) ? '#' : '.';
      } else {
        console.assert(0);
      }
    }
  }
  return new_map;
}

function bulkTransform(map, repeats) {
  let cache = new Map();
  cache.set(mapToString(map), 0);

  for (let i = 1; i <= repeats; ++i) {
    map = transform(map);
    let key = mapToString(map);
    if (cache.has(key)) {
      let cycle_len = i - cache.get(key);
      let left = repeats - i;
      left %= cycle_len;
      while (left-- > 0) {
        map = transform(map);
      }
      break;
    }
    cache.set(key, i);
  }
  return map;
}

function countAcres(map) {
  let woods = 0;
  let lumberyards = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == '|') ++woods;
      else if (map[y][x] == '#') ++lumberyards;
    }
  }
  return [woods, lumberyards];
}

function solve(input) {
  let map = parseInput(input);

  map = bulkTransform(map, 10);
  let [woods, lumberyards] = countAcres(map);
  let answer1 = woods * lumberyards;

  map = bulkTransform(map, 1000000000 - 10);
  [woods, lumberyards] = countAcres(map);
  let answer2 = woods * lumberyards;

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.
`);

solve(document.body.textContent);

console.timeEnd("Runtime");
})();

