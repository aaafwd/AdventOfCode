// https://adventofcode.com/2017/day/9
// --- Day 9: Stream Processing ---

(function() {

function getScore(chars, index = 0, depth = 0) {
  let score = 0, garbage_count = 0;
  while (index < chars.length) {
    if (chars[index] == '{') {
      let [inner_score, inner_gc, last_index] = getScore(chars, index + 1, depth + 1);
      score += inner_score + depth + 1;
      garbage_count += inner_gc;
      index = last_index;
      console.assert(chars[index] == '}');
      ++index;
    } else if (chars[index] == ',') {
      ++index;
    } else if (chars[index] == '}') {
      return [score, garbage_count, index];
    } else if (chars[index] == '<') {
      for (++index; chars[index] != '>' && index < chars.length; ++index) {
        if (chars[index] == '!') ++index;
        else ++garbage_count;
      }
      console.assert(index < chars.length);
      console.assert(chars[index] == '>');
      ++index;
    } else {
      console.assert(0, "Unknown character:", chars[index]);
    }
  }
  return [score, garbage_count, index];
}

function solve(input) {
  let chars = input.trim().split('');
  let [answer1, answer2] = getScore(chars);
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`{}`);
solve(`{{{<random characters>}}}`);
solve(`{{},{}}`);
solve(`{{{},{},{{}}}}`);
solve(`{<a>,<a>,<a>,<a>}`);
solve(`{{<ab>},{<ab>},{<ab>},{<ab>}}`);
solve(`{{<!!>},{<!!>},{<!!>},{<!!>}}`);
solve(`{{<a!>},{<a!>},{<a!>},{<ab>}}`);

solve(document.body.textContent);

})();

