// https://adventofcode.com/2018/day/10
// --- Day 10: The Stars Align ---

(function() {

function parseInput(input) {
  let lines = input.trim().split('\n');
  const regex = /position=<\s*([\d-]+),\s*([\d-]+)>\s*velocity=<\s*([\d-]+),\s*([\d-]+)/;
  let result = [];
  for (let line of lines) {
    let [, x, y, dx, dy] = line.match(regex).map(x => +x);
    result.push({x, y, dx, dy});
  }
  return result;
}

function solve(input) {
  let points = parseInput(input);

  function getScore(time) {
    let score = 0;
    for (let i = 0; i < points.length; ++i) {
      let px = points[i].x + time * points[i].dx;
      let py = points[i].y + time * points[i].dy;
      for (let j = i + 1; j < points.length; ++j) {
        let qx = points[j].x + time * points[j].dx;
        let qy = points[j].y + time * points[j].dy;
        score += (px - qx) * (px - qx) + (py - qy) * (py - qy);
      }
    }
    return score;
  }

  let [tLow, tHigh] = [0, 100];
  let scoreLow = getScore(tLow);
  while (getScore(tHigh) < scoreLow) {
    tHigh *= 2;
  }

  // Trisect to find T with minimum score.
  while (tLow < tHigh) {
    let third = Math.floor((tHigh - tLow) / 3);
    let [t1, t2] = [tLow + third, tHigh - third];
    let [score1, score2] = [getScore(t1), getScore(t2)];
    if (score1 < score2) {
      tHigh = t2 - 1;
    } else {
      tLow = t1 + 1;
    }
  }
  console.assert(tLow == tHigh, tLow, tHigh);

  // Advance points to {tLow} time.
  let [minx, maxx] = [2000000000, -2000000000];
  let [miny, maxy] = [2000000000, -2000000000];
  for (let point of points) {
    let x = (point.x += tLow * point.dx);
    let y = (point.y += tLow * point.dy);
    minx = Math.min(x, minx);
    maxx = Math.max(x, maxx);
    miny = Math.min(y, miny);
    maxy = Math.max(y, maxy);
  }

  // Print map.
  console.log("Answer 1:");
  let map = Array(maxy - miny + 1).fill().map(row => Array(maxx - minx + 1).fill(' '));
  points.forEach(({x, y}) => (map[y - miny][x - minx] = '#'));
  console.log(map.map(row => row.join('')).join('\n'));

  console.log("Answer 2:", tLow);
}

solve(document.body.textContent);

})();

