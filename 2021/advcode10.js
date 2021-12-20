// https://adventofcode.com/2021/day/10
// --- Day 10: Syntax Scoring ---

(function() {

const kOpen = '([{<';
const kClose = ')]}>';

function checkSyntax(bracket) {
  let unmatched = [];
  for (let i = 0; i < bracket.length; ++i) {
    let ch = bracket[i];
    let index = kClose.indexOf(ch);
    if (index >= 0) {
      if (unmatched.length == 0 || unmatched.pop() != kOpen[index]) {
        return {bracket, error: i};
      }
    } else {
      unmatched.push(ch);
    }
  }
  unmatched.reverse();
  return {bracket, unmatched};
}

function solve1(brackets) {
  const kScores = [3, 57, 1197, 25137];
  return brackets
    .filter(b => b.error !== undefined)
    .map(({bracket, error}) => kScores[kClose.indexOf(bracket[error])])
    .reduce((x, y) => x + y);
}

function solve2(brackets) {
  let scores = brackets
    .filter(b => b.error === undefined)
    .map(({unmatched}) =>
      parseInt(unmatched.map(ch => kOpen.indexOf(ch) + 1).join(''), 5)
    );
  scores.sort((x, y) => x - y);
  let index = Math.floor(scores.length / 2);
  return scores[index];
}

function solve(input) {
  let brackets = input.trim().split('\n').map(b => checkSyntax(b));
  let answer1 = solve1(brackets);
  let answer2 = solve2(brackets);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]
`);

solve(document.body.textContent);
})();

