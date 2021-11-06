// https://adventofcode.com/2018/day/6
// --- Day 6: Chronal Coordinates ---
//
// Runtime: 124.76611328125 ms

(function() {
console.time("Runtime");

function parseInput(input) {
  let coords = input.trim().split('\n').map(row => row.split(',').map(x => +x));

  let all_xs = coords.map(pair => pair[0]).sort((x, y) => x - y);
  let min_x = all_xs[0];
  let max_x = all_xs[all_xs.length - 1];

  let all_ys = coords.map(pair => pair[1]).sort((x, y) => x - y);;
  let min_y = all_ys[0];
  let max_y = all_ys[all_ys.length - 1];

  return {coords, min_x, max_x, min_y, max_y, all_xs, all_ys};
}

function getDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function walk(map, value, x, y) {
  if (map[y] === undefined || map[y][x] === undefined || map[y][x] != value) return 0;
  map[y][x] = -1;
  return 1
    + walk(map, value, x, y + 1)
    + walk(map, value, x, y - 1)
    + walk(map, value, x + 1, y)
    + walk(map, value, x - 1, y);
}

function solve1(input) {
  let {coords, min_x, max_x, min_y, max_y} = parseInput(input);
  let map = [];
  let on_border = Array(coords.length).fill(0);
  for (let y = min_y; y <= max_y; ++y) {
    for (let x = min_x; x <= max_x; ++x) {
      let closest = -1;
      let closest_dist = Infinity;
      for (let i = 0; i < coords.length; ++i) {
        let dist = getDistance(x, y, ...coords[i]);
        if (dist < closest_dist) {
          closest_dist = dist;
          closest = i;
        } else if (dist == closest_dist) {
          closest = -1;
        }
      }
      let i = y - min_y;
      let j = x - min_x;
      map[i] = map[i] || [];
      map[i][j] = closest;

      if (x == min_x || x == max_x || y == min_y || y == max_y) {
        if (closest >= 0) on_border[closest] = 1;
      }
    }
  }

  // Filter out "on border" sources (that are with infinite area).
  map = map.map(row => row.map(x => (x == -1 || on_border[x] ? -1 : x)));

  let max_area = -1;
  for (let y = 0; map[y]; ++y) {
    for (let x = 0; map[y][x] !== undefined; ++x) {
      if (map[y][x] != -1) {
        let area = walk(map, map[y][x], x, y);
        if (max_area < area) max_area = area;
      }
    }
  }

  return max_area;
}

function solve2(input, max_distance) {
  let {all_xs, all_ys} = parseInput(input);

  // Find a point with minimum total distance.
  let index_x = Math.floor(all_xs.length / 2);
  let index_y = Math.floor(all_ys.length / 2);
  let mid_x = all_xs[index_x];
  let mid_y = all_ys[index_y];

  let mid_dist = 0;
  mid_dist += all_xs.map(z => Math.abs(z - mid_x)).reduce((x, y) => x + y);
  mid_dist += all_ys.map(z => Math.abs(z - mid_y)).reduce((x, y) => x + y);

  // Fix the OY coordinate and expand the line along the OX axe.
  let distances = [];
  for (let x = mid_x, dist = mid_dist, index = index_x; dist < max_distance;) {
    distances.push(dist);
    while (x === all_xs[index + 1]) ++index;
    ++x;
    dist += (index + 1) * 2 - all_xs.length;
  }
  for (let x = mid_x, dist = mid_dist, index = index_x; dist < max_distance;) {
    distances.push(dist);
    while (x === all_xs[index]) --index;
    --x;
    dist -= (index + 1) * 2 - all_xs.length;
  }
  distances.shift();

  let area = distances.length;

  // Move the `distances` line as a "wave" upwards and downwards along the OY axe.
  for (let y = mid_y, index = index_y, queue = distances; queue.length > 0;) {
    while (y === all_ys[index + 1]) ++index;
    ++y;
    let diff = (index + 1) * 2 - all_ys.length;
    console.assert(diff >= 0);
    queue = queue.map(x => x + diff).filter(x => x < max_distance);
    area += queue.length;
  }
  for (let y = mid_y, index = index_y, queue = distances; queue.length > 0;) {
    while (y === all_ys[index]) --index;
    --y;
    let diff = -(index + 1) * 2 + all_ys.length;
    console.assert(diff >= 0);
    queue = queue.map(x => x + diff).filter(x => x < max_distance);
    area += queue.length;
  }

  return area;
}

function solve(input, max_distance) {
  console.log(
    "Answer 1:", solve1(input),
    "Answer 2:", solve2(input, max_distance));
}

solve(`
1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
`, 32);

solve(document.body.textContent, 10000);

console.timeEnd("Runtime");
})();

