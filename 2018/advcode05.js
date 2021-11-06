// https://adventofcode.com/2018/day/5
// --- Day 5: Alchemical Reduction ---

(function() {

function reacts(c1, c2) {
  if (c1 > c2) [c1, c2] = [c2, c1];
  // Must be: c1 - capital case letter, c2 - lower case letter.
  return c1 != c2 && c1.toLowerCase() == c2;
}

function run(letters) {
  let end = 0;
  for (let i = 0; i < letters.length; ++i) {
    if (end == 0 || !reacts(letters[end - 1], letters[i])) {
      letters[end++] = letters[i];
    } else {
      --end;
    }
  }
  return end;
}

function solve(input) {
  let letters = input.trim().split('');
  console.log("Answer 1:", run(letters.slice(0)));

  let answer2 = Math.min(...
      'abcdefghijklmnopqrstuvwxyz'.split('')
      .map(alpha => run(letters.filter(ch => ch.toLowerCase() != alpha))));
  console.log("Answer 2:", answer2);
}

solve('dabAcCaCBAcCcaDA');

solve(document.body.textContent);

})();

