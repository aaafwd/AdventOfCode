// https://adventofcode.com/2017/day/19
// --- Day 19: A Series of Tubes ---

(function() {

const kDirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const kDirChars = ['|', '|', '-', '-'];

function isChar(x) {
  return 'A' <= x && x <= 'Z';
}

function isValidPoint(map, x, y) {
  return 0 <= y && y < map.length && 0 <= x && x < map[y].length;
}

function isRightWay(map, x, y, dir) {
  let [dx, dy] = kDirs[dir];
  x += dx;
  y += dy;
  if (!isValidPoint(map, x, y) || map[y][x] == ' ') return false;
  if (isChar(map[y][x]) || map[y][x] == kDirChars[dir]) return true;
  return false;
}

function collectLetters(map, x, y, dir, output) {
  let steps = 0;
  while (isValidPoint(map, x, y) && map[y][x] != ' ') {
    if (isChar(map[y][x])) {
      output.push(map[y][x]);
    } else if (map[y][x] == '+') {
      dir ^= 2;
      if (!isRightWay(map, x, y, dir)) {
        dir ^= 1;
        console.assert(isRightWay(map, x, y, dir));
      }
    } else if (map[y][x] == ' ' || map[y][x] == '-' || map[y][x] == '|') {
      // Ignore.
    } else {
      console.assert(0, map[y][x]);
    }
    let [dx, dy] = kDirs[dir];
    x += dx;
    y += dy;
    ++steps;
  }
  return steps;
}

function solve(input) {
  while (input[0] == '\n') input = input.substr(1);
  let map = input.split('\n').map(row => row.split(''));

  let x = 0, y = 0;
  while (map[y][x] == ' ') ++x;
  console.assert(map[y][x] == '|');

  let output = [];
  let answer2 = collectLetters(map, x, y, 0, output);
  let answer1 = output.join('');

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ 
`);

solve(document.body.textContent);

})();

