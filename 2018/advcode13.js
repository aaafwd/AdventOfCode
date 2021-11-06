// https://adventofcode.com/2018/day/13
// --- Day 13: Mine Cart Madness ---
//
// Runtime: 45.743896484375 ms

(function() {
console.time("Runtime");

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const kDirChars = ['^', '>', 'v', '<'];

function parseInput(input) {
  let map = input.split('\n').map(row => row.split(''));
  if (map[0].length == 0) map.shift();

  let autos = [];
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      let dir = kDirChars.indexOf(map[y][x]);
      if (dir >= 0) {
        autos.push({x, y, dir, turns: 0});
      }
    }
  }
  return {map, autos};
}

function cacheKey(x, y) {
  return 31337 * y + x;
}

function remove(array, item) {
  let index = array.indexOf(item);
  if (index >= 0) array.splice(index, 1);
  return index;
}

function advanceTick(map, autos) {
  let first_collision = undefined;

  let positions = {};
  for (let auto of autos) {
    let key = cacheKey(auto.x, auto.y);
    console.assert(!positions[key]);
    positions[key] = auto;
  }

  for (let i = 0; i < autos.length; ++i) {
    let {x, y, dir, turns} = autos[i];
    let [dx, dy] = kDirs[dir];

    let oldKey = cacheKey(x, y);
    delete positions[oldKey];

    x += dx;
    y += dy;
    if (map[y][x] == '\\') {
      // 0 -> 3, 1 -> 2, 2 -> 1, 3 -> 0
      dir ^= 3;
    } else if (map[y][x] == '/') {
      // 0 -> 1, 1 -> 0, 2 -> 3, 3 -> 2
      dir ^= 1;
    } else if (map[y][x] == '+') {
      // turns left, goes straight, turns right
      let diff = (turns % 3) - 1;
      dir = (dir + 4 + diff) & 3;
      ++turns;
    }
    autos[i].x = x;
    autos[i].y = y;
    autos[i].dir = dir;
    autos[i].turns = turns;

    let newKey = cacheKey(x, y);
    if (positions[newKey]) {
      if (!first_collision) first_collision = [x, y];
      autos.splice(i--, 1);
      let removedIndex = remove(autos, positions[newKey]);
      if (removedIndex <= i) --i;
      delete positions[newKey];
    } else {
      positions[newKey] = autos[i];
    }
  }
  autos.sort((a1, a2) => a1.y == a2.y ? a1.x - a2.x : a1.y - a2.y);
  return first_collision;
}

function solve(input) {
  let {map, autos} = parseInput(input);

  let answer1;
  while (!(answer1 = advanceTick(map, autos)));
  console.log("Answer 1:", answer1 + '');

  while (autos.length > 1) advanceTick(map, autos);
  if (autos.length == 1) {
    let answer2 = [autos[0].x, autos[0].y];
    console.log("Answer 2:", answer2 + '');
  }
}

solve(`
/->-\\        
|   |  /----\\
| /-+--+-\\  |
| | |  | v  |
\\-+-/  \\-+--/
  \\------/   
`);

solve(`
/>-<\\  
|   |  
| /<+-\\
| | | v
\\>+</ |
  |   ^
  \\<->/
`);

solve(document.body.textContent);

console.timeEnd("Runtime");
})();

