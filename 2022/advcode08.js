// https://adventofcode.com/2022/day/8
// --- Day 8: Treetop Tree House ---

(function() {

const kDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim().split('').map(Number));
}

function isVisible(map, x, y) {
  const SY = map.length;
  const SX = map[0].length;
  for (let [dx, dy] of kDirs) {
    for (let steps = 1;; ++steps) {
      let nx = x + dx * steps;
      let ny = y + dy * steps;
      if (ny < 0 || ny >= SY || nx < 0 || nx >= SX) return true;
      if (map[ny][nx] >= map[y][x]) break;
    }
  }
  return false;
}

function countVisible(map) {
  const SY = map.length;
  const SX = map[0].length;
  let result = 0;
  for (let y = 0; y < SY; ++y) {
    for (let x = 0; x < SX; ++x) {
      if (isVisible(map, x, y)) ++result;
    }
  }
  return result;
}

function getScenicScore(map, x, y) {
  const SY = map.length;
  const SX = map[0].length;
  let score = 1;
  for (let [dx, dy] of kDirs) {
    for (let steps = 1;; ++steps) {
      let nx = x + dx * steps;
      let ny = y + dy * steps;
      if (ny < 0 || ny >= SY || nx < 0 || nx >= SX) {
        score *= steps - 1;
        break;
      }
      if (map[ny][nx] >= map[y][x]) {
        score *= steps;
        break;
      }
    }
  }
  return score;
}

function countMaxScenicScore(map) {
  const SY = map.length;
  const SX = map[0].length;
  let result = 0;
  for (let y = 0; y < SY; ++y) {
    for (let x = 0; x < SX; ++x) {
      result = Math.max(result, getScenicScore(map, x, y));
    }
  }
  return result;
}

function solve(input) {
  let map = parseInput(input);
  let answer1 = countVisible(map);
  let answer2 = countMaxScenicScore(map);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
30373
25512
65332
33549
35390
`);

solve(document.body.textContent);

})();

