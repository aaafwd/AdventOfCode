// https://adventofcode.com/2022/day/25
// --- Day 25: Full of Hot Air ---

(function() {

const kSnafuChars = "=-012".split('');

function parseInput(input) {
  return input.trim().split('\n');
}

function fromSnafu(snafu) {
  let result = 0;
  for (let ch of snafu) {
    let value = kSnafuChars.indexOf(ch) - 2;
    result *= 5;
    result += value;
  }
  return result;
}

function toSnafu(num) {
  let result = [];
  while (num) {
    let x = num % 5;
    if (x > 2) x -= 5;
    result.push(kSnafuChars[x + 2]);
    num -= x;
    num /= 5;
  }
  return result.reverse().join('');
}

function solve(input) {
  let snafus = parseInput(input);
  let sum = snafus.map(fromSnafu).reduce((a, b) => a + b);
  console.log('Answer:', toSnafu(sum));
}

solve(`
1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`);

solve(document.body.textContent);

})();

