// https://adventofcode.com/2017/day/22
// --- Day 22: Sporifica Virus ---
//
// Runtime: 2602.7373046875 ms
// Runtime: 1142.278076171875 ms (with numeric cache keys)

(function() {
console.time("Runtime");

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function cacheKey(x, y) {
  return x + '/' + y;
  // Faster version of generating cache keys, but there might be collisions and/or overflows.
  // return x * 31337 + y;
}

// State:
//   0. Clean
//   1. Weakened
//   2. Infected
//   3. Flagged
function parseState(input) {
  let map = input.trim().split('\n').map(row => row.split(''));
  let state = new Map();
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] != '#') continue;
      let key = cacheKey(x, y);
      state.set(key, 2);
    }
  }
  let y = (map.length - 1) / 2;
  let x = (map[y].length - 1) / 2;
  let dir = 0;
  return {state, x, y, dir};
}

function solve1(input, steps) {
  let {state, x, y, dir} = parseState(input);
  let infections = 0;
  while (steps-- > 0) {
    let key = cacheKey(x, y);
    let infected = state.get(key) || 0;
    if (infected) dir = (dir + 1) & 3;
    else dir = (dir + 3) & 3;

    infected ^= 2;
    state.set(key, infected);
    if (infected) ++infections;

    let [dx, dy] = kDirs[dir];
    x += dx;
    y += dy;
  }
  console.log("Answer 1:", infections);
}

function solve2(input, steps) {
  let {state, x, y, dir} = parseState(input);
  let infections = 0;
  while (steps-- > 0) {
    let key = cacheKey(x, y);
    let current_state = state.get(key) || 0;
    if (current_state == 0) dir = (dir + 3) & 3;
    else if (current_state == 2) dir = (dir + 1) & 3;
    else if (current_state == 3) dir ^= 2;

    let next_state = (current_state + 1) & 3;
    state.set(key, next_state);

    if (next_state == 2) ++infections;

    let [dx, dy] = kDirs[dir];
    x += dx;
    y += dy;
  }
  console.log("Answer 2:", infections);
}

solve1(`
..#
#..
...
`, 70);

solve1(`
..#
#..
...
`, 10000);

solve1(document.body.textContent, 10000);

solve2(`
..#
#..
...
`, 100);

solve2(`
..#
#..
...
`, 10000000);

solve2(document.body.textContent, 10000000);

console.timeEnd("Runtime");
})();

