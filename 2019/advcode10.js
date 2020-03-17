(function() {

function gcd(a, b) {
  while (a && b) {
    [a, b] = [b, a % b];
  }
  return a + b;
}

function solve1(map) {
  const [X, Y] = [map[0].length, map.length];
  let [bestX, bestY, best] = [-1, -1, -1];
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      if (map[y][x] != '#') continue;
      let monitored = 0;
      for (let dx = -x; x + dx < X; ++dx) {
        for (let dy = -y; y + dy < Y; ++dy) {
          if (gcd(Math.abs(dx), Math.abs(dy)) != 1) continue;
          for (let step = 1;; ++step) {
            let nx = x + step * dx;
            let ny = y + step * dy;
            if (nx < 0 || ny < 0 || nx >= X || ny >= Y) break;
            if (map[ny][nx] == '#') {
              ++monitored;
              break;
            }
          }
        }
      }
      if (best < monitored) {
        [bestX, bestY, best] = [x, y, monitored];
      }
    }
  }
  return [bestX, bestY, best];
}

function solve2(map, [x, y]) {
  const [X, Y] = [map[0].length, map.length];
  let vectors = [];
  for (let dx = -x; x + dx < X; ++dx) {
    for (let dy = -y; y + dy < Y; ++dy) {
      if (gcd(Math.abs(dx), Math.abs(dy)) != 1) continue;
      vectors.push([dx, dy]);
    }
  }
  function angle([dx, dy]) {
    if (dy == 0) {
      return dx >= 0 ? Math.PI / 2 : Math.PI * 1.5;
    }
    let a = Math.atan(Math.abs(dx / dy));
    if (dy < 0) {
      return dx >= 0 ? a : Math.PI * 2 - a;
    } else {
      return dx >= 0 ? Math.PI - a : Math.PI + a;
    }
  }
  vectors.sort((vec1, vec2) => {
    let a1 = angle(vec1);
    let a2 = angle(vec2);
    console.assert(a1 != a2, a1);
    if (a1 < a2) return -1;
    return 1;
  });

  let destroyed = 0;
  while (1) {
    const saved = destroyed;
    for (let [dx, dy] of vectors) {
      for (let step = 1;; ++step) {
        let nx = x + step * dx;
        let ny = y + step * dy;
        if (nx < 0 || ny < 0 || nx >= X || ny >= Y) break;
        if (map[ny][nx] == '#') {
          map[ny][nx] = '.';
          ++destroyed;
          if (destroyed == 200) {
            console.log('Answer: ', 100 * nx + ny);
          }
          break;
        }
      }
    }
    if (saved == destroyed) break;
  }
}

solve2(input(), solve1(input()));

function input() {
  let str = `
.###.###.###.#####.#
#####.##.###..###..#
.#...####.###.######
######.###.####.####
#####..###..########
#.##.###########.#.#
##.###.######..#.#.#
.#.##.###.#.####.###
##..#.#.##.#########
###.#######.###..##.
###.###.##.##..####.
.##.####.##########.
#######.##.###.#####
#####.##..####.#####
##.#.#####.##.#.#..#
###########.#######.
#.##..#####.#####..#
#####..#####.###.###
####.#.############.
####.#.#.##########.
`;
  return str.trim().split('\n').map((str) => Array.from(str));
}

})();
