// https://adventofcode.com/2022/day/16
// --- Day 16: Proboscidea Volcanium ---
// Runtime: 401.859130859375 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let regex = /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/;
  let nameToIndex = new Map();
  let nextIndex = 0;
  let rates = [];
  let edges = [];

  getNodeIndex("AA"); // Assign index 0 to "AA".
  for (let line of input.trim().split('\n')) {
    let [, valve, rate, tunnels] = line.trim().match(regex);
    let index = getNodeIndex(valve);
    rates[index] = +rate;
    edges[index] = edges[index] || [];
    tunnels.trim().split(',')
      .forEach(node => edges[index].push(getNodeIndex(node.trim())));
  }
  return {rates, edges};

  function getNodeIndex(name) {
    if (!nameToIndex.has(name)) {
      nameToIndex.set(name, nextIndex++);
    }
    return nameToIndex.get(name);
  }
}

function edgesToMap(edges) {
  const N = edges.length;
  let map = Array(N).fill(0).map(_ => Array(N).fill(-1));
  for (let start = 0; start < N; ++start) {
    let steps = 0;
    let seen = new Set();
    seen.add(start);
    let queue = [start];
    while (queue.length > 0) {
      ++steps;
      let wave = [];
      while (queue.length > 0) {
        let from = queue.pop();
        for (let to of edges[from]) {
          if (seen.has(to)) continue;
          seen.add(to);
          wave.push(to);
          console.assert(map[start][to] == -1, start, to);
          map[start][to] = steps;
        }
      }
      queue = wave;
    }
  }
  return map;
}

function getMostPressure(map, rates, workers, totalSteps) {
  let maxResult = -1;
  let nodes = rates
    .map((rate, index) => rate ? index : -1)
    .filter(index => index != -1);
  let seen = Array(nodes.length).fill(0);
  let maxResultPerWorkers = [0];
  for (let w = 1; w <= workers; ++w) {
    bruteForce(w, -1, 0, totalSteps, -1);
    maxResultPerWorkers[w] = maxResult;
  }
  return maxResult;

  function bruteForce(workers, index, result, steps, firstToIndex) {
    maxResult = Math.max(maxResult, result);
    let from = index == -1 ? 0 : nodes[index];
    for (let i = 0; i < nodes.length; ++i) {
      if (seen[i]) continue;
      let to = nodes[i];
      let cost = map[from][to] + 1;
      if (cost >= steps) continue;
      if (index == -1 && i < firstToIndex) continue;
      let pressure = rates[to] * (steps - cost);
      seen[i] = 1;
      bruteForce(
        workers,
        i,
        result + pressure,
        steps - cost,
        (index == -1) ? i : firstToIndex);
      seen[i] = 0;
    }
    --workers;
    if (workers > 0) {
      if (maxResult >= result + maxResultPerWorkers[workers]) return;
      bruteForce(workers, -1, result, totalSteps, firstToIndex);
    }
  }
}

function solve(input) {
  let {rates, edges} = parseInput(input);
  let map = edgesToMap(edges);

  let answer1 = getMostPressure(map, rates, 1, 30);

  let answer2 = getMostPressure(map, rates, 2, 26);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

