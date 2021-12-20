// https://adventofcode.com/2021/day/7
// --- Day 7: The Treachery of Whales ---

(function() {

function solve1(positions) {
  let result = 0;
  let target = positions[Math.floor(positions.length / 2)];
  for (let pos of positions) {
    result += Math.abs(pos - target);
  }
  return result;
}

function solve2(positions) {
  function calcFuel(target) {
    let result = 0;
    for (let pos of positions) {
      let x = Math.abs(pos - target);
      result += x * (x + 1) / 2;
    }
    return result;
  }

  let left = positions[0];
  let right = positions[positions.length - 1];
  while (left + 1 < right) {
    let x = left + Math.floor((right - left + 1) / 3);
    let y = right - Math.floor((right - left + 1) / 3);
    console.assert(left < x && x < right);
    console.assert(left < y && y < right);
    let cost_x = calcFuel(x);
    let cost_y = calcFuel(y);
    if (cost_x < cost_y) {
      right = y;
    } else {
      left = x;
    }
  }
  let cost_left = calcFuel(left);
  let cost_right = calcFuel(right);
  let answer_fast = Math.min(cost_left, cost_right);

  // Self check (slow: O(N^2)).
  let answer_slow = Math.min(...[...Array(right + 1).keys()].map(x => calcFuel(x)));
  console.assert(answer_slow == answer_fast, answer_slow, answer_fast);

  return answer_fast;
}

function solve(input) {
  let positions = input.trim().split(',').map(Number);
  positions.sort((x, y) => x - y);
  let answer1 = solve1(positions);
  let answer2 = solve2(positions);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`16,1,2,0,4,2,7,1,2,14`);

solve(document.body.textContent);

})();

