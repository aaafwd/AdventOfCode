// https://adventofcode.com/2021/day/8
// --- Day 8: Seven Segment Search ---
//
// Runtime: 363.6689453125 ms

(function() {
console.time('Runtime');

//   0:      1:      2:      3:      4:
//  aaaa    ....    aaaa    aaaa    ....
// b    c  .    c  .    c  .    c  b    c
// b    c  .    c  .    c  .    c  b    c
//  ....    ....    dddd    dddd    dddd
// e    f  .    f  e    .  .    f  .    f
// e    f  .    f  e    .  .    f  .    f
//  gggg    ....    gggg    gggg    ....
//
//   5:      6:      7:      8:      9:
//  aaaa    aaaa    aaaa    aaaa    aaaa
// b    .  b    .  .    c  b    c  b    c
// b    .  b    .  .    c  b    c  b    c
//  dddd    dddd    ....    dddd    dddd
// .    f  e    f  .    f  e    f  .    f
// .    f  e    f  .    f  e    f  .    f
//  gggg    gggg    ....    gggg    gggg
//
const kAllSegments = 'abcdefg';
const kDigits = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];

function parseInput(input) {
  return input.trim().split('\n').map(line => {
    let [left, right] = line
      .split('|')
      .map(part => part.trim().split(' ').map(x => x.split('')));
    return {left, right};
  });
}

function solve1(mappings) {
  return [].concat(...mappings.map(m => m.right))
    .filter(x => x.length == 2
              || x.length == 4
              || x.length == 3
              || x.length == 7)
    .length;
}

function generateAllPermutations(pattern, current = [], mask = [], result = []) {
  if (current.length == pattern.length) {
    result.push(current.slice(0));
    return result;
  }
  for (let i = 0; i < pattern.length; ++i) {
    if (mask[i]) continue;
    mask[i] = 1;
    current.push(pattern[i]);
    generateAllPermutations(pattern, current, mask, result);
    current.pop();
    mask[i] = 0;
  }
  return result;
}

function convertToDigit(permutation, variant) {
  let permuted = variant.map(x => permutation[kAllSegments.indexOf(x)]).sort().join('');
  return kDigits.indexOf(permuted);
}

function convertAllToSameDigit(permutations, variant) {
  let digits = permutations.map(perm => convertToDigit(perm, variant));
  console.assert(new Set(digits).size == 1);
  return digits[0];
}

function verifyPermutation(permutation, variants) {
  return variants.every(variant => convertToDigit(permutation, variant) >= 0);
}

function solve2(mappings) {
  let result = 0;
  let all_permutations = generateAllPermutations(kAllSegments);
  for (let {left, right} of mappings) {
    // Optimization: sort the variants by length to check the permutations faster.
    let variants = left.concat(right).sort((x, y) => x.length - y.length);
    let permutations = all_permutations.filter(perm => verifyPermutation(perm, variants));
    console.assert(permutations.length > 0);
    let num = +right.map(x => convertAllToSameDigit(permutations, x)).join('');
    result += num;
  }
  return result;
}

function solve(input) {
  let mappings = parseInput(input);
  let answer1 = solve1(mappings);
  let answer2 = solve2(mappings);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf
`);

solve(`
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`);

// Bonus: handle cases with ambiguous mapping, yet with unique answer.
solve(`
fdgacbe | fdgacbe cgb dgebacf gc
gc | gc gc gc gc
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

