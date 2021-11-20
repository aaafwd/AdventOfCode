// https://adventofcode.com/2016/day/11
// --- Day 11: Radioisotope Thermoelectric Generators ---
//
// Runtime: 2626.636962890 ms (optimised to run double BFS)
// Runtime: 6508.596191406 ms (single BFS)

(function() {
console.time('Runtime');

class BitSet {
  constructor(capacity = 1024) {
    this.mask_ = Array(capacity).fill(0);
  }

  getOffset_(index) {
    let offset = index >> 5;
    let bit = index & 31;
    if (offset >= this.mask_.length) {
      let old_len = this.mask_.length;
      let len = this.mask_.length;
      while (offset >= len) len *= 2;
      this.mask_.length = len;
      this.mask_.fill(0, old_len);
    }
    return [offset, bit];
  }

  set(index) {
    let [offset, bit] = this.getOffset_(index);
    this.mask_[offset] |= (1 << bit);
  }

  test(index) {
    let [offset, bit] = this.getOffset_(index);
    return (this.mask_[offset] & (1 << bit)) != 0;
  }
}

function parseInput(input) {
  let lines = input.trim().split('\n');
  const kFloors = ['first', 'second', 'third', 'fourth'];
  const regex_floor = /(\w+) floor/;
  const regex_generator = /(\w+) generator/g;
  const regex_microchip = /(\w+)-compatible microchip/g;

  let items = {};
  for (let line of lines) {
    let [, floor] = line.match(regex_floor);
    floor = kFloors.indexOf(floor);
    console.assert(floor >= 0, line);

    for (let match of line.matchAll(regex_generator)) {
      let metall = match[1];
      items[metall] = items[metall] || {};
      console.assert(items[metall].generator === undefined);
      items[metall].generator = floor;
    }

    for (let match of line.matchAll(regex_microchip)) {
      let metall = match[1];
      items[metall] = items[metall] || {};
      console.assert(items[metall].microchip === undefined);
      items[metall].microchip = floor;
    }
  }
  return Object.values(items);
}

// If `optimise` is true then runs the BFS simultaneously from both ends.
function simulate(items, optimise = !!true) {
  const items_count = items.length * 2;

  // State bits: <lift_floor>, <g1>, <m1>, <g2>, <m2>,...
  function toState(items, floor) {
    let state = floor;
    for (let i = 0; i < items.length; ++i) {
      state <<= 2;
      state |= items[i].generator;
      state <<= 2;
      state |= items[i].microchip;
    }
    return state;
  }

  function getItemFloor(state, i) {
    return (state >> (i * 2)) & 3;
  }

  function setItemFloor(state, i, floor) {
    state &= ~(3 << (i * 2));
    state |= floor << (i * 2);
    return state;
  }

  function setLiftFloor(state, floor) {
    return setItemFloor(state, items_count, floor);
  }

  function verifyState(state) {
    let gen_floors = 0;
    for (let g = 1; g < items_count; g += 2) {  // generators
      let g_floor = getItemFloor(state, g);
      gen_floors |= (1 << g_floor);
    }
    for (let m = 0; m < items_count; m += 2) {  // microchips
      let m_floor = getItemFloor(state, m);
      let is_connected = (getItemFloor(state, m ^ 1) == m_floor);
      if (is_connected) continue;
      if (gen_floors & (1 << m_floor)) return false;
    }
    return true;
  }

  function getNextStates(state) {
    let result = [];
    let floor = (state >> (items_count * 2)) & 3;
    for (let df = -1; df <= 1; df +=2) {
      let next_floor = floor + df;
      if (next_floor < 0 || next_floor > 3) continue;
      for (let i = 0; i < items_count; ++i) {
        if (getItemFloor(state, i) != floor) continue;
        for (let j = i; j < items_count; ++j) {
          if (getItemFloor(state, j) != floor) continue;
          let next_state = setLiftFloor(state, next_floor);
          next_state = setItemFloor(next_state, i, next_floor);
          next_state = setItemFloor(next_state, j, next_floor);
          if (verifyState(next_state)) {
            result.push(next_state);
          }
        }
      }
    }
    return result;
  }

  let state = toState(items, 0);
  let final_state = (1 << (items_count * 2 + 2)) - 1;

  let queues = [[state], optimise ? [final_state] : []];
  let visited = [new BitSet(), new BitSet()];
  visited[0].set(state);
  visited[1].set(final_state);

  let steps = 0;
  while (1) {
    if (queues[0].length == 0 ||
        (queues[1].length > 0 && queues[0].length > queues[1].length)) {
      [queues[0], queues[1]] = [queues[1], queues[0]];
      [visited[0], visited[1]] = [visited[1], visited[0]];
      if (queues[0].length == 0) break;
    }
    ++steps;
    let next_queue = [];
    for (state of queues[0]) {
      let next_states = getNextStates(state);
      for (let next_state of next_states) {
        if (visited[0].test(next_state)) continue;
        if (visited[1].test(next_state)) return steps;
        next_queue.push(next_state);
        visited[0].set(next_state);
      }
    }
    queues[0] = next_queue;
  }
  return -1;
}

function solve(input) {
  let items = parseInput(input);
  let answer1 = simulate(items);
  console.log('Answer 1:', answer1);

  items.push({microchip: 0, generator: 0}, {microchip: 0, generator: 0});
  let answer2 = simulate(items);
  console.log('Answer 2:', answer2);
}

solve(`
The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

