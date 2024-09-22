// https://adventofcode.com/2022/day/11
// --- Day 11: Monkey in the Middle ---

(function() {

function parseInput(input) {
  let lines = input.trim()
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  let monkeys = [];
  let monkey;
  let match;
  for (let line of lines) {
    if ((match = line.match(/^Monkey (\d+):$/))) {
      let i = +match[1];
      console.assert(i == monkeys.length);
      monkey = {
        items: [],
        operation: [], // a*x^2 + b*x + c
        divisible: undefined,
        to: [],
      };
      monkeys.push(monkey);
    } else if ((match = line.match(/^Starting items: (.+)$/))) {
      monkey.items = match[1].trim().split(',').map(str => +str.trim());
    } else if ((match = line.match(/^Operation: new = old \* old$/))) {
      monkey.operation = [1, 0, 0];
    } else if ((match = line.match(/^Operation: new = old \+ (\d+)$/))) {
      monkey.operation = [0, 1, +match[1]];
    } else if ((match = line.match(/^Operation: new = old \* (\d+)$/))) {
      monkey.operation = [0, +match[1], 0];
    } else if ((match = line.match(/^Test: divisible by (\d+)$/))) {
      monkey.divisible = +match[1];
    } else if ((match = line.match(/^If true: throw to monkey (\d+)$/))) {
      monkey.to[1] = +match[1];
    } else if ((match = line.match(/^If false: throw to monkey (\d+)$/))) {
      monkey.to[0] = +match[1];
    } else {
      console.assert(false, line);
    }
  }
  return monkeys;
}

function gcd(a, b) {
  while (a && b) [a, b] = [b, a % b];
  return a + b;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function simulate(monkeys, rounds) {
  let items = monkeys.map(monkey => monkey.items.slice());
  let inspected = Array(monkeys.length).fill(0);
  let modulo = monkeys
    .map(monkey => monkey.divisible)
    .reduce(lcm, 1);
  for (let r = 0; r < rounds; ++r) {
    for (let m = 0; m < monkeys.length; ++m) {
      let monkey = monkeys[m];
      let [a, b, c] = monkey.operation;
      inspected[m] += items[m].length;
      for (let item of items[m]) {
        let worry = a * item * item + b * item + c;
        if (rounds == 20) worry = Math.floor(worry / 3);
        else worry %= modulo;
        let isDivisible = ((worry % monkey.divisible) == 0);
        let to = monkey.to[isDivisible ? 1 : 0];
        console.assert(0 <= to && to < monkeys.length && to != m);
        items[to].push(worry);
      }
      items[m].length = 0;
    }
  }
  inspected.sort((a, b) => b - a);
  return inspected[0] * inspected[1];
}

function solve(input) {
  let monkeys = parseInput(input);
  let answer1 = simulate(monkeys, 20);
  let answer2 = simulate(monkeys, 10000);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`);

solve(document.body.textContent);

})();

