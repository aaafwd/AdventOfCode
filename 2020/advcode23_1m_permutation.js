// https://adventofcode.com/2020/day/23
// Runtime: ~300 ms

(function() {

function simulate(inputNumbers, steps, size = inputNumbers.length) {
  let nextNumbers = Array(size);

  function inputNumberAt(pos) {
    return (pos < inputNumbers.length) ? inputNumbers[pos] - 1 : pos;
  }

  // Init.
  for (let i = 0; i < size; ++i) {
    const number = inputNumberAt(i);
    const next = inputNumberAt((i + 1 < size) ? i + 1 : 0);
    nextNumbers[number] = next;
  }

  // Simulate.
  let current = inputNumberAt(0);
  while (steps-- > 0) {
    let a = nextNumbers[current];
    let b = nextNumbers[a];
    let c = nextNumbers[b];

    let target = current - 1;
    while (1) {
      if (target < 0) target += size;
      if (target != a && target != b && target != c) break;
      --target;
    }

    let nextCurrent = nextNumbers[c];
    nextNumbers[current] = nextCurrent;
    current = nextCurrent;

    nextNumbers[c] = nextNumbers[target];
    nextNumbers[target] = a;
  }
  return nextNumbers;
}

function solve1(input, steps) {
  let numbers = input.trim().split('').map(x => +x);
  let nextNumbers = simulate(numbers, steps);

  let answer1 = '';
  for (let number = nextNumbers[0]; number != 0; number = nextNumbers[number]) {
    answer1 += (number + 1);
  }
  console.log("Answer 1:", answer1);
}

function solve2(input) {
  console.time("Runtime");

  let numbers = input.trim().split('').map(x => +x);
  let nextNumbers = simulate(numbers, 10000000, 1000000);

  let a = nextNumbers[0];
  let b = nextNumbers[a];
  let answer2 = (a + 1) * (b + 1);

  console.log("Answer 2:", answer2);
  console.timeEnd("Runtime");
}

solve1('389125467', 10);
solve1('389125467', 100);
solve1('327465189', 100);

solve2('389125467');
solve2('327465189');

})();

