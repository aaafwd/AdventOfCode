// https://adventofcode.com/2024/day/8
// --- Day 8: Resonant Collinearity ---
// Runtime: 16.819091796875 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.trim().split(''));
}

function toKey(x, y) {
  return (x << 16) | y;
}

function* antennas(map) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] != '.') yield [x, y];
    }
  }
}
  
function findAntinodes(map, isFixedDistance) {
  let nodes = new Set();
  for (let [x1, y1] of antennas(map)) {
    for (let [x2, y2] of antennas(map)) {
      if (map[y1][x1] != map[y2][x2]) continue;
      if (y1 == y2 && x1 == x2) continue;
      let dx = Math.max(x1 - x2);
      let dy = Math.max(y1 - y2);
      for (let i = 1;; ++i) {
        let candidates = [
          [x1 + dx * i, y1 + dy * i],
          [x1 - dx * i, y1 - dy * i],
          [x2 + dx * i, y2 + dy * i],
          [x2 - dx * i, y2 - dy * i]
        ];
        candidates = candidates
          .filter(([x, y]) => 0 <= y && y < map.length)
          .filter(([x, y]) => 0 <= x && x < map[y].length);
        if (candidates.length == 0) break;
        if (isFixedDistance) {
          candidates
            .filter(([x, y]) => x != x1 || y != y1)
            .filter(([x, y]) => x != x2 || y != y2)
            .forEach(([x, y]) => nodes.add(toKey(x, y)));
          break;
        } else {
          candidates
            .forEach(([x, y]) => nodes.add(toKey(x, y)));
        }
      }
    }
  }
  return nodes;
}
function solve(input) {
  let map = parseInput(input);

  let answer1 = findAntinodes(map, true).size;

  let answer2 = findAntinodes(map, false).size;

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

