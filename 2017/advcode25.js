// https://adventofcode.com/2017/day/25
// --- Day 25: The Halting Problem ---
//
// Runtime: 2390.106201171875 ms

(function() {
console.time("Runtime");

function parseInput(input) {
  let blueprint = {};
  const regex_begin = /Begin in state (\w)\./;
  const regex_steps = /checksum after (\d+) steps\./;
  const regex_in_state = /In state (\w):/;
  const regex_current_value = /If the current value is (\d):/;
  const regex_write_value = /Write the value (\d)\./;
  const regex_move = /Move one slot to the (left|right)\./;
  const regex_next_state = /Continue with state (\w)\./;

  let current_state = null;
  let lines = input.trim().split('\n').map(str => str.trim()).filter(str => str.length > 0);
  let match;
  for (let line of lines) {
    if ((match = line.match(regex_begin))) {
      blueprint.start = match[1];
      continue;
    }
    if ((match = line.match(regex_steps))) {
      blueprint.steps = +match[1];
      continue;
    }
    if ((match = line.match(regex_in_state))) {
      current_state = match[1];
      continue;
    }
    if ((match = line.match(regex_current_value))) {
      current_state = current_state[0] + match[1];
      continue;
    }

    console.assert(current_state && current_state.length == 2);
    blueprint[current_state] = blueprint[current_state] || {};

    if ((match = line.match(regex_write_value))) {
      blueprint[current_state].write = +match[1];
      continue;
    }
    if ((match = line.match(regex_move))) {
      blueprint[current_state].move = (match[1] == 'right') ? 1 : -1;
      continue;
    }
    if ((match = line.match(regex_next_state))) {
      blueprint[current_state].next_state = match[1];
      continue;
    }

    console.assert(0, line);
  }
  return blueprint;
}

function simulate(blueprint) {
  let tape = {};
  let state = blueprint.start;
  let position = 0;
  let checksum = 0;
  for (let step = 0; step < blueprint.steps; ++step) {
    let value = tape[position] || 0;
    let rule = blueprint[state + value];
    console.assert(rule);

    tape[position] = rule.write;
    position += rule.move;
    state = rule.next_state;

    if (value) --checksum;
    if (rule.write) ++checksum;
  }
  return checksum;
}

function solve(input) {
  let blueprint = parseInput(input);
  let answer = simulate(blueprint);
  console.log("Answer:", answer);
}

solve(`
Begin in state A.
Perform a diagnostic checksum after 6 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state B.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.
`);

solve(document.body.textContent);

console.timeEnd("Runtime");
})();

