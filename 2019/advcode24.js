(function() {

function input(str) {
  return str.trim().split('\n').map(row => row.trim().split(''));
}

function getMapState(map) {
  let state = 0;
  let index = 1;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == "#") {
        state |= index;
      }
      index <<= 1;
    }
  }
  return state;
}

function makeMove(map) {
  const STEPS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const Y = map.length;
  let newMap = [];
  for (let y = 0; y < Y; ++y) {
    newMap.push([]);
    const X = map[y].length;
    for (let x = 0; x < X; ++x) {
      let bugs = 0;
      for (let [dx, dy] of STEPS) {
        let [nx, ny] = [x + dx, y + dy];
        if (nx < 0 || ny < 0 || nx >= X || ny >= Y) continue;
        if (map[ny][nx] == "#") ++bugs;
      }
      if (map[y][x] == "#" && bugs != 1) {
        newMap[y][x] = "."
      } else if (map[y][x] == "." && (bugs == 1 || bugs == 2)) {
        newMap[y][x] = "#"
      } else {
        newMap[y][x] = map[y][x];
      }
    }
  }
  return newMap;
}

function solve1(str) {
  let map = input(str);
  const set = new Set();
  let state = getMapState(map);
  set.add(state);
  while (1) {
    map = makeMove(map);
    state = getMapState(map);
    if (set.has(state)) {
      console.log("State:", state);
      break;
    }
    set.add(state);
  }
}

function makeCopy(map) {
  return map.map(row => Array.from(row));
}

function solve2(str, steps) {
  const STEPS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const [X, Y] = [5, 5];
  let maps = [];
  maps[0] = input(str);
  let [minLevel, maxLevel] = [0, 0];

  function getAdjacentBugs(prev_adjacent, map, next_adjacent, x, y) {
    let bugs = 0;
    for (let [dx, dy] of STEPS) {
      let [nx, ny] = [x + dx, y + dy];
      if (nx < 0 || ny < 0 || nx >= X || ny >= Y) {
        if (!prev_adjacent) continue;
        let adjacent = prev_adjacent;
        if (nx < 0 && adjacent[2][1] == "#") ++bugs;
        if (ny < 0 && adjacent[1][2] == "#") ++bugs;
        if (nx >= X && adjacent[2][3] == "#") ++bugs;
        if (ny >= Y && adjacent[3][2] == "#") ++bugs;
      } else if (nx == 2 && ny == 2) {
        if (!next_adjacent) continue;
        let adjacent = next_adjacent;
        if (dx == 0) {
          let ay = (dy == 1 ? 0 : Y - 1);
          for (let ax = 0; ax < X; ++ax) {
            if (adjacent[ay][ax] == "#") ++bugs;
          }
        } else {
          let ax = (dx == 1 ? 0 : X - 1);
          for (let ay = 0; ay < Y; ++ay) {
            if (adjacent[ay][ax] == "#") ++bugs;
          }
        }
      } else if (map[ny][nx] == "#") {
        ++bugs;
      }
    }
    return bugs;
  }

  for (let step = 0; step < steps; ++step) {
    --minLevel;
    maps[minLevel] = Array(5).fill(0).map(row => Array(5).fill("."));
    ++maxLevel;
    maps[maxLevel] = Array(5).fill(0).map(row => Array(5).fill("."));
    let prev_adjacent = undefined;
    let map = makeCopy(maps[minLevel]);
    let next_adjacent = makeCopy(maps[minLevel + 1]);
    for (let level = minLevel; level <= maxLevel; ++level) {
      for (let y = 0; y < Y; ++y) {
        for (let x = 0; x < X; ++x) {
          if (y == 2 && x == 2) continue;
          let bugs = getAdjacentBugs(prev_adjacent, map, next_adjacent, x, y);
          if (map[y][x] == "#" && bugs != 1) {
            maps[level][y][x] = "."
          } else if (map[y][x] == "." && (bugs == 1 || bugs == 2)) {
            maps[level][y][x] = "#"
          }
        }
      }
      [prev_adjacent, map, next_adjacent] = [map, next_adjacent,
          (level + 2 <= maxLevel ? makeCopy(maps[level + 2]) : undefined)];
    }
  }

  let totalBugs = 0;
  for (let level = minLevel; level <= maxLevel; ++level) {
    const map = maps[level];
    for (let y = 0; y < Y; ++y) {
      for (let x = 0; x < X; ++x) {
        if (y == 2 && x == 2) continue;
        if (map[y][x] == "#") ++totalBugs;
      }
    }
  }
  console.log("Total bugs:", totalBugs);
}

solve1(`
....#
#..#.
#..##
..#..
#....
`);

solve1(`
####.
.###.
.#..#
##.##
###..
`);

solve2(`
....#
#..#.
#..##
..#..
#....
`, 10);

solve2(`
####.
.###.
.#..#
##.##
###..
`, 200);

})();

