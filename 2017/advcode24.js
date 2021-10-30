// https://adventofcode.com/2017/day/24
// --- Day 24: Electromagnetic Moat ---

(function() {

function parseInput(input) {
  let edges = [];
  let node_to_edges = {};
  let lines = input.trim().split('\n');
  for (let line of lines) {
    let [i, j] = line.split('/').map(x => +x);
    let index = edges.length;
    edges.push([i, j]);
    (node_to_edges[i] = node_to_edges[i] || []).push(index);
    (node_to_edges[j] = node_to_edges[j] || []).push(index);
  }
  return {edges, node_to_edges};
}

function dfs(all_results, graph, node = 0, sum = 0, path_count = 0, visited = Array(graph.edges.length).fill(0)) {
  let result = sum;
  for (let index of graph.node_to_edges[node]) {
    if (visited[index]) continue;
    visited[index] = 1;

    let [from, to] = graph.edges[index];
    let next_node = node == from ? to : from;
    let score = dfs(all_results, graph, next_node, sum + from + to, path_count + 1, visited);
    if (result < score) result = score;

    visited[index] = 0;
  }
  all_results[path_count] = Math.max(all_results[path_count] || 0, result);
  return result;
}

function solve(input) {
  let graph = parseInput(input);

  let all_results = {};
  let answer1 = dfs(all_results, graph);

  let answer2 = all_results[Math.max(...Object.keys(all_results))];
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10
`);

solve(document.body.textContent);

})();

