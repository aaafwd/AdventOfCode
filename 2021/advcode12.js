// https://adventofcode.com/2021/day/12
// --- Day 12: Passage Pathing ---
//
// Runtime: 66.217041015625 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let edges = input.trim().split('\n').map(row => row.trim().split('-'));
  let nodes = Array.from(new Set([].concat(...edges)));
  edges = edges.map(edge => edge.map(node => nodes.indexOf(node)));
  let map = [];
  for (let [i, j] of edges) {
    (map[i] = map[i] || []).push(j);
    (map[j] = map[j] || []).push(i);
  }
  return {nodes, map};
}

function countPaths(nodes, map, allow_twice = false) {
  const start = nodes.indexOf('start');
  const end = nodes.indexOf('end');
  const small_mask = nodes.map(node => node == node.toLowerCase());

  let result = 0;
  let queue = [[start, 0]];
  while (queue.length > 0) {
    let [node, state] = queue.pop();
    for (let next of map[node]) {
      if (next == start) continue;
      if (next == end) {
        ++result;
        continue;
      }
      let nstate = state;
      if (small_mask[next]) {
        nstate |= 1 << next;
        if (state == nstate) {
          if (allow_twice) nstate |= 1 << 25;
          if (state == nstate) continue;
        }
      } else if (!small_mask[node]) {
        console.warn('Ignoring big-to-big caves path: %s -> %s', nodes[node], nodes[next]);
        continue;
      }
      queue.push([next, nstate]);
    }
  }
  return result;
}

function solve(input) {
  let {nodes, map} = parseInput(input);
  let answer1 = countPaths(nodes, map);
  let answer2 = countPaths(nodes, map, true);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
start-A
start-b
A-c
A-b
b-d
A-end
b-end
`);

solve(`
dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`);

solve(`
fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`);

// Bonus: prevent infinite loops.
solve(`
start-A
start-b
A-c
A-b
b-d
A-end
b-end
A-B
B-C
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

