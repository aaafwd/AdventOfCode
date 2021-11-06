// https://adventofcode.com/2018/day/9
// --- Day 9: Marble Mania ---
//
// Runtime: 210.281005859375 ms

(function() {
console.time("Runtime");

function simulate(players, last_marble) {
  let next = Array(last_marble).fill(0);
  let prev = Array(last_marble).fill(0);
  next[0] = prev[0] = 0;

  let scores = Array(players).fill(0);

  let current = 0;
  for (let marble = 1; marble <= last_marble; ++marble) {
    if (marble % 23) {
      current = next[current];
      next[marble] = next[current];
      prev[next[marble]] = marble;
      next[current] = marble;
      prev[marble] = current;
      current = marble;
    } else {
      let player = (marble - 1) % players;
      for (let k = 0; k < 7; ++k) current = prev[current];
      scores[player] += marble + current;

      let next_current = next[current];
      let prev_current = prev[current];
      next[prev_current] = next_current;
      prev[next_current] = prev_current;
      current = next_current;
    }
  }
  return Math.max(...scores);
}

function solve(players, last_marble) {
  let answer = simulate(players, last_marble);
  console.log("Answer for [%d, %d]:", players, last_marble, answer);
}

solve(9, 25);
solve(10, 1618);
solve(13, 7999);
solve(17, 1104);
solve(21, 6111);
solve(30, 5807);

solve(473, 70904);

solve(473, 7090400);

console.timeEnd("Runtime");
})();

