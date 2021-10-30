// https://adventofcode.com/2017/day/7
// --- Day 7: Recursive Circus ---

(function() {

function countTotalWeights(graph, node) {
  if (!graph[node].total_weight) {
    graph[node].total_weight = graph[node].weight;
    for (let dep of graph[node].deps) {
      graph[node].total_weight += countTotalWeights(graph, dep);
    }
  }
  return graph[node].total_weight;
}

function solve(input) {
  let lines = input.trim().split('\n');
  const regex = /^\s*(\w+)\s*\((\d+)\)\s*(?:->\s*(.*))?$/;

  let graph = {};
  for (let line of lines) {
    let [, node, weight, deps] = line.match(regex);
    console.assert(!graph[node]);
    deps = deps ? deps.split(/\s*,\s*/) : [];
    graph[node] = {weight: +weight, deps};
  }

  // Mark all non bottom nodes.
  let all_deps = {};
  for (let node in graph) {
    for (let dep of graph[node].deps) {
      all_deps[dep] = 1;
    }
  }

  // Find all bottom nodes (must be exactly one).
  let root;
  for (let node in graph) {
    if (graph[node].deps.length && !all_deps[node]) {
      root = node;
      console.log("Answer 1 (bottom program):", root);
    }
  }

  for (let node in graph) {
    countTotalWeights(graph, node);
  }

  // Find all unbalanced nodes.
  let unbalanced = [];
  for (let node in graph) {
    if (!graph[node].deps.length) continue;
    let total_weigths = graph[node].deps.map(dep => graph[dep].total_weight);
    let size = new Set(total_weigths).size;
    if (size == 1) continue;
    console.assert(size == 2);
    console.assert(total_weigths.length > 2);
    let target_weight =
        (total_weigths[0] == total_weigths[1] || total_weigths[0] == total_weigths[2])
            ? total_weigths[0]
            : total_weigths[1];
    for (let i = 0; i < total_weigths.length; ++i) {
      if (total_weigths[i] != target_weight) {
        let dep_node_name = graph[node].deps[i]
        let dep_node = graph[dep_node_name];
        let corrected_weight = dep_node.weight - (total_weigths[i] - target_weight);
        console.log("\tUnbalanced node", dep_node_name,
            "with weight", dep_node.weight,
            "but should be", corrected_weight);
        dep_node.corrected_weight = corrected_weight;
        unbalanced.push(dep_node_name);
        break;
      }
    }
  }
  unbalanced.sort((a, b) => graph[a].total_weight - graph[b].total_weight);
  console.log("Answer 2:", graph[unbalanced[0]].corrected_weight);
}

solve(`
pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)
`);

solve(document.body.textContent);

})();

