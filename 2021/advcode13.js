// https://adventofcode.com/2021/day/13
// --- Day 13: Transparent Origami ---

(function() {

function parseInput(input) {
  let parts = input.trim().split('\n\n');

  let points = parts[0].trim().split('\n').map(row => row.trim().split(',').map(Number));
  let max_x = Math.max(...points.map(pt => pt[0]));
  let max_y = Math.max(...points.map(pt => pt[1]));
  let map = Array(max_y + 1).fill(0).map(row => Array(max_x + 1).fill(' '));
  points.forEach(([x, y]) => map[y][x] = '#');
  
  const regex = /([xy])=(\d+)/;
  let instructions = parts[1].trim().split('\n').map(row => {
    let [, ch, num] = row.match(regex);
    return {ch, num: +num};
  });
  return {map, instructions};
}

function doFold(map, instr) {
  let {ch, num} = instr;
  if (ch == 'x') {
    for (let y = 0; y < map.length; ++y) {
      for (let x = num + 1; x < map[y].length; ++x) {
        if (map[y][x] != '#') continue;
        let nx = 2 * num - x;
        console.assert(nx >= 0);
        map[y][nx] = '#';
      }
      map[y].length = num + 1;
    }
  } else if (ch == 'y') {
    for (let y = num + 1; y < map.length; ++y) {
      for (let x = 0; x < map[y].length; ++x) {
        if (map[y][x] != '#') continue;
        let ny = 2 * num - y;
        console.assert(ny >= 0);
        map[ny][x] = '#';
      }
    }
    map.length = num + 1;
  } else {
    console.assert(0, instr);
  }
  return map;
}

function countDots(map) {
  return [].concat(...map).filter(x => x == '#').length;
}

function solve(input) {
  let {map, instructions} = parseInput(input);

  for (let i = 0; i < instructions.length; ++i) {
    doFold(map, instructions[i]);
    if (i == 0) {
      console.log('Answer 1:', countDots(map));
    }
  }

  console.log('Answer 2:');
  console.log(map.map(row => row.join('')).join('\n'));

  // ###   ##  #  # ###  #  # #    #  # #     
  // #  # #  # #  # #  # # #  #    # #  #     
  // #  # #    #### #  # ##   #    ##   #     
  // ###  # ## #  # ###  # #  #    # #  #     
  // #    #  # #  # # #  # #  #    # #  #     
  // #     ### #  # #  # #  # #### #  # ####  
}

solve(`
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`);

solve(document.body.textContent);

})();

