// https://adventofcode.com/2022/day/6
// --- Day 6: Tuning Trouble ---

(function() {

function parseInput(input) {
  return input.trim().split('');
}

function findStart(buffer, len) {
  let map = new Map();
  for (let i = 0; i < buffer.length; ++i) {
    let ch = buffer[i];
    map.set(ch, (map.get(ch) || 0) + 1);
    if (i < len - 1) continue;
    if (map.size == len) return i + 1;
    ch = buffer[i - len + 1];
    let count = map.get(ch);
    if (count == 1) map.delete(ch);
    else map.set(ch, count - 1);
  }
}

function solve(input) {
  let buffer = parseInput(input);

  let answer1 = findStart(buffer, 4);

  let answer2 = findStart(buffer, 14);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`mjqjpqmgbljsphdztnvjfqwrcgsmlb`);
solve(`bvwbjplbgvbhsrlpgdmjqwftvncz`);
solve(`nppdvjthqldpwncqszvftbrmjlhg`);
solve(`nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`);
solve(`zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`);

solve(document.body.textContent);

})();

