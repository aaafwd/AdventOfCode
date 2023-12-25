// https://adventofcode.com/2023/day/25
// --- Day 25: Snowverload ---
// Runtime: 237.8349609375 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let nodes = {};
  let edges = [];
  let lines = input.trim().split('\n');
  for (let line of lines) {
    let [src, rest] = line.trim().split(':');
    rest = rest.trim().split(/\s+/);
    nodes[src] = nodes[src] || new Set();
    for (let dst of rest) {
      console.assert(!edges.some(([a, b]) => (a == src && b == dst) || a == dst && b == src));
      edges.push([src, dst]);
      nodes[dst] = nodes[dst] || new Set();
      nodes[src].add(dst);
      nodes[dst].add(src);
    }
  }
  return [nodes, edges];
}

/**
 * Finds bridges in a graph in O(N+M) time, where N is the number of nodes,
 * and M is the number of edges.
 *
 * @param {!Array<!Set<string>>} nodes
 */
function findBridges(nodes) {
  const root = Object.keys(nodes)[0];
  let bridges = [];
  let timeIn = {};
  let groups = {};
  let timer = 0;
  dfs(root);
  return bridges;

  function dfs(node, prev) {
    groups[node] = timeIn[node] = ++timer;
    for (let to of nodes[node]) {
      if (to == prev) continue;
      if (timeIn[to]) {
        groups[node] = Math.min(groups[node], timeIn[to]);
        continue;
      }
      dfs(to, node);
      groups[node] = Math.min(groups[node], groups[to]);
      if (groups[to] > timeIn[node]) {
        bridges.push([node, to]);
      }
    }
  }
}

function findShortestPath(nodes, src, dst) {
  let queue = [src];
  let prev = new Map();
  prev.set(src, null);

  while (queue.length > 0) {
    let wave = [];
    while (queue.length > 0) {
      let node = queue.pop();
      for (let next of nodes[node]) {
        if (prev.has(next)) continue;
        prev.set(next, node);
        wave.push(next);
      }
    }
    queue = wave;
    if (prev.has(dst)) break;
  }

  let path = [];
  for (let node = dst; node != null; node = prev.get(node)) {
    path.push(node);
    console.assert(prev.has(node));
  }
  path.reverse();
  console.assert(path[0] == src);
  return path;
}

function divideIntoComponents(nodes, edges) {
  const totalNodes = Object.keys(nodes).length;
  const start = Object.keys(nodes)[0];

  for (let k = 0; k < edges.length; ++k) {
    // Random optimization of choosing the first edge to remove:
    // iterate backwards starting from the middle.
    let i = ((edges.length >> 1) - k + edges.length) % edges.length;
    removeEdge(...edges[i]);

    // The second edge to remove has to be on a path between the end points of
    // the first removed edge.
    let path = findShortestPath(nodes, ...edges[i]);
    // console.log("Removing:", i, "out of", edges.length, "path:", path.length);
    
    for (let j = 1; j < path.length; ++j) {
      let u = path[j - 1];
      let v = path[j];
      removeEdge(u, v);

      // Finally, the third edge to remove should be a bridge.
      let bridges = findBridges(nodes);
      if (bridges.length > 0) {
        console.assert(bridges.length == 1);
        for (let bridge of bridges) removeEdge(...bridge);
        let component = dfs(start);
        console.assert(component != totalNodes);
        return component * (totalNodes - component);
      }
      addEdge(u, v);
    }
    addEdge(...edges[i]);
  }

  function dfs(node) {
    let count = 0;
    let seen = new Set();
    let queue = [node];
    seen.add(node);
    while (queue.length > 0) {
      node = queue.pop();
      count++;
      for (let dst of nodes[node]) {
        if (seen.has(dst)) continue;
        seen.add(dst);
        queue.push(dst);
      }
    }
    return count;
  }

  function removeEdge(src, dst) {
    nodes[src].delete(dst);
    nodes[dst].delete(src);
  }

  function addEdge(src, dst) {
    nodes[src].add(dst);
    nodes[dst].add(src);
  }
}

function solve(input) {
  let [nodes, edges] = parseInput(input);
  let answer = divideIntoComponents(nodes, edges);
  console.log('Answer:', answer);
}

solve(`
jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

