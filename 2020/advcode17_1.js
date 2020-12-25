// https://adventofcode.com/2020/day/17 (part 1)

(function() {

function createMap(Z, Y, X) {
  return Array(Z).fill(0).map(
      _ => Array(Y).fill(0).map(
          _ => Array(X).fill(0)));
}

function simulate(map) {
  const Z = map.length + 2;
  const Y = map[0].length + 2;
  const X = map[0][0].length + 2;
  let nextMap = createMap(Z, Y, X);
  for (let z = 0; z < Z; ++z) {
    for (let y = 0; y < Y; ++y) {
      for (let x = 0; x < X; ++x) {
        let adjacentActives = 0;
        let active = false;
        for (let dz = -1; dz <= 1; ++dz) {
          for (let dy = -1; dy <= 1; ++dy) {
            for (let dx = -1; dx <= 1; ++dx) {
              let oz = z + dz - 1;
              let oy = y + dy - 1;
              let ox = x + dx - 1;
              if (ox < 0 || oy < 0 || oz < 0) continue;
              if (ox >= X - 2 || oy >= Y - 2 || oz >= Z - 2) continue;
              if (map[oz][oy][ox] == '#') {
                if (!dz && !dy && !dx) {
                  active = true;
                } else {
                  ++adjacentActives;
                }
              }
            }
          }
        }
        if (active) {
          if (adjacentActives == 2 || adjacentActives == 3) {
            nextMap[z][y][x] = '#';
          } else {
            nextMap[z][y][x] = '.';
          }
        } else {
          if (adjacentActives == 3) {
            nextMap[z][y][x] = '#';
          } else {
            nextMap[z][y][x] = '.';
          }
        }
      }
    }   
  }
  return nextMap;
}

function solve(input) {
  let map = [input.trim().split('\n').map(row => row.split(''))];

  let nextMap = map;
  for (let i = 0; i < 6; ++i) {
    nextMap = simulate(nextMap);
  }
  let answer1 = 0;
  for (let z = 0; z < nextMap.length; ++z) {
    for (let y = 0; y < nextMap[z].length; ++y) {
      for (let x = 0; x < nextMap[z][y].length; ++x) {
        if (nextMap[z][y][x] == '#') ++answer1;
      }
    }   
  }
  console.log("Answer 1:", answer1);
}

solve(`
.#.
..#
###
`);

solve(`
...#..#.
.....##.
##..##.#
#.#.##..
#..#.###
...##.#.
#..##..#
.#.#..#.
`);

})();

