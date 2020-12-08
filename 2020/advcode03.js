// https://adventofcode.com/2020/day/3

(function() {

let map = document.body.textContent.trim().split('\n');
let rows = map.length;
let columns = map[0].length;
const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
];
let trees = [];

for (let i = 0; i < slopes.length; ++i) {
  let x = 0, y = 0;
  trees[i] = 0;
  while (1) {
    x += slopes[i][0];
    y += slopes[i][1];
    if (y >= rows) break;
    while (x >= columns) x -= columns;
    if (map[y][x] == "#") ++trees[i];
  }

}

let answer1 = trees[1];
console.log("Answer 1:", answer1);

let answer2 = 1;
for (let x of trees) answer2 *= x;
console.log("Answer 2:", answer2);

})();

