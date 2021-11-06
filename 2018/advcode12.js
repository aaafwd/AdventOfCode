// https://adventofcode.com/2018/day/12
// --- Day 12: Subterranean Sustainability ---
//
// Runtime: 11.143798828125 ms

(function() {
console.time("Runtime");

function toBinaryStr(str) {
  return str.replaceAll('.', '0').replaceAll('#', '1');
}

function parseInput(input) {
  let lines = input.trim().split('\n').filter(str => str.trim().length);

  let regex_state = /^initial state:\s*([\.#]+)$/;
  let [, state] = lines.shift().match(regex_state);
  state = toBinaryStr(state).split('').map(x => +x);

  let rules = Array(32).fill(0);
  let regex_rule = /^([\.#]+)\s*=>\s*([\.#])\s*$/;
  for (let line of lines) {
    let [, left, right] = line.match(regex_rule);
    if (right == '.') continue;
    left = parseInt(toBinaryStr(left), 2);
    rules[left] = 1;
  }
  console.assert(rules[0] == 0);
  return {state, rules};
}

function transform(rules, state, offset) {
  let new_state = [];

  let current = 0;
  for (let i = -2; i < state.length + 2; ++i) {
    current = (current << 1) & 31;
    if (state[i + 2]) current |= 1;
    new_state.push(rules[current]);
  }
  if (new_state[0]) {
    offset -= 2;
  } else if (new_state[1]) {
    offset -= 1;
    new_state.shift();
  } else {
    new_state.shift();
    new_state.shift();
  }

  while (new_state.length > 0 && !new_state[new_state.length - 1]) {
    --new_state.length;
  }

  state = new_state;
  return [state, offset];
}

function bulkTransform(rules, state, offset, steps) {
  for (let i = 0; i < steps; ++i) {
    [state, offset] = transform(rules, state, offset);
  }
  return [state, offset];
}

function getStateSum(state, offset) {
  return state.map((x, index) => x ? index + offset : 0).reduce((x, y) => x + y);
}

function solve(input, generations) {
  const chunkSize = 100;

  let offset = 0;
  let answer = 0;
  let {state, rules} = parseInput(input);

  if (generations <= chunkSize * 10 || (generations % chunkSize) != 0) {
    [state, offset] = bulkTransform(rules, state, offset, generations);
    answer = getStateSum(state, offset);
  } else {
    // Assume linear growth.
    // TODO: Why? Proof?
    let chunks = [];
    for (let i = 1; i <= 10 && chunkSize * i <= generations; ++i) {
      [state, offset] = bulkTransform(rules, state, offset, chunkSize);
      chunks.push(getStateSum(state, offset));
    }
    for (let i = chunks.length - 1; i >= 0 ; --i) {
      chunks[i] -= chunks[i - 1];
    }
    for (let i = 2; i < chunks.length; ++i) {
      console.assert(chunks[i] == chunks[1]);
    }

    answer = getStateSum(state, offset);
    answer += ((generations / chunkSize) - chunks.length) * chunks[chunks.length - 1];
  }
  console.log("Answer (after %d generations):", generations, answer);
}

solve(`
initial state: #..#.#..##......###...###

...## => #
..#.. => #
.#... => #
.#.#. => #
.#.## => #
.##.. => #
.#### => #
#.#.# => #
#.### => #
##.#. => #
##.## => #
###.. => #
###.# => #
####. => #
`, 20);

solve(document.body.textContent, 20);

solve(document.body.textContent, 50000000000);

console.timeEnd("Runtime");
})();

