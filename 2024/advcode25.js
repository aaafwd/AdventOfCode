// https://adventofcode.com/2024/day/25
// --- Day 25: Code Chronicle ---
// Runtime: 8.93603515625 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  return input.trim()
    .split('\n\n')
    .map(part => part.trim().split('\n').map(row => row.trim().split('')));
}

function mapsFlipXY(map) {
  let Y = map.length, X = map[0].length;
  let flipped = Array(X).fill(0).map(row => Array(Y));
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      flipped[x][y] = map[y][x];
    }
  }
  return flipped;
}

function encodeLock(map) {
  return mapsFlipXY(map).map(row => row.filter(ch => ch == '#').length - 1);
}

function matches(lock, key) {
  for (let i = 0; i < lock.length; ++i) {
    let sum = lock[i] + key[i];
    if (sum > 5) return false;
  }
  return true;
}

function solve(input) {
  let maps = parseInput(input);

  let locks = [];
  let keys = [];
  for (let map of maps) {
    if (map[0][0] == '#') {
      locks.push(encodeLock(map));
    } else if (map[0][0] == '.') {
      keys.push(encodeLock(map));
    } else {
      console.assert(false);
    }
  }

  let answer1 = 0;
  for (let lock of locks) {
    for (let key of keys) {
      if (matches(lock, key)) ++answer1;
    }
  }

  console.log('Answer 1:', answer1);
}

solve(`
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();
