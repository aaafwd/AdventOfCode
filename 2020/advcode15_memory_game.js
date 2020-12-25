// https://adventofcode.com/2020/day/15

(function() {

function solve(numbers, position) {
  console.time("Runtime");
  let lastTimes = Array(position);  
  let i = 0;
  for (; i < numbers.length; ++i) {
    console.assert(lastTimes[numbers[i]] === undefined);
    lastTimes[numbers[i]] = i;
  }
  let last = numbers[i - 1];
  let current = 0;
  for (; i < position - 1; ++i) {
    let next = 0;
    if (lastTimes[current] !== undefined) {
      next = i - lastTimes[current];
    }
    lastTimes[current] = i;
    last = current;
    current = next;
  }
  console.log("Answer: " + position + "th spoken number is", current);
  console.timeEnd("Runtime");
}

solve([0,3,6], 2020);
solve([1,3,2], 2020);
solve([2,1,3], 2020);
solve([1,2,3], 2020);
solve([2,3,1], 2020);
solve([3,2,1], 2020);
solve([3,1,2], 2020);
solve([0,5,4,1,10,14,7], 2020);

solve([0,3,6], 30000000);
solve([1,3,2], 30000000);
solve([2,1,3], 30000000);
solve([1,2,3], 30000000);
solve([2,3,1], 30000000);
solve([3,2,1], 30000000);
solve([3,1,2], 30000000);
solve([0,5,4,1,10,14,7], 30000000);

})();

