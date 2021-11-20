// https://adventofcode.com/2016/day/8
// --- Day 8: Two-Factor Authentication ---

(function() {

function draw(input) {
  const regex_rect = /^rect (\d+)x(\d+)/;
  const regex_rotate_y = /^rotate row y=(\d+) by (\d+)/;
  const regex_rotate_x = /^rotate column x=(\d+) by (\d+)/;

  let map = Array(6).fill(0).map(row => Array(50).fill('.'));
  let lines = input.trim().split('\n'), match;
  for (let line of lines) {
    if ((match = line.match(regex_rect))) {
      let A = +match[1];
      let B = +match[2];
      for (let y = 0; y < B; ++y) {
        for (let x = 0; x < A; ++x) {
          map[y][x] = '#';
        }
      }
    } else if ((match = line.match(regex_rotate_y))) {
      let y = +match[1];
      let shift = +match[2];
      while (shift-- > 0) {
        map[y].unshift(map[y].pop());
      }
    } else if ((match = line.match(regex_rotate_x))) {
      let x = +match[1];
      let shift = +match[2];
      let column = Array(map.length);
      for (let y = 0; y < map.length; ++y) {
        let ny = (y + shift) % map.length;
        column[ny] = map[y][x];
      }
      for (let y = 0; y < map.length; ++y) {
        map[y][x] = column[y];
      }
    } else {
      console.assert(0, line);
    }
  }
  return map;
}

function solve(input) {
  let map = draw(input);
  let answer1 = map.map(row => row.filter(ch => ch == '#').length).reduce((x, y) => x + y);
  console.log('Answer 1:', answer1);
  console.log('Answer 2:');
  console.log(map.map(row => row.join('')).join('\n'));
}

solve(`
rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1
`);

solve(document.body.textContent);

})();

