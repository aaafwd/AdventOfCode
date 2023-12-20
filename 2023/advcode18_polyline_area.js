// https://adventofcode.com/2023/day/18
// --- Day 18: Lavaduct Lagoon ---

(function() {

const kDirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const kDirNames = "RDLU";

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => {
      let [, dir, steps, color] = line.match(/^\s*(\w)\s+(\d*)\s+\(#([\w\d]+)\)\s*$/);
      dir = kDirNames.indexOf(dir);
      console.assert(dir >= 0);
      color = color.split('');
      let dir2 = +color.pop();
      console.assert(0 <= dir2 && dir2 < 4);
      let steps2 = parseInt(color.join(''), 16);
      return [dir, +steps, dir2, steps2];
    });
}

// `moves` is an array of [dir, steps] pairs.
function getPolylineArea(moves) {
  let path = [];
  let xxs = [0]; // All X-coordinates.
  let yys = [0]; // All Y-coordinates.

  let x = 0, y = 0;
  for (let [dir, steps] of moves) {
    let [dx, dy] = kDirs[dir];
    x += dx * steps;
    y += dy * steps;
    path.push([x, y, dir]);
    if (xxs.indexOf(x) == -1) xxs.push(x);
    if (yys.indexOf(y) == -1) yys.push(y);
  }
  xxs.sort((a, b) => a - b);
  yys.sort((a, b) => a - b);

  const SX = xxs.length * 2 + 1;
  const SY = yys.length * 2 + 1;
  const map = Array(SY).fill(0).map(_ => Array(SX).fill('.'));
  path = path.map(([x, y, dir]) => [xxs.indexOf(x) * 2 + 1, yys.indexOf(y) * 2 + 1, dir]);

  [x, y] = path[path.length - 1];
  for (let i = 0; i < path.length; ++i) {
    let [nx, ny, dir] = path[i];
    let [dx, dy] = kDirs[dir];
    // Perpendicular direction.
    let [px, py] = kDirs[(dir + 1) % kDirs.length];
    while (x != nx || y != ny) {
      map[y][x] = '#';
      if (map[y + py][x + px] == '.') {
        map[y + py][x + px] = 'I';
      }
      x += dx;
      y += dy;
    }
  }

  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == 'I') fillInner(x, y);
    }
  }
  // console.log(map.map(row => row.join('')).join('\n'));

  const innerBlock = (map[0][0] == '.') ? 'I' : '.';
  let area = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == innerBlock) {
        let i = Math.floor((x - 1) / 2);
        let j = Math.floor((y - 1) / 2);
        let sx = (xxs[i + 1] - xxs[i] + 1);
        let sy = (yys[j + 1] - yys[j] + 1);
        if ((y & 1) == 0 && (x & 1) == 0) {
          area += sx * sy;
        } else if ((y & 1) == 0) {
          area -= sy;
        } else if ((x & 1) == 0) {
          area -= sx;
        } else {
          // Corners: will be added 4x times and removed 4x times above,
          // thus adding the corner to the result.
          area++;
        }
      }
    }
  }
  return area;

  function fillInner(x, y) {
    let ch = map[y][x];
    let queue = [[x, y]];
    while (queue.length > 0) {
      [x, y] = queue.pop();
      for (let [dy, dx] of kDirs) {
        let ny = (y + dy + map.length) % map.length;
        let nx = (x + dx + map[ny].length) % map[ny].length;
        if (map[ny][nx] == '.') {
          map[ny][nx] = ch;
          queue.push([nx, ny]);
        }
      }
    }
  }
}

function solve(input) {
  let config = parseInput(input);
  let answer1 = getPolylineArea(config.map(([dir, steps]) => [dir, steps]));
  let answer2 = getPolylineArea(config.map(([,,dir, steps]) => [dir, steps]));
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`);

solve(document.body.textContent);

})();

