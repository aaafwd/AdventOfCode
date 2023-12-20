// https://adventofcode.com/2023/day/12
// --- Day 12: Hot Springs ---
// Runtime: 87 ms

(function() {
console.time('Runtime');

function parseInput(input, unfold) {
  return input.trim()
    .split('\n')
    .map(line => line.trim().split(/\s+/))
    .map(([pattern, groups]) => {
      if (unfold) {
        pattern = [pattern, pattern, pattern, pattern, pattern].join('?');
        groups = [groups, groups, groups, groups, groups].join(',');
      }
      return [pattern, groups];
    })
    .map(([pattern, groups]) => [pattern.split(''), groups.split(',').map(x => +x)]);
}

function countArrangements([pattern, groups]) {
  const cache = {};
  const lastFixed = pattern.lastIndexOf('#');

  // `pi` - running index in `pattern`
  // `gi` - running index in `groups`
  function countImpl(pi, gi) {
    if (gi == groups.length) {
      return (pi > lastFixed) ? 1 : 0;
    }

    while (pi < pattern.length && pattern[pi] == '.') ++pi;
    if (pi >= pattern.length) return 0;

    // Assuming all lengths are less than 65536.
    let key = (pi << 16) | gi;
    // let key = pi + "," + gi; // Works 2x slower.
    if (key in cache) return cache[key];

    let group = groups[gi];
    let end = pi;
    while (end < pattern.length && pattern[end] != '.') ++end;
    let maxAvailable = end - pi;

    let result = 0;
    while (pi < pattern.length && pattern[pi] != '.' && group <= maxAvailable) {
      // Assume '?' => '#'.
      if (pattern[pi + group] != '#') {
        result += countImpl(pi + group + 1, gi + 1);
      }
      if (pattern[pi] == '#') break;
      ++pi;
      --maxAvailable;
    }

    // Check if the rest pattern is of the form '??..?' and can be skipped.
    while (pi < pattern.length && pattern[pi] == '?') ++pi;
    if (pi < pattern.length && pattern[pi] == '.') {
      result += countImpl(pi + 1, gi);
    }

    cache[key] = result;
    return result;
  }
  return countImpl(0, 0);
}
  
function solve(input) {
  let configs = parseInput(input, false);

  let answer1 = configs
    .map(config => countArrangements(config))
    .reduce((a, b) => a + b, 0);

  configs = parseInput(input, true);
  let answer2 = configs
    .map(config => countArrangements(config))
    .reduce((a, b) => a + b, 0);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

