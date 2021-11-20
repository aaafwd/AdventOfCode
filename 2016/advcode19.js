// https://adventofcode.com/2016/day/19
// --- Day 19: An Elephant Named Joseph ---

(function() {

function solve(size) {
  let answer1 = 0;
  for (let N = 3; N <= size; ++N) {
    answer1 = (answer1 + 2) % N;
  }

  let answer2 = 0;
  for (let N = 3; N <= size; ++N) {
    // [0, 1, 2, ..., N-1] -> [1, 2, ..., k-1, k+1, ..., N-1, 0]
    let k = Math.floor(N / 2);
    answer2 = (answer2 < k - 1) ? (answer2 + 1) : ((answer2 + 2) % N);
  }

  console.log('Answer 1:', answer1 + 1, 'Answer 2:', answer2 + 1);
}

solve(5);
solve(3005290);

})();

