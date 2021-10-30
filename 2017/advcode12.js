// https://adventofcode.com/2017/day/12
// --- Day 12: Digital Plumber ---

(function() {

function dfs(graph, node, visited) {
  if (visited[node]) return 0;
  let result = 1;
  visited[node] = 1;
  for (let dep of graph[node]) {
    result += dfs(graph, dep, visited);
  }
  return result;
}

function solve(input) {
  let lines = input.trim().split('\n');
  const regex = /^(\d+)\s*<->\s*(.*)$/;

  let graph = {};
  for (let line of lines) {
    let [, id, deps] = line.match(regex);
    console.assert(!graph[id]);
    graph[id] = deps.trim().split(/\s*,\s*/);
  }

  let visited = {};
  let answer1 = dfs(graph, 0, visited);
  let answer2 = 1;
  for (let id in graph) {
    if (!visited[id]) {
      ++answer2;
      dfs(graph, id, visited)
    }
  }
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5
`);

solve(document.body.textContent);

})();

