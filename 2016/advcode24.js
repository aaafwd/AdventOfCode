// https://adventofcode.com/2016/day/24
// --- Day 24: Air Duct Spelunking ---
//
// Runtime: 200 ms

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  return input.trim().split('\n').map(line => line.split(''));
}

function bfs(map) {
  let start_x, start_y, final_mask = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      let ch = map[y][x];
      if (ch == '.' || ch == '#') continue;
      ch = +ch;
      console.assert(!isNaN(ch));
      if (ch == 0) {
        start_x = x;
        start_y = y;
      } else {
        final_mask |= 1 << (ch - 1);
      }
    }
  }

  function getState(x, y, mask) {
    return (mask << 16) | (y << 8) | x;
  }

  let queue = [[start_x, start_y, 0]];
  let cache = {};
  cache[getState(start_x, start_y, 0)] = 1
  let final_state = getState(start_x, start_y, final_mask);
  let collect_all_steps = -1;

  let steps = 0;
  while (queue.length > 0) {
    ++steps;
    let new_queue = [];
    for (let [x, y, mask] of queue) {
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
        if (map[ny][nx] == '#') continue;
        let nmask = mask;
        if (map[ny][nx] != '.') {
          let ch = +map[ny][nx];
          if (ch) nmask |= 1 << (ch - 1);
          if (nmask == final_mask && collect_all_steps == -1) {
            collect_all_steps = steps;
          }
        }
        let state = getState(nx, ny, nmask);
        if (state == final_state) {
          return [collect_all_steps, steps];
        }
        if (cache[state]) continue;
        cache[state] = 1;
        new_queue.push([nx, ny, nmask]);
      }
    }
    queue = new_queue;
  }
  return -1;
}

function solve(input) {
  let map = parseInput(input);
  let [answer1, answer2] = bfs(map);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
###########
#0.1.....2#
#.#######.#
#4.......3#
###########
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

