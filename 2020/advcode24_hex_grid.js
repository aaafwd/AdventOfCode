// https://adventofcode.com/2020/day/24
// Runtime: ~0.8 sec

(function() {

// dir: [0, 1, 2, 3, 4, 5] => [e, se, sw, w, nw, ne]
function walk(x, y, dir) {
  switch (dir) {
    case 0:
      x += 2;
      break;
    case 1:
      ++x;
      ++y;
      break;
    case 2:
      --x;
      ++y;
      break;
    case 3:
      x -= 2;
      break;
    case 4:
      --x;
      --y;
      break;
    case 5:
      ++x;
      --y;
      break;
    default:
      console.assert(0);
  }
  return [x, y];
}

function walkPath(path) {
  let x = 0, y = 0;
  for (let dir of path) [x, y] = walk(x, y, dir);
  return [x, y];
}

function countFlipped(map) {
  let result = 0;
  for (let x in map) {
    for (let y in map[x]) {
      if (map[x][y]) ++result;
    }
  }
  return result;
}

function flipTilesPart2(map, days = 100) {
  while (days-- > 0) {
    let nextMap = {};
    for (let x in map) {
      for (let y in map[x]) {
        if (!map[x][y]) continue;
        x = +x;
        y = +y;
        for (let dir = 0; dir < 6; ++dir) {
          const [nx, ny] = walk(x, y, dir);
          nextMap[nx] = nextMap[nx] || {};
          nextMap[nx][ny] = (nextMap[nx][ny] || 0) + 1;
        }
      }
    }
    for (let x in nextMap) {
      for (let y in nextMap[x]) {
        const wasBlack = (map[x] && map[x][y]);
        const adjacent = nextMap[x][y];
        const isBlack =
            (wasBlack && (adjacent == 1 || adjacent == 2)) ||
            (!wasBlack && adjacent == 2);
        if (isBlack) {
          nextMap[x][y] = 1;
        } else {
          delete nextMap[x][y];
        }
      }
    }
    map = nextMap;
  }

  return map;
}

function solve(input) {
  console.time("Runtime");
  let paths = input.trim().split('\n').map(str => {
    // [e, se, sw, w, nw, ne] => [0, 1, 2, 3, 4, 5]
    let result = [];
    for (let i = 0; i < str.length; ++i) {
      if (str[i] == 'e') {
        result.push(0);
      } else if (str[i] == 's') {
        ++i;
        if (str[i] == 'e') {
          result.push(1);
        } else if (str[i] == 'w') {
          result.push(2);
        } else {
          console.assert(0);
        }
      } else if (str[i] == 'w') {
        result.push(3);
      } else if (str[i] == 'n') {
        ++i;
        if (str[i] == 'w') {
          result.push(4);
        } else if (str[i] == 'e') {
          result.push(5);
        } else {
          console.assert(0);
        }
      } else {
        console.assert(0);
      }
    }
    return result;
  });

  let map = {};
  for (let path of paths) {
    const [x, y] = walkPath(path);
    map[x] = map[x] || {};
    if (map[x][y]) delete map[x][y];
    else map[x][y] = 1;
  }
  console.log("Answer 1:", countFlipped(map));

  console.log("Answer 2:", countFlipped(flipTilesPart2(map)));

  console.timeEnd("Runtime");
}

solve(`
sesenwnenenewseeswwswswwnenewsewsw
neeenesenwnwwswnenewnwwsewnenwseswesw
seswneswswsenwwnwse
nwnwneseeswswnenewneswwnewseswneseene
swweswneswnenwsewnwneneseenw
eesenwseswswnenwswnwnwsewwnwsene
sewnenenenesenwsewnenwwwse
wenwwweseeeweswwwnwwe
wsweesenenewnwwnwsenewsenwwsesesenwne
neeswseenwwswnwswswnw
nenwswwsewswnenenewsenwsenwnesesenew
enewnwewneswsewnwswenweswnenwsenwsw
sweneswneswneneenwnewenewwneswswnese
swwesenesewenwneswnwwneseswwne
enesenwswwswneneswsenwnewswseenwsese
wnwnesenesenenwwnenwsewesewsesesew
nenewswnwewswnenesenwnesewesw
eneswnwswnwsenenwnwnwwseeswneewsenese
neswnwewnwnwseenwseesewsenwsweewe
wseweeenwnesenwwwswnew
`);

solve(document.body.textContent);

})();

