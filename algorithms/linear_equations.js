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

