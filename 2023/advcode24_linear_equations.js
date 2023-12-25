// https://adventofcode.com/2023/day/24
// --- Day 24: Never Tell Me The Odds ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim()
      .split(/\s*@\s*/)
      .map(str => str.trim().split(/\s*,\s*/).map(x => BigInt(x))));
}

function getLineCoeff2D(line) {
  let [px, py] = line[0];
  let [vx, vy] = line[1];
  let [qx, qy] = [px + vx, py + vy];
  let a = py - qy;
  let b = qx - px;
  let c = -a*px - b*py;
  return [a, b, c];
}

function determinant2D(a, b, c, d) {
  return a * d - b * c;
}

function isParallel2D(line1, line2) {
  let [a1, b1, c1] = getLineCoeff2D(line1);
  let [a2, b2, c2] = getLineCoeff2D(line2);
  return determinant2D(a1, b1, a2, b2) == 0;
}

function intersects2D(line1, line2) {
  let [a1, b1, c1] = getLineCoeff2D(line1);
  let [a2, b2, c2] = getLineCoeff2D(line2);
  let det = determinant2D(a1, b1, a2, b2);
  if (det == 0) return null;
  let x = -determinant2D(c1, b1, c2, b2) / det;
  let y = -determinant2D(a1, c1, a2, c2) / det;
  return [x, y];
}

function getTime2D(line, pt) {
  let [px, py] = line[0];
  let [vx, vy] = line[1];
  let [x, y] = pt;
  if (vx) return (x - px) / vx;
  return (y - py) / vy;
}

function collide2D(lines, minCoord, maxCoord) {
  let result = 0;
  for (let i = 0; i < lines.length; ++i) {
    for (let j = i + 1; j < lines.length; ++j) {
      let pt = intersects2D(lines[i], lines[j]);
      if (pt == null) continue;
      let t1 = getTime2D(lines[i], pt);
      let t2 = getTime2D(lines[j], pt);
      if (t1 < 0 || t2 < 0) continue;
      let [x, y] = pt;
      if (minCoord <= x && x <= maxCoord && minCoord <= y && y <= maxCoord) {
        ++result;
      }
    }
  }
  return result;
}

/**
 * Solves a system of linear equations.
 *
 * @param {!Array<!Array<number|BigInt>>} equations contains an array of
 *     `a[i]` coefficients such that the answer `x[i]` satisfies:
 *      a[0] * x[0] + a[1] * x[1] + ... + a[N-1] * x[N-1] + a[N] = 0
 * @return {?Array<number|BigInt>} a solution `x[i]` of length `N`, or `null` when
 *     there are either no solutions, or more than one solution.
 */
function solveLinearEquationsSystem(equations) {
  // Note: Math.abs() does not work with BigInt.
  function abs(x) { return x < 0 ? -x: x; }
  
  const N = equations[0].length - 1;
  if (equations.length < N) return null;
  for (let i = 0; i < N; ++i) {
    // Implement "partial pivoting". Choose the pivot with max module.
    for (let j = i + 1; j < equations.length; ++j) {
      if (abs(equations[j][i]) > abs(equations[i][i])) {
        [equations[i], equations[j]] = [equations[j], equations[i]]; // Swap.
      }
    }
    if (equations[i][i] == 0) return null; // No solution.

    // Multiply each equation below by `-equations[i][i]` and
    // add the `equations[i]` multiplied by `equations[j][i]`.
    for (let j = i + 1; j < equations.length; ++j) {
      if (equations[j][i] == 0) continue;
      for (let k = i + 1; k <= N; ++k) {
        equations[j][k] *= -equations[i][i];
        equations[j][k] += equations[i][k] * equations[j][i];
      }
      // Assigning to zero and making it work for BigInt.
      equations[j][i] -= equations[j][i];
    }
  }

  // Calculate the answers.
  // 1) Move the terms with indexes `j > i` to the right.
  // 2) Divide the result by `equations[i][i]`.
  let answers = Array(N);
  for (let i = N - 1; i >= 0; --i) {
    answers[i] = -equations[i][N];
    for (let j = i + 1; j < N; ++j) {
      if (answers[j] == 0) continue;
      answers[i] -= equations[i][j] * answers[j];
    }
    answers[i] /= equations[i][i];
  }

  // Verify that all other (extra) equations are also satisfied.
  for (let i = N; i < equations.length; ++i) {
    let sum = equations[i]
      .map((value, index) => (index < answers.length ? value * answers[index] : value))
      .reduce((a, b) => a + b);
    if (sum != 0) return null;
  }

  return answers;
}

function findCommonLine(lines) {
  // Find a common line starting at [x, y, z] with velocity [t, u, v].
  let equations1 = [];
  let equations2 = [];
  for (let line of lines) {
    let [px, py, pz] = line[0];
    let [vx, vy, vz] = line[1];
    // (x - px) * (u - vy) = (y - py) * (t - vx)
    equations1.push([px, vy, py, vx]);
    // (x - px) * (v - vz) = (z - pz) * (t - vx)
    equations2.push([px, vz, pz, vx]);
  }

  // Collect equations in the form:
  // a0 * x + a1 * y + a2 * z + a3 * t + a4 * u + a5 * v + a6 = 0
  let equations = [];

  // From `equations1`:
  // (x - a1) * (u - a2) = (y - a3) * (t - a4)
  // (x - b1) * (u - b2) = (y - b3) * (t - b4)
  // x*u - x*a2 - u*a1 + a1*a2 = y*t - y*a4 - t*a3 + a3*a4
  // x*u - x*b2 - u*b1 + b1*b2 = y*t - y*b4 - t*b3 + b3*b4
  // x*(b2-a2) + u*(b1-a1) + a1*a2 - b1*b2 = y*(b4-a4) + t*(b3-a3) + a3*a4 - b3*b4
  for (let i = 1; i < equations1.length; ++i) {
    let [a1, a2, a3, a4] = equations1[i - 1];
    let [b1, b2, b3, b4] = equations1[i];
    // Using `a1-a1` to get a zero value of either type Number or BigInt.
    equations.push([b2-a2, a4-b4, a1-a1, a3-b3, b1-a1, a1-a1, a1*a2 - b1*b2 - a3*a4 + b3*b4]);
  }

  // From `equations2`:
  // (x - a1) * (v - a2) = (z - a3) * (t - a4)
  // (x - b1) * (v - b2) = (z - b3) * (t - b4)
  // x*v - x*a2 - v*a1 + a1*a2 = z*t - z*a4 - t*a3 + a3*a4
  // x*v - x*b2 - v*b1 + b1*b2 = z*t - z*b4 - t*b3 + b3*b4
  // x*(b2-a2) + v*(b1-a1) + a1*a2 - b1*b2 = z*(b4-a4) + t*(b3-a3) + a3*a4 - b3*b4
  for (let i = 1; i < equations2.length; ++i) {
    let [a1, a2, a3, a4] = equations2[i - 1];
    let [b1, b2, b3, b4] = equations2[i];
    // Using `a1-a1` to get a zero value of either type Number or BigInt.
    equations.push([b2-a2, a1-a1, a4-b4, a3-b3, a1-a1, b1-a1, a1*a2 - b1*b2 - a3*a4 + b3*b4]);
  }

  let answer = solveLinearEquationsSystem(equations);
  return answer[0] + answer[1] + answer[2];
}

function solve(input, minCoord, maxCoord) {
  let lines = parseInput(input);
  let answer1 = collide2D(lines, minCoord, maxCoord);
  let answer2 = findCommonLine(lines);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`, 7, 27);

solve(document.body.textContent, 200000000000000, 400000000000000);

})();

