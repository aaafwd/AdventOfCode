// https://adventofcode.com/2021/day/6
// --- Day 6: Lanternfish ---

(function() {

let cache = {};

function simulate(age, days) {
  let key = age + ',' + days;
  if (cache[key]) return cache[key];

  let result = 1;
  while (1) {
    days -= age + 1;
    if (days < 0) break;
    result += simulate(8, days);
    age = 6;
  }
  return cache[key] = result;
}

function simulateAll(ages, days) {
  return ages.map(age => simulate(age, days)).reduce((x, y) => x + y);
}

function solve(input) {
  let ages = input.trim().split(',').map(Number);
  let answer1 = simulateAll(ages, 80);
  let answer2 = simulateAll(ages, 256);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`3,4,3,1,2`);

solve(document.body.textContent);

})();

