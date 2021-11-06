// https://adventofcode.com/2018/day/11
// --- Day 11: Chronal Charge ---
//
// Runtime: 221.5126953125 ms

(function() {
console.time("Runtime");

function powerLevel(x, y, grid_serial) {
  let rack_id = x + 10;
  let power = rack_id * y;
  power += grid_serial;
  power *= rack_id;
  power = Math.floor(power / 100);
  power %= 10;
  power -= 5;
  return power;
}

function solve(grid_serial) {
  let map = Array(301).fill(0).map(row => Array(301).fill(0));
  for (let y = 1; y <= 300; ++y) {
    for (let x = 1; x <= 300; ++x) {
      map[y][x] = powerLevel(x, y, grid_serial);
      map[y][x] += map[y][x - 1] + map[y - 1][x] - map[y - 1][x - 1];
    }
  }

  function findMaxSquare(size) {
    let result;
    let max_power = -Infinity;
    for (let y = size; y <= 300; ++y) {
      for (let x = size; x <= 300; ++x) {
        let power = map[y][x] - map[y][x - size] - map[y - size][x] + map[y - size][x - size];
        if (max_power < power) {
          max_power = power;
          result = [x - size + 1, y - size + 1, size, max_power];
        }
      }
    }
    return result;
  }

  let answer1 = findMaxSquare(3).slice(0, 2);
  let answer2 = Array.from(Array(300).keys())
      .map(i => findMaxSquare(i + 1))
      .sort((s1, s2) => s2[3] - s1[3])[0]
      .slice(0, 3);

  console.log("Answer 1:", answer1 + '', "Answer 2:", answer2 + '');
}

solve(18);
solve(42);

solve(8772);

console.timeEnd("Runtime");
})();

