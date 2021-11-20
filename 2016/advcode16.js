// https://adventofcode.com/2016/day/16
// --- Day 16: Dragon Checksum ---
//
// Runtime: 2945.505126953125 ms

(function() {
console.time('Runtime');

function solve(state, length) {
  state = state.split('').map(x => +x);
  while (state.length < length) {
    state = state.concat(0, state.slice(0).reverse().map(x => x ^ 1));
  }
  state.length = length;
  while ((state.length & 1) == 0) {
    let j = 0;
    for (let i = 0; i < state.length; i += 2) {
      state[j++] = (state[i] == state[i + 1]) ? 1 : 0
    }
    state.length = j;
  }
  console.log('Answer for length %d: %s', length, state.join(''));
}

solve('10000', 20);

solve('10111100110001111', 272);

solve('10111100110001111', 35651584);

console.timeEnd('Runtime');
})();

