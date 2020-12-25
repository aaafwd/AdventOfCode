// https://adventofcode.com/2020/day/17 (part 2)

(function() {

function createMap(W, Z, Y, X) {
  return Array(W).fill(0).map(
      _ => Array(Z).fill(0).map(
          _ => Array(Y).fill(0).map(
              _ => Array(X).fill(0))));
}

function simulate(map) {
  const W = map.length + 2;
  const Z = map[0].length + 2;
  const Y = map[0][0].length + 2;
  const X = map[0][0][0].length + 2;
  let nextMap = createMap(W, Z, Y, X);
  for (let w = 0; w < W; ++w) {
    for (let z = 0; z < Z; ++z) {
      for (let y = 0; y < Y; ++y) {
        for (let x = 0; x < X; ++x) {
          let adjacentActives = 0;
          let active = false;
          for (let dw = -1; dw <= 1; ++dw) {
            for (let dz = -1; dz <= 1; ++dz) {
              for (let dy = -1; dy <= 1; ++dy) {
                for (let dx = -1; dx <= 1; ++dx) {
                  let ow = w + dw - 1;
                  let oz = z + dz - 1;
                  let oy = y + dy - 1;
                  let ox = x + dx - 1;
                  if (ox < 0 || oy < 0 || oz < 0 || ow < 0) continue;
                  if (ox >= X - 2 || oy >= Y - 2 || oz >= Z - 2 || ow >= W - 2) continue;
                  if (map[ow][oz][oy][ox] == '#') {
                    if (!dw && !dz && !dy && !dx) {
                      active = true;
                    } else {
                      ++adjacentActives;
                    }
                  }
                }
              }
            }
          }
          if (active) {
            if (adjacentActives == 2 || adjacentActives == 3) {
              nextMap[w][z][y][x] = '#';
            } else {
              nextMap[w][z][y][x] = '.';
            }
          } else {
            if (adjacentActives == 3) {
              nextMap[w][z][y][x] = '#';
            } else {
              nextMap[w][z][y][x] = '.';
            }
          }
        }
      }
    }
  }
  return nextMap;
}

function solve(input) {
  let map = [[input.trim().split('\n').map(row => row.split(''))]];

  let nextMap = map;
  for (let i = 0; i < 6; ++i) {
    nextMap = simulate(nextMap);
  }
  let answer2 = 0;
  for (let w = 0; w < nextMap.length; ++w) {
    for (let z = 0; z < nextMap[w].length; ++z) {
      for (let y = 0; y < nextMap[w][z].length; ++y) {
        for (let x = 0; x < nextMap[w][z][y].length; ++x) {
          if (nextMap[w][z][y][x] == '#') ++answer2;
        }
      }   
    }
  }
  console.log("Answer 2:", answer2);
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

