// https://adventofcode.com/2023/day/9
// --- Day 9: Mirage Maintenance ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim()
      .split(/\s+/)
      .map(x => +x));
}

function makeDifferences(seq) {
  let diffs = [];
  for (let i = 1; i < seq.length; ++i) {
    diffs.push(seq[i] - seq[i - 1]);
  }
  return diffs;
}

function predictLast(seq) {
  if (seq.every(num => num == 0)) return 0;
  return seq[seq.length - 1] + predictLast(makeDifferences(seq));
}

function predictFirst(seq) {
  if (seq.every(num => num == 0)) return 0;
  return seq[0] - predictFirst(makeDifferences(seq));
}

function solve(input) {
  let seqs = parseInput(input);

  let answer1 = seqs
    .map(seq => predictLast(seq))
    .reduce((a, b) => a + b, 0);

  let answer2 = seqs
    .map(seq => predictFirst(seq))
    .reduce((a, b) => a + b, 0);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`);

solve(document.body.textContent);

})();

