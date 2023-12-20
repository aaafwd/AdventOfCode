(function() {

/**
 * Generates permutations of a given `size`. Total number of generated
 * permutations will be `size!` (factorial).
 *
 * <p>This is a non-recursive implementation which is ~5x faster than a
 * recursive one (e.g. a unit test that run for ~1 sec would be running for
 * ~5 secs in the recursive implementation).
 */
function* generatePermutations(size) {
  let permutation = Array(size).fill(-1);
  let used = Array(size).fill(0);
  let ptr = 0;
  while (ptr >= 0) {
    if (ptr == size) {
      yield permutation.slice();
      --ptr;
    }
    let i = permutation[ptr];
    if (i >= 0) used[i] = 0;
    for (++i; i < size && used[i]; ++i);
    if (i < size) {
      used[i] = 1;
      permutation[ptr] = i;
      ++ptr;
    } else {
      permutation[ptr] = -1;
      --ptr;
    }
  }
}

/**
 * Applies a given `permutations` to a given array of `elements`.
 * @param {number} repeatCount how many times to apply the `permutation`. If
 *     negative, applies the `permutation` backwards.
 */
function applyPermutation(elements, permutation, repeatCount = 1) {
  console.assert(elements.length == permutation.length);

  // Find permutation cycles.
  let cycles = [];
  let seen = Array(permutation.length).fill(0);
  for (let i = 0; i < permutation.length; ++i) {
    if (seen[i]) continue;
    let pos = i;
    let cycle = [pos];
    while (1) {
      let next = permutation.indexOf(pos);
      console.assert(next >= 0);
      seen[next] = 1;
      if (next == cycle[0]) break;
      cycle.push(next);
      pos = next;
    }
    cycles.push(cycle);
  }

  // Apply the permutation `repeatCount` times.
  let result = Array(permutation.length);
  for (let cycle of cycles) {
    for (let i = 0; i < cycle.length; ++i) {
      let pos = (i + repeatCount) % cycle.length;
      if (pos < 0) pos += cycle.length;
      result[cycle[pos]] = elements[cycle[i]];
    }
  }
  return result;
}

function identicalPermutation(size) {
  return Array(size).fill(0).map((_, i) => i);
}

// ---------------------------------------------------------------------------
// TESTS
// ---------------------------------------------------------------------------

generatePermutations(3);

console.clear();
console.time('Runtime');
TEST_generatePermutations(0, [[]]);
TEST_generatePermutations(1, [[0]]);
TEST_generatePermutations(2, [[0, 1], [1, 0]]);
TEST_generatePermutations(3, [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
]);
TEST_generatePermutations(4, 24);
TEST_generatePermutations(5, 120);
TEST_generatePermutations(6, 720);
TEST_generatePermutations(7, 5040);
TEST_generatePermutations(8, 40320);
TEST_generatePermutations(9, 362880);
TEST_generatePermutations(10, 3628800);
TEST_generatePermutations(11, 39916800);

TEST_applyPermutation([10,20,30], [0,1,2], [10,20,30]);
TEST_applyPermutation([10,20,30], [0,1,2], [10,20,30], 10000000);
TEST_applyPermutation([10,20,30], [0,2,1], [10,30,20]);
TEST_applyPermutation([10,20,30], [0,2,1], [10,30,20], 3);
TEST_applyPermutation([10,20,30], [2,0,1], [10,20,30], 0);
TEST_applyPermutation([10,20,30], [2,0,1], [30,10,20], 1);
TEST_applyPermutation([10,20,30], [2,0,1], [20,30,10], 2);
TEST_applyPermutation([10,20,30], [2,0,1], [10,20,30], 3);
TEST_applyPermutation([10,20,30], [2,0,1], [10,20,30], 300000000);
TEST_applyPermutation([10,20,30], [2,0,1], [20,30,10], -1);
TEST_applyPermutation([10,20,30], [2,0,1], [20,30,10], -300000001);

function TEST_generatePermutations(size, expected) {
  console.log("generatePermutations(%d)", size);
  if (typeof expected == "number") {
    let generated = Array.from(generatePermutations(size));
    console.assert(generated.length == expected, generated.length, expected);
    return;
  }
  let index = 0;
  for (let actual of generatePermutations(size)) {
    let golden = expected[index];
    // console.log("actual", actual, "golden", golden);
    console.assert(actual instanceof Array);
    console.assert(golden instanceof Array);
    console.assert(actual.length == golden.length);
    for (let i = 0; i < actual.length; ++i) {
      console.assert(actual[i] == golden[i], actual, golden, index);
    }
    index++;
  }
  console.assert(index == expected.length,
                 "generated:", index, "expected:", expected.length);
}

function TEST_applyPermutation(elements, permutation, expected, repeatCount = 1) {
  console.log("applyPermutation([%s], [%s], repeatCount=%d)", elements, permutation, repeatCount);
  let actual = applyPermutation(elements, permutation, repeatCount)
  console.assert(actual instanceof Array);
  console.assert(expected instanceof Array);
  console.assert(actual.length == expected.length);
  for (let i = 0; i < actual.length; ++i) {
    console.assert(actual[i] == expected[i], "actual:", actual, "expected:", expected);
  }
}

console.timeEnd('Runtime');
})();

