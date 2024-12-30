// https://adventofcode.com/2024/day/4
// --- Day 4: Ceres Search ---

(function() {

const kDirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.trim().split(''));
}

function canReadWord(map, x, y, dx, dy, word) {
  for (let i = 0; i < word.length; ++i) {
    let ch = word[i];
    let nx = x + dx * i;
    let ny = y + dy * i;
    if (ny < 0 || ny >= map.length) return false;
    if (nx < 0 || nx >= map[ny].length) return false;
    if (map[ny][nx] != ch) return false;
  }
  return true;
}

function findXmasWords(map) {
  let result = 0;
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[0].length; ++x) {
      for (let [dx, dy] of kDirs) {
        if (canReadWord(map, x, y, dx, dy, "XMAS")) ++result;
      }
    }    
  }
  return result;
}

function findXs(map) {
  let result = 0;
  for (let y = 0; y + 2 < map.length; ++y) {
    for (let x = 0; x + 2 < map[0].length; ++x) {
      let w1 = map[y][x] + map[y + 1][x + 1] + map[y + 2][x + 2];
      let w2 = map[y + 2][x] + map[y + 1][x + 1] + map[y][x + 2];
      if ((w1 == "MAS" || w1 == "SAM") && (w2 == "MAS" || w2 == "SAM")) {
        ++result;
      }
    }
  }
  return result;
}

function solve(input) {
  let map = parseInput(input);

  let answer1 = findXmasWords(map);

  let answer2 = findXs(map);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`);

solve(document.body.textContent);

})();

