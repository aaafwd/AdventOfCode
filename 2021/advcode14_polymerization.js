// https://adventofcode.com/2021/day/14
// --- Day 14: Extended Polymerization ---

(function() {

function parseInput(input) {
  let [template, lines] = input.trim().split('\n\n');
  lines = lines.trim().split('\n').map(row => row.trim().split(' -> '));
  let rules = {};
  for (let [from, to] of lines) {
    console.assert(from.length == 2);
    console.assert(to.length == 1);
    console.assert(!rules[from]);
    rules[from] = to;
  }
  return {template, rules};
}

function mergeFreqs(r1, r2) {
  for (let ch in r2) {
    r1[ch] = (r1[ch] || 0) + r2[ch];
  }
  return r1;
}

function doSolve(template, rules, steps) {
  let cache = {};
  function unfoldAndCount(c1, c2, steps) {
    let middle = rules[c1 + c2];
    if (steps == 0 || !middle) return {};

    let cache_key = c1 + c2 + steps;
    if (cache[cache_key]) return cache[cache_key];

    let result = {};
    result[middle] = 1;
    mergeFreqs(result, unfoldAndCount(c1, middle, steps - 1));
    mergeFreqs(result, unfoldAndCount(middle, c2, steps - 1));
    return cache[cache_key] = result;
  }

  let counts = {};
  counts[template[0]] = 1;
  for (let i = 1; i < template.length; ++i) {
    mergeFreqs(counts, unfoldAndCount(template[i - 1], template[i], steps));
    counts[template[i]] = (counts[template[i]] || 0) + 1;
  }
  let values = Object.values(counts);
  return Math.max(...values) - Math.min(...values);
}

function solve(input) {
  let {template, rules} = parseInput(input);
  let answer1 = doSolve(template, rules, 10);
  let answer2 = doSolve(template, rules, 40);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`);

solve(document.body.textContent);

})();

