// https://adventofcode.com/2021/day/20
// --- Day 20: Trench Map ---
//
// Runtime: 515.96630859375 ms

(function() {
console.time('Runtime');

const kDirs = [[-1, -1], [0, -1], [1, -1], [-1, 0], [0, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

function parseInput(input) {
  let parts = input.trim().split('\n\n');
  console.assert(parts.length == 2);
  let instructions = parts[0].trim().split('');
  let map = parts[1].trim().split('\n').map(row => row.trim().split(''));
  return [map, instructions];
}

function simulate(map, instructions) {
  let new_map = map.map(row => ['.', '.', ...row, '.', '.']);
  new_map.unshift(Array(new_map[0].length).fill('.'));
  new_map.unshift(Array(new_map[0].length).fill('.'));
  new_map.push(Array(new_map[0].length).fill('.'));
  new_map.push(Array(new_map[0].length).fill('.'));
  for (let y = -2; y < map.length + 2; ++y) {
    for (let x = -2; x < map[0].length + 2; ++x) {
      let index = 0;
      for (let [dx, dy] of kDirs) {
        let nx = x + dx;
        let ny = y + dy;
        if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) {
          ny = nx = 0; // refers to map[0][0], the outside intinite grid
        }
        index <<= 1;
        if (map[ny][nx] == '#') index |= 1;
      }
      console.assert(index < instructions.length);
      new_map[y + 2][x + 2] = instructions[index];
    }
  }
  return new_map;
}

function countLitPixels(map) {
  console.assert(map[0][0] == '.');
  return [].concat(...map).filter(x => x == '#').length;
}

function solve(input) {
  let [map, instructions] = parseInput(input);

  // Contract: perimeter of the region is the same as the outside infinite grid.
  map = map.map(row => ['.', ...row, '.']);
  map.unshift(Array(map[0].length).fill('.'));
  map.push(Array(map[0].length).fill('.'));

  map = simulate(map, instructions);
  map = simulate(map, instructions);
  let answer1 = countLitPixels(map);

  for (let i = 0; i < 48; ++i) {
    map = simulate(map, instructions);
  }
  let answer2 = countLitPixels(map);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

