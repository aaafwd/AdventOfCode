// https://adventofcode.com/2022/day/9
// --- Day 9: Rope Bridge ---

(function() {

const kDirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const kDirNames = "RDLU";

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim().split(' '))
    .map(([dir, steps]) => [kDirNames.indexOf(dir), +steps]);
}

function simulate(moves, tailsCount) {
  let knots = Array(tailsCount + 1).fill(0).map(_ => [0, 0]);
  let visited = new Set();
  for (let [dir, steps] of moves) {
    let [dx, dy] = kDirs[dir];
    while (1) {
      let [tx, ty] = knots[knots.length - 1];
      let key = tx + ',' + ty;
      visited.add(key);
      if (steps == 0) break;
      --steps;
      knots[0][0] += dx;
      knots[0][1] += dy;
      adjust(1);
    }
  }

  function adjust(index) {
    if (index >= knots.length) return;
    let [hx, hy] = knots[index - 1];
    let [tx, ty] = knots[index];
    if (Math.abs(hx - tx) < 2 && Math.abs(hy - ty) < 2) return;
    if (tx < hx) ++tx;
    else if (tx > hx) --tx;
    if (ty < hy) ++ty;
    else if (ty > hy) --ty;
    knots[index] = [tx, ty];
    adjust(index + 1);
  }

  return visited.size;
}

function solve(input) {
  let moves = parseInput(input);
  let answer1 = simulate(moves, 1);
  let answer2 = simulate(moves, 9);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`);

solve(`
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`);

solve(document.body.textContent);

})();

