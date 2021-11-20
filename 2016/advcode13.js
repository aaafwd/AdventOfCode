// https://adventofcode.com/2016/day/13
// --- Day 13: A Maze of Twisty Little Cubicles ---

(function() {

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function getKey(x, y) {
  return (x << 16) | y;
}

function isWall(designer, x, y) {
  let num = x * (x + 3 + 2 * y) + y + y*y + designer;
  let num_bits = 0;
  while (num) {
    if (num & 1) ++num_bits;
    num >>= 1;
  }
  return (num_bits & 1) == 1;
}

function walk(designer, target_x, target_y) {
  let queue = [[1, 1]];
  let cache = {};
  cache[getKey(1, 1)] = 1;

  let steps = 0;
  while (queue.length > 0) {
    let next_queue = [];
    ++steps;
    for (let [x, y] of queue) {
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (nx == target_x && ny == target_y) return steps;
        if (nx < 0 || ny < 0) continue;
        if (isWall(designer, nx, ny)) continue;
        let key = getKey(nx, ny);
        if (cache[key]) continue;
        cache[key] = 1;
        next_queue.push([nx, ny]);
      }
    }
    queue = next_queue;
    if (steps == 50) {
      let answer2 = Object.keys(cache).length;
      console.log('Answer 2:', answer2);
    }
  }
  return -1;
}

function solve(designer, target_x, target_y) {
  let answer1 = walk(designer, target_x, target_y);
  console.log('Answer 1:', answer1);
}

solve(10, 7, 4);

solve(1352, 31, 39);

})();

