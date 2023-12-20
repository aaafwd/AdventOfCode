// https://adventofcode.com/2023/day/6
// --- Day 6: Wait For It ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.replace(/^\w+:/, ''))
    .map(line => line.trim().split(/\s+/).map(x => +x));
}

function findNumberOfWays(T, S) {
  let D = T*T - 4*S;
  console.assert(D >= 0);
  D = Math.sqrt(D);
  let t1 = (T - D) / 2;
  let t2 = (T + D) / 2;
  if (t1 == Math.floor(t1)) t1 += 1;
  if (t2 == Math.floor(t2)) t2 -= 1;
  if (t1 < 0) t1 = 0;
  t1 = Math.ceil(t1);
  t2 = Math.floor(t2);
  let diff = t2 - t1 + 1;
  return diff;  
}
  
function solve(input) {
  let [times, distances] = parseInput(input);

  let answer1 = 1;
  for (let i = 0; i < times.length; ++i) {
    answer1 *= findNumberOfWays(times[i], distances[i]);
  }

  let T = +times.reduce((a, b) => a + '' + b);
  let S = +distances.reduce((a, b) => a + '' + b);
  let answer2 = findNumberOfWays(T, S);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
Time:      7  15   30
Distance:  9  40  200
`);
  
solve(document.body.textContent);

})();

