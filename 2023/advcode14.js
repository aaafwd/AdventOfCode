// https://adventofcode.com/2023/day/14
// --- Day 14: Parabolic Reflector Dish ---
// Runtime: 108.7529296875 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim().split(''));
}

function tiltNorth(map) {
  for (let x = 0; x < map[0].length; ++x) {
    for (let y = 0, z = y; y < map.length; ++y) {
      if (map[y][x] == '#') {
        z =  y + 1;
      } else if (map[y][x] == 'O') {
        map[y][x] = '.';
        map[z++][x] = 'O';
      }
    }
  }
}

function tiltSouth(map) {
  for (let x = 0; x < map[0].length; ++x) {
    for (let y = map.length - 1, z = y; y >= 0; --y) {
      if (map[y][x] == '#') {
        z = y - 1;
      } else if (map[y][x] == 'O') {
        map[y][x] = '.';
        map[z--][x] = 'O';
      }
    }
  }
}

function tiltWest(map) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0, z = x; x < map[0].length; ++x) {
      if (map[y][x] == '#') {
        z = x + 1;
      } else if (map[y][x] == 'O') {
        map[y][x] = '.';
        map[y][z++] = 'O';
      }
    }
  }
}

function tiltEast(map) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = map[0].length - 1, z = x; x >= 0; --x) {
      if (map[y][x] == '#') {
        z = x - 1;
      } else if (map[y][x] == 'O') {
        map[y][x] = '.';
        map[y][z--] = 'O';
      }
    }
  }
}

function tiltCycle(map, cycles) {
  let cache = new Map();
  cache.set(makeKey(), 0);

  let rest = 0;
  for (let step = 1; step <= cycles; ++step) {
    tiltNorth(map);
    tiltWest(map);
    tiltSouth(map)
    tiltEast(map);
    let key = makeKey();
    if (cache.has(key)) {
      let offset = cache.get(key);
      let period = step - offset;
      rest = (cycles - step) % period;
      break;
    }
    cache.set(key, step);
  }

  while (rest > 0) {
    --rest;
    tiltNorth(map);
    tiltWest(map);
    tiltSouth(map)
    tiltEast(map);
  }

  function makeKey() {
    return map.map(row => row.join('')).join('');
  }
}

function countWeight(map) {
  let result = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[0].length; ++x) {
      if (map[y][x] == 'O') {
        result += map.length - y;
      }
    }
  }
  return result;
}

function solve(input) {
  let map = parseInput(input);

  tiltNorth(map);
  let answer1 = countWeight(map);

  tiltWest(map);
  tiltSouth(map)
  tiltEast(map);

  tiltCycle(map, 1000000000 - 1);
  let answer2 = countWeight(map);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

