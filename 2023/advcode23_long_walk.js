// https://adventofcode.com/2023/day/23
// --- Day 23: A Long Walk ---
// Runtime: 811.8349609375 ms

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const kDirChars = "^>v<";

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim().split(''));
}

function getAdjacent(map, x, y, withSlopes) {
  const SY = map.length;
  const SX = map[0].length;
  let nodes = [];
  let slope = withSlopes ? kDirChars.indexOf(map[y][x]) : -1;
  for (let i = 0; i < kDirs.length; ++i) {
    if (slope != -1 && i != slope) continue;
    let [dx, dy] = kDirs[i];
    let nx = x + dx;
    let ny = y + dy;
    if (ny < 0 || ny >= SY || nx < 0 || nx >= SX) continue;
    if (map[ny][nx] == '#') continue;
    nodes.push([nx, ny]);
  }
  return nodes;
}

function convertToGraph(map, withSlopes) {
  let nodesMap = map.map(row => Array(row.length).fill(-1));
  let nodes = [];
  let start = -1;
  let finish = -1;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == '#') continue;
      if (y == 0 || y == map.length - 1 ||
          getAdjacent(map, x, y, withSlopes).length >= 3) {
        nodes.push([x, y]);
        nodesMap[y][x] = nodes.length - 1;
        if (y == 0) {
          console.assert(start == -1);
          start = nodesMap[y][x];
        }
        if (y == map.length - 1) {
          console.assert(finish == -1);
          finish = nodesMap[y][x];
        }
      }
    }
  }
  console.assert(start == 0);
  console.assert(finish == nodes.length - 1);

  let graph = Array(nodes.length).fill(0).map(_ => new Map());
  for (let from = 0; from < nodes.length; ++from) {
    let [x, y] = nodes[from];
    dfs(from, 0, x, y, -1, -1);
  }
  return graph;

  function dfs(from, steps, x, y, px, py) {
    if (steps > 0 && nodesMap[y][x] != -1) {
      let to = nodesMap[y][x];
      graph[from].set(to, steps);
      return;
    }
    for (let [nx, ny] of getAdjacent(map, x, y, withSlopes)) {
      if (nx == px && ny == py) continue;
      dfs(from, steps + 1, nx, ny, x, y);
    }
  }
}

function findLongestHamiltonianPath(map, withSlopes) {
  let graph = convertToGraph(map, withSlopes);

  let result = -1;
  let visited = Array(graph.length).fill(0);
  visited[0] = 1;
  dfs(0);
  return result;

  function dfs(v, count = 0) {
    if (v == graph.length - 1) {
      result = Math.max(result, count);
      return;
    }
    for (let [to, weight] of graph[v]) {
      if (visited[to]) continue;
      visited[to] = 1;
      dfs(to, count + weight);
      visited[to] = 0;
    }
  }
}

function solve(input) {
  let map = parseInput(input);
  console.log('Answer 1:', findLongestHamiltonianPath(map, true));
  console.log('Answer 2:', findLongestHamiltonianPath(map, false));
}

solve(`
#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

