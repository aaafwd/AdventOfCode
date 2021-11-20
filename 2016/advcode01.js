// https://adventofcode.com/2016/day/1
// --- Day 1: No Time for a Taxicab ---

(function() {

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function walk(commands) {
  let x = 0, y = 0, dir = 0;
  let points = [[0, 0]];
  for (let cmd of commands) {
    if (cmd[0] == 'R') {
      dir = (dir + 1) & 3;
    } else if (cmd[0] == 'L') {
      dir = (dir + 3) & 3;
    } else {
      console.assert(0, cmd);
    }
    let steps = +cmd.substr(1);
    let [dx, dy] = kDirs[dir];
    x += dx * steps;
    y += dy * steps;
    points.push([x, y]);
  }
  return points;
}

function intersect([x1, y1], [x2, y2], [x3, y3], [x4, y4]) {
  if (x1 > x2) [x1, x2] = [x2, x1];
  if (y1 > y2) [y1, y2] = [y2, y1];
  if (x3 > x4) [x3, x4] = [x4, x3];
  if (y3 > y4) [y3, y4] = [y4, y3];
  x1 = Math.max(x1, x3);
  y1 = Math.max(y1, y3);
  x2 = Math.min(x2, x4);
  y2 = Math.min(y2, y4);
  if (x1 <= x2 && y1 <= y2) return [x1, y1];
  return null;
}

function findFirstRepeatedPoint(points) {
  for (let i = 3; i < points.length; ++i) {
    let p1 = points[i - 1];
    let p2 = points[i];
    for (let j = 1; j < i - 1; ++j) {
      let p3 = points[j - 1];
      let p4 = points[j];
      let pt = intersect(p1, p2, p3, p4);
      if (pt) return pt;
    }
  }
  return [0, 0];
}

function getDistance([x, y]) {
  return Math.abs(x) + Math.abs(y);
}

function solve(input) {
  let commands = input.trim().split(',').map(str => str.trim());
  let points = walk(commands);
  let answer1 = getDistance(points[points.length - 1]);
  let answer2 = getDistance(findFirstRepeatedPoint(points));
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`R2, L3`);
solve(`R2, R2, R2`);
solve(`R5, L5, R5, R3`);
solve(`R8, R4, R4, R8`);

solve(document.body.textContent);

})();

