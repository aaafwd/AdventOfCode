// https://adventofcode.com/2020/day/12

(function() {

function process1(actions) {
  let pos = [0, 0];
  let dir = [1, 0];
  for (let [op,count] of actions) {
    if (op == 'L' || op == 'R') {
      count %= 360;
      if (count >= 180) {
        count -= 180;
        dir = [-dir[0], -dir[1]];
      }
      if (count >= 90) {
        count -= 90;
        dir = (op == 'L') ? [-dir[1], dir[0]] : [dir[1], -dir[0]];
      }
      console.assert(count == 0);
      continue;
    }
    let current = dir;
    if (op == 'N') current = [0, 1];
    else if (op == 'S') current = [0, -1];
    else if (op == 'E') current = [1, 0];
    else if (op == 'W') current = [-1, 0];
    else console.assert(op == 'F');
    pos[0] += current[0] * count;
    pos[1] += current[1] * count;
  }
  return pos;
}

function process2(actions) {
  let pos = [0, 0];
  let dir = [10, 1];
  for (let [op,count] of actions) {
    if (op == 'L' || op == 'R') {
      count %= 360;
      if (count >= 180) {
        count -= 180;
        dir = [-dir[0], -dir[1]];
      }
      if (count >= 90) {
        count -= 90;
        dir = (op == 'L') ? [-dir[1], dir[0]] : [dir[1], -dir[0]];
      }
      console.assert(count == 0);
      continue;
    }
    if (op == 'N') dir[1] += count;
    else if (op == 'S') dir[1] -= count;
    else if (op == 'E') dir[0] += count;
    else if (op == 'W') dir[0] -= count;
    else {
      console.assert(op == 'F');
      pos[0] += dir[0] * count;
      pos[1] += dir[1] * count;
    }
  }
  return pos;
}

function solve(input) {
  let actions = input.trim().split('\n').map(line => {
    let [,op,count] = line.match(/^(\w)(\d+)$/);
    return [op, +count];
  });
  let [x, y] = process1(actions);
  console.log("Answer 1:", Math.abs(x) + Math.abs(y));

  [x, y] = process2(actions);
  console.log("Answer 2:", Math.abs(x) + Math.abs(y));
}

solve(`
F10
N3
F7
R90
F11
`);

solve(document.body.textContent);

})();

