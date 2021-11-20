// https://adventofcode.com/2016/day/9
// --- Day 9: Explosives in Cyberspace ---

(function() {

function decompress(str, is_recursive) {
  let count = 0;
  for (let i = 0; i < str.length; ++i) {
    if (str[i] == '(') {
      let j = str.indexOf(')', i + 1);
      console.assert(j > i);
      let [len, repeat] = str.substring(i + 1, j).split('x').map(x => +x);
      let decompressed_len = len;
      if (is_recursive) {
        decompressed_len = decompress(str.substring(j + 1, j + 1 + len), true);
      }
      count += repeat * decompressed_len;
      i = j + len;
    } else {
      count++;
    }
  }
  return count;
}

function solve(input) {
  input = input.replace(/\s+/g, '');
  let answer1 = decompress(input, false);
  let answer2 = decompress(input, true);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve('ADVENT');
solve('A(1x5)BC');
solve('(3x3)XYZ');
solve('A(2x2)BCD(2x2)EFG');
solve('(6x1)(1x3)A');
solve('X(8x2)(3x3)ABCY');
solve('(27x12)(20x12)(13x14)(7x10)(1x12)A');
solve('(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN');

solve(document.body.textContent);

})();

