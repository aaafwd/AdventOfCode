// https://adventofcode.com/2020/day/11

(function() {

function clone(map) {
  return map.map(row => [...row]);
}

function process(map, occupiedThreshold, singleStep) {
  const Y = map.length;
  const X = map[0].length;

  const directions = []
  for (let x = -1; x <= 1; ++x) {
    for (let y = -1; y <= 1; ++y) {
      if (x == 0 && y == 0) continue;
      directions.push([x, y]);
    }
  }

  map = clone(map);
  let nextMap = clone(map);
  let stabilized = false;
  while (!stabilized) {
    stabilized = true;
    for (let y = 0; y < Y; ++y) {
      for (let x = 0; x < X; ++x) {
        nextMap[y][x] = map[y][x];
        if (map[y][x] == '.') continue;
        let occupied = 0;
        for (let [dx, dy] of directions) {
          for (let step = 1;; ++step) {
            let nx = x + dx * step;
            let ny = y + dy * step;
            if (nx < 0 || ny < 0 || nx >= X || ny >= Y) break;
            if (map[ny][nx] == '#') ++occupied;
            if (singleStep || map[ny][nx] != '.') break;
          }
        }
        if (map[y][x] == 'L' && occupied == 0) {
          nextMap[y][x] = '#';
          stabilized = false;
        } else if (map[y][x] == '#' && occupied >= occupiedThreshold) {
          nextMap[y][x] = 'L';
          stabilized = false;
        }
      }
    }
    [map, nextMap] = [nextMap, map];
  }
  return map;
}

function solve(input) {
  console.time("Runtime");
  let map = input.trim().split('\n').map(line => line.split(''));

  for (let part of [1, 2]) {
    const occupiedThreshold = 3 + part;
    const singleStep = (part == 1);
    let occupied = 0;
    for (let row of process(map, occupiedThreshold, singleStep)) {
      for (let ch of row) {
        if (ch == '#') ++occupied;
      }
    }
    console.log("Answer " + part + ":", occupied);
  }
  console.timeEnd("Runtime");
}

solve(`
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL
`);

solve(document.body.textContent);

})();

