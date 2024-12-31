// https://adventofcode.com/2024/day/23
// --- Day 23: LAN Party ---
// Runtime: 36.18701171875 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.trim().split('-'));
}

function makeGraph(edges) {
  let graph = new Map();
  for (let [from, to] of edges) {
    if (!graph.has(from)) graph.set(from, new Set());
    if (!graph.has(to)) graph.set(to, new Set());
    graph.get(from).add(to);
    graph.get(to).add(from);
  }
  return graph;
}

function findSetsOf3(graph) {
  let result = 0;
  let nodes = Array.from(graph.keys());
  for (let i = 0; i < nodes.length; ++i) {
    for (let j = i + 1; j < nodes.length; ++j) {
      if (!graph.get(nodes[i]).has(nodes[j])) continue;
      for (let k = j + 1; k < nodes.length; ++k) {
        if (!graph.get(nodes[i]).has(nodes[k])) continue;
        if (!graph.get(nodes[j]).has(nodes[k])) continue;
        if (nodes[i][0] == 't' || nodes[j][0] == 't' || nodes[k][0] == 't') {
          ++result;
        }
      }
    }
  }
  return result;
}

function findMaxClique(graph) {
  let maxClique = 0;
  let maxCliqueNodes = [];
  let nodes = Array.from(graph.keys());

  let currentClique = [];
  function runFind(candidates) {
    if (maxClique < currentClique.length) {
      maxClique = currentClique.length;
      maxCliqueNodes = currentClique.slice();
    }

    candidates = candidates.filter(canIncreaseCurrentClique);
    if (candidates.length == 0) return;
    if (maxClique >= currentClique.length + candidates.length) return;

    while (candidates.length > 0) {
      currentClique.push(candidates.pop());
      runFind(candidates);
      currentClique.pop();
    }
  }

  function canIncreaseCurrentClique(node) {
    let adjacentNodes = graph.get(node);
    if (adjacentNodes.size < currentClique.length) return false;
    return currentClique.every(n => adjacentNodes.has(n));
  }

  runFind(nodes, new Set());
  return maxCliqueNodes.sort().join(',');
}

function solve(input) {
  let edges = parseInput(input);
  let graph = makeGraph(edges);

  let answer1 = findSetsOf3(graph);

  let answer2 = findMaxClique(graph);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();
