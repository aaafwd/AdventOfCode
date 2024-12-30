// https://adventofcode.com/2024/day/5
// --- Day 5: Print Queue ---

(function() {
console.time('Runtime');

function parseInput(input) {
  let [before, reports] = input.trim().split('\n\n');
  before = new Set(before.trim().split('\n').map(row => row.trim()));
  reports = reports.trim().split('\n').map(row => row.trim().split(',').map(x => +x));
  return [before, reports];
}

function isInOrder(report, before) {
  for (let i = 0; i < report.length; ++i) {
    for (let j = i + 1; j < report.length; ++j) {
      let key = [report[j], report[i]].join("|");
      if (before.has(key)) return false;
    }
  }
  return true;
}

function makeInOrder(report, before) {
  return report.slice().sort((a, b) => {
    if (before.has([a, b].join("|"))) return -1;
    if (before.has([b, a].join("|"))) return 1;
    return 0;
  });
}

function solve(input) {
  let [before, reports] = parseInput(input);

  let answer1 = reports
    .filter(r => isInOrder(r, before))
    .map(r => r[(r.length - 1)/2])
    .reduce((a, b) => a + b, 0);

  let answer2 = reports
    .filter(r => !isInOrder(r, before))
    .map(r => makeInOrder(r, before))
    .map(r => r[(r.length - 1)/2])
    .reduce((a, b) => a + b, 0);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

