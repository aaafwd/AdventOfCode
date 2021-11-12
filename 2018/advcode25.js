// https://adventofcode.com/2018/day/25
// --- Day 25: Four-Dimensional Adventure ---

(function() {

function getDistance([x1, y1, z1, q1], [x2, y2, z2, q2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2) + Math.abs(q1 - q2);
}

function parseInput(input) {
  return input.trim().split('\n').map(row => row.split(',').map(x => +x));
}

function markConstellation(index, points, mask) {
  let queue = [index];
  mask[index] = 1;

  while (queue.length > 0) {
    let index = queue.shift();
    for (let i = 0; i < points.length; ++i) {
      if (mask[i]) continue;
      if (getDistance(points[index], points[i]) <= 3) {
        mask[i] = 1;
        queue.push(i);
      }
    }
  }
}

function solve(input) {
  let points = parseInput(input);
  let mask = Array(points.length).fill(0);
  let answer = 0;
  for (let i = 0; i < points.length; ++i) {
    if (!mask[i]) {
      ++answer;
      markConstellation(i, points, mask);
    }
  }
  console.log('Answer:', answer);
}

solve(`
 0,0,0,0
 3,0,0,0
 0,3,0,0
 0,0,3,0
 0,0,0,3
 0,0,0,6
 9,0,0,0
12,0,0,0
`);

solve(`
-1,2,2,0
0,0,2,-2
0,0,0,-2
-1,2,0,0
-2,-2,-2,2
3,0,2,-1
-1,3,2,2
-1,0,-1,0
0,2,1,-2
3,0,0,0
`);

solve(`
1,-1,0,1
2,0,-1,0
3,2,-1,0
0,0,3,1
0,0,-1,-1
2,3,-2,0
-2,2,0,0
2,-2,0,-1
1,-1,0,-1
3,2,0,2
`);


solve(`
1,-1,-1,-2
-2,-2,0,1
0,2,1,3
-2,3,-2,1
0,2,3,-2
-1,-1,1,-2
0,-2,-1,0
-2,2,3,-1
1,2,2,0
-1,-2,0,-2
`);

solve(document.body.textContent);

})();

