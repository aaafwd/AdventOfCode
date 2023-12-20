(function() {

/**
 * Generates cartesian product.
 * See https://en.wikipedia.org/wiki/Cartesian_product.
 *
 * Usage:
 *   for (let sample of generateCartesianProduct([[1, 2], [3, 4]])) {
 *     // sample: [1, 3], [1, 4], [2, 3], [2, 4].
 *   }
 *
 * @param {!Array<!Iterable<*>>} arrays array of arrays of elements
 * @return {!Array<*>} with the same length as `arrays` where an element at
 *     index `i` is chosen from the `arrays[i]` array
 */
function* generateCartesianProduct(arrays) {
  function* impl(result, index) {
    if (index == arrays.length) {
      yield result.slice();
      return;
    }
    for (let item of arrays[index]) {
      result[index] = item;
      yield* impl(result, index + 1);
    }
  }
  if (arrays.length == 0) return;
  yield* impl(Array(arrays.length), 0);
}

// ---------------------------------------------------------------------------
// TESTS
// ---------------------------------------------------------------------------

console.clear();
TEST([], []);
TEST([[]], []);
TEST([[1]], [[1]]);
TEST([[1, 2, 3]], [[1], [2], [3]]);
TEST([[1], [2], [3]], [[1, 2, 3]]);
TEST([[1, 2], [3, 4], []], []);
TEST([[1, 2], [3, 4]], [
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
]);
TEST([[1, 2, 3], [10, 11], [20], [30, 31]], [
  [1, 10, 20, 30],
  [1, 10, 20, 31],
  [1, 11, 20, 30],
  [1, 11, 20, 31],
  [2, 10, 20, 30],
  [2, 10, 20, 31],
  [2, 11, 20, 30],
  [2, 11, 20, 31],
  [3, 10, 20, 30],
  [3, 10, 20, 31],
  [3, 11, 20, 30],
  [3, 11, 20, 31],
]);
// Also should work with arrays of Set's.
TEST([new Set([1, 2]), new Set([3, 4])], [
  [1, 3],
  [1, 4],
  [2, 3],
  [2, 4],
]);

function TEST(input, expected) {
  console.log(
    "TEST(\n\tinput = [" +
    input.map(array => "[" + array + "]") +
    "]\n\texpected = [" +
    expected.map(array => "[" + array + "]") + "])");
  let index = 0;
  for (let actual of generateCartesianProduct(input)) {
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
  console.assert(index == expected.length, index, expected.length);
}

})();

