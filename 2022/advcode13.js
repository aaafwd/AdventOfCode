// https://adventofcode.com/2022/day/13
// --- Day 13: Distress Signal ---

(function() {

function parseInput(input) {
  // Utilizing the JavaScript's `eval()` to quickly parse the input arrays.
  return input.trim()
    .split('\n\n')
    .map(pairs => pairs.trim()
      .split('\n')
      .map(part => eval(part)));
}

function compare(a, b) {
  if (typeof a == "number" && typeof b == "number") {
    if (a == b) return 0;
    return a < b ? -1 : 1;
  }
  if (typeof a == "number") a = [a];
  if (typeof b == "number") b = [b];
  let index = 0;
  for (; index < a.length && index < b.length; ++index) {
    let result = compare(a[index], b[index]);
    if (result != 0) return result;
  }
  if (index == a.length && index == b.length) return 0;
  return a.length < b.length ? -1 : 1;
}

function solve2(pairs) {
  let packets = pairs.flatMap(x => x);
  packets.push([[2]], [[6]]);
  packets.sort(compare);
  let result = 1;
  for (let i = 0; i < packets.length; ++i) {
    let p = packets[i];
    if (p.length != 1) continue;
    p = p[0];
    if (typeof p == "number" || p.length != 1) continue;
    p = p[0];
    if (typeof p != "number") continue;
    if (p == 2 || p == 6) result *= (i + 1);
  }
  return result;
}

function solve(input) {
  let pairs = parseInput(input);

  let answer1 = pairs
    .map((pair, index) => compare(...pair) < 0 ? index + 1 : 0)
    .reduce((a, b) => a + b);

  let answer2 = solve2(pairs);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`);

solve(document.body.textContent);

})();

