// https://adventofcode.com/2016/day/22
// --- Day 22: Grid Computing ---

(function() {

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  const regex = /\/dev\/grid\/node-x(\d+)-y(\d+)\s+\d+T\s+(\d+)T\s+(\d+)T/;
  let lines = input.trim().split('\n');
  let nodes = [];
  lines.shift();
  lines.shift();
  for (let line of lines) {
    let [, x, y, used, avail] = line.match(regex).map(x => +x);
    nodes.push({x, y, used, avail});
  }
  return nodes;
}

function countViablePairs(nodes) {
  let count = 0;
  for (let a of nodes) {
    if (a.used == 0) continue;
    for (let b of nodes) {
      if (a == b) continue;
      if (a.used <= b.avail) ++count;
    }
  }
  return count;
}

function bfs(map, src, dst) {
  let mask = [];
  let steps = 0;
  let queue = [src];
  setMask(src);

  function setMask([x, y]) {
    mask[y] = mask[y] || [];
    mask[y][x] = 1;
  }

  function getMask([x, y]) {
    mask[y] = mask[y] || [];
    return mask[y][x] || 0;
  }

  while (queue.length > 0) {
    ++steps;
    let new_queue = [];
    for (let [x, y] of queue) {
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) continue;
        if (map[ny][nx] != '.') continue;
        if (getMask([nx, ny])) continue;
        if (dst[0] == nx && dst[1] == ny) return steps;
        setMask([nx, ny]);
        new_queue.push([nx, ny]);
      }
    }
    queue = new_queue;
  }
  return NaN;
}

function countFewestSteps(nodes) {
  // Check preconditions.
  let empty_nodes = nodes.filter(n1 => n1.used == 0);
  console.assert(empty_nodes.length == 1);

  let empty_node = empty_nodes[0];
  for (let a of nodes) {
    if (a.used == 0) continue;
    for (let b of nodes) {
      if (a == b) continue;
      if (a.used <= b.avail) {
        console.assert(a == empty_node || b == empty_node);
      }
    }
  }

  let map = [];
  nodes.forEach(({x, y, used, avail}) => {
    map[y] = map[y] || [];
    if (used == 0) {
      map[y][x] = '_';
    } else {
      map[y][x] = (used <= empty_node.avail) ? '.' : '#';
    }
  });
  // console.log(map.map(row => row.join('')).join('\n'));

  // Assert first row is the shortest.
  for (let x = 0; x < map[0].length; ++x) {
    console.assert(map[0][x] == '.');
  }

  let result = bfs(map, [empty_node.x, empty_node.y], [map[0].length - 2, 0]);
  result += map[0].length - 1;
  result += (map[0].length - 2) * 4;
  return result;
}

function solve(input) {
  let nodes = parseInput(input);

  let answer1 = countViablePairs(nodes);
  console.log('Answer 1:', answer1);

  let answer2 = countFewestSteps(nodes);
  console.log('Answer 2:', answer2);
}

solve(`
root@ebhq-gridcenter# df -h
Filesystem            Size  Used  Avail  Use%
/dev/grid/node-x0-y0   10T    8T     2T   80%
/dev/grid/node-x0-y1   11T    6T     5T   54%
/dev/grid/node-x0-y2   32T   28T     4T   87%
/dev/grid/node-x1-y0    9T    7T     2T   77%
/dev/grid/node-x1-y1    8T    0T     8T    0%
/dev/grid/node-x1-y2   11T    7T     4T   63%
/dev/grid/node-x2-y0   10T    6T     4T   60%
/dev/grid/node-x2-y1    9T    8T     1T   88%
/dev/grid/node-x2-y2    9T    6T     3T   66%
`);

solve(document.body.textContent);

})();

