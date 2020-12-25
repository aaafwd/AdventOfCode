// https://adventofcode.com/2020/day/20
// Runtime: ~60 ms

(function() {

// Creates a new map rotated 90 degree clockwise.
function rotate(map) {
  const [X, Y] = [map[0].length, map.length];
  let result = [];
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      const [nx, ny] = [y, X - 1 - x];
      result[ny] = result[ny] || [];
      result[ny][nx] = map[y][x];
    }
  }
  return result;
}

// Flips the map in-place.
function flipInPlace(map) {
  const [X, Y] = [map[0].length, map.length];
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x + x < X; ++x) {
      [map[y][x], map[y][X - 1 - x]] = [map[y][X - 1 - x], map[y][x]];
    }
  }
  return map;    
}

function getAllRotations(map) {
  let rotations = [];
  for (let state = 0; state < 8; ++state) {
    rotations.push(map);
    map = rotate(map);
    if (state == 3) map = flipInPlace(map);
  }
  return rotations;
}

function getTopBorderMask(map) {
  let mask = 0;
  map[0].forEach(ch => {
    mask <<= 1;
    if (ch == '#') mask |= 1;
  });
  return mask;
}

function getBottomBorderMask(map) {
  let mask = 0;
  map[map.length - 1].forEach(ch => {
    mask <<= 1;
    if (ch == '#') mask |= 1;
  });
  return mask;
}

function getLeftBorderMask(map) {
  let mask = 0;
  map.forEach(row => {
    mask <<= 1;
    if (row[0] == '#') mask |= 1;
  });
  return mask;
}

function getRightBorderMask(map) {
  let mask = 0;
  map.forEach(row => {
    mask <<= 1;
    if (row[row.length - 1] == '#') mask |= 1;
  });
  return mask;
}

function arrangeTiles(tiles, arranged, size, row = 0, column = 0, used = []) {
  if (column == size) {
    column = 0;
    if (++row == size) return true;
  }

  const index = row * size + column;
  for (let i = 0; i < tiles.length; ++i) {
    if (used[i]) continue;
    used[i] = true;
    const {id, rotations, borders} = tiles[i];

    // Optimization: do not rotate the very first tile (only flip it).
    // Speeds up the runtime up to ~3x.
    for (let state = 0; state < 8; state += (index ? 1 : 4)) {
      const map = rotations[state];
      arranged[index] = (i << 3) | state;

      // Check the left border lines up to the right of the previous one.
      if (column != 0) {
        const previous = arranged[index - 1];
        const border = tiles[previous >> 3].borders[previous & 7].right;
        if (border != borders[state].left) continue;
      }

      // Check the top border lines up to the bottom of the previous one.
      if (row != 0) {
        const previous = arranged[index - size];
        const border = tiles[previous >> 3].borders[previous & 7].bottom;
        if (border != borders[state].top) continue;
      }

      if (arrangeTiles(tiles, arranged, size, row, column + 1, used)) {
        return true;
      }
    }
    used[i] = false;
  }
  return false;
}

function concatArrangedTiles(tiles, arranged, size) {
  let tile = tiles[0].rotations[0];
  const [TX, TY] = [tile[0].length, tile.length];

  let map = [];
  let index = 0;
  for (let y = 0; y < size; ++y) {
    for (let x = 0; x < size; ++x) {
      const code = arranged[index++];
      tile = tiles[code >> 3].rotations[code & 7];
      for (let ty = 1; ty + 1 < TY; ++ty) {
        for (let tx = 1; tx + 1 < TX; ++tx) {
          const ny = (TY - 2) * y + ty - 1;
          const nx = (TX - 2) * x + tx - 1;
          map[ny] = map[ny] || [];
          map[ny][nx] = tile[ty][tx];
        }
      }
    }
  }
  return map;
}

function findAndMaskPattern(map, pattern) {
  const [X, Y] = [map[0].length, map.length];
  const [PX, PY] = [pattern[0].length, pattern.length];
  let result = false;
  for (let y = 0; y + PY - 1 < Y; ++y) {
    for (let x = 0; x + PX - 1 < X; ++x) {
      let foundPattern = true;
      for (let py = 0; py < PY; ++py) {
        for (let px = 0; px < PX; ++px) {
          if (pattern[py][px] == '#' && map[y + py][x + px] != '#') {
            foundPattern = false;
            py = PY;
            break;
          }
        }
      }
      if (foundPattern) {
        result = true;
        for (let py = 0; py < PY; ++py) {
          for (let px = 0; px < PX; ++px) {
            if (pattern[py][px] == '#') {
              map[y + py][x + px] = 'O';
            }
          }
        }
      }
    }
  }
  return result;
}

function solve(input) {
  console.time("Runtime");

  // Format: Array<{id: number,
  //                rotations: Array(8),
  //                borders: Array(8)<{top, left, bottom, right}>}>
  const tiles = input.trim().split('\n\n').map(item => {
    item = item.split('\n');
    let id = +item.shift().replace(/[^\d]/g, '');
    let map = item.map(row => row.split(''));
    let rotations = getAllRotations(map);
    let borders = rotations.map(rotation =>
        ({top: getTopBorderMask(rotation),
          left: getLeftBorderMask(rotation),
          bottom: getBottomBorderMask(rotation),
          right: getRightBorderMask(rotation)}));
    return {id, rotations, borders};
  });

  const size = Math.floor(Math.sqrt(tiles.length));
  console.assert(size * size == tiles.length);

  let arranged = [];
  const done = arrangeTiles(tiles, arranged, size)
  console.assert(done, "Found arrangement");

  let answer1 = 1;
  [0, size - 1, tiles.length - size, tiles.length - 1]
      .forEach(i => answer1 *= tiles[arranged[i] >> 3].id);
  console.log("Answer 1:", answer1);

  const pattern = [
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   "].map(row => row.split(''));

  let map = concatArrangedTiles(tiles, arranged, size);
  let rotations = getAllRotations(map);
  let foundPattern = false;
  for (map of rotations) {
    if (findAndMaskPattern(map, pattern)) {
      foundPattern = true;
      break;
    }
  }
  console.assert(foundPattern);
  // console.log(map.map(row => row.join('')).join('\n'));

  const answer2 =
      map.map(row => row.join('')).join('').replace(/[^#]/g, '').length;
  console.log("Answer 2:", answer2);

  console.timeEnd("Runtime");
}

solve(`
Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...
`);

solve(document.body.textContent);

})();

