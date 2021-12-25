// https://adventofcode.com/2021/day/25
// --- Day 25: Sea Cucumber ---

(function() {

function parseInput(input) {
  return input.trim().split('\n').map(row => row.trim().split(''));
}

function tryMove(map) {
  let queue = [];
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] != '>') continue;
      let nx = (x + 1) % map[y].length;
      if (map[y][nx] != '.') continue;
      queue.push([x, y]);
    }
  }
  let steps = queue.length;
  for (let [x, y] of queue) {
    let nx = (x + 1) % map[y].length;
    map[y][nx] = map[y][x];
    map[y][x] = '.';
  }
  queue = [];
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] != 'v') continue;
      let ny = (y + 1) % map.length;
      if (map[ny][x] != '.') continue;
      queue.push([x, y]);
    }
  }
  steps += queue.length;
  for (let [x, y] of queue) {
    let ny = (y + 1) % map.length;
    map[ny][x] = map[y][x];
    map[y][x] = '.';
  }
  return steps;
}

function solve(input) {
  let map = parseInput(input);
  let steps = 0;
  while (1) {
    ++steps;
    if (tryMove(map) == 0) break;
  }
  console.log('Answer:', steps);
}

solve(`
v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>
`);

solve(document.body.textContent);

})();

