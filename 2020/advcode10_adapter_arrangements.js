// https://adventofcode.com/2020/day/10

(function() {

function countAllArrangements(numbers, index = 0, answers = []) {
  let result = answers[index];
  if (result) return result;
  if (index == numbers.length - 1) return 1;

  result = 0;
  for (let i = index + 1; i < numbers.length; ++i) {
    if (numbers[i] - numbers[index] > 3) break;
    result += countAllArrangements(numbers, i, answers);
  }
  return answers[index] = result;
}

function solve(input) {
  let numbers = input.trim().split('\n').map(x => +x);
  numbers.push(0);
  numbers.sort((a, b) => a - b);
  numbers.push(numbers[numbers.length - 1] + 3);

  let diff1 = 0, diff3 = 0;
  for (let i = 1; i < numbers.length; ++i) {
    let diff = numbers[i] - numbers[i - 1];
    console.assert(1 <= diff && diff <= 3);
    if (diff == 1) ++diff1;
    if (diff == 3) ++diff3;
  }
  console.log("Answer 1:", diff1 * diff3);

  console.log("Answer 2:", countAllArrangements(numbers));
}

solve(`
16
10
15
5
1
11
7
19
6
12
4
`);

solve(`
28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3
`);

solve(document.body.textContent);

})();

