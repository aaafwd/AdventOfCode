// https://adventofcode.com/2017/day/11
// --- Day 11: Hex Ed ---

(function() {

function walk(x, y, dir) {
  switch (dir) {
    case 'n':
      y += 2;
      break;
    case 'ne':
      ++x;
      ++y;
      break;
    case 'se':
      ++x;
      --y;
      break;
    case 's':
      y -= 2;
      break;
    case 'sw':
      --x;
      --y;
      break;
    case 'nw':
      --x;
      ++y;
      break;
    default:
      console.assert(0, dir);
      break;
  }
  return [x, y];
}

function getRadius(x, y) {
  let steps = Math.min(Math.abs(x), Math.abs(y));
  if (x < 0) x += steps;
  else x -= steps;
  if (y < 0) y += steps;
  else y -= steps;
  steps += (Math.abs(x) + Math.abs(y)) / 2;
  return steps;
}

function walkPath(path) {
  let x = 0, y = 0, max_radius = 0;
  for (let dir of path) {
    [x, y] = walk(x, y, dir);
    max_radius = Math.max(max_radius, getRadius(x, y));
  }
  return [x, y, max_radius];
}

function solve(input) {
  let dirs = input.trim().split(',');
  let [x, y, max_radius] = walkPath(dirs);
  console.log("Answer 1:", getRadius(x, y), "Answer 2:", max_radius);
}


solve('ne,ne,ne');
solve('ne,ne,sw,sw');
solve('ne,ne,s,s');
solve('se,sw,se,sw,sw');

solve(document.body.textContent);

})();

