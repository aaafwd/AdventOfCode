// https://adventofcode.com/2018/day/14
// --- Day 14: Chocolate Charts ---
//
// Runtime: 391.4921875 ms

(function() {
console.time("Runtime");

class Digits {
  constructor(capacity = 1024) {
    this.size_ = 0;
    this.digits_ = Array(capacity >> 3).fill(0);
  }

  push(x) {
    let index = (this.size_ >> 3);
    let offset = (this.size_ & 7);
    if (offset == 0) {
      this.digits_[index] = x;
    } else {
      this.digits_[index] |= x << (offset * 4);
    }
    ++this.size_;
  }

  get(index) {
    if (index >= this.size_) return 0;
    let offset = (index & 7);
    return (this.digits_[index >> 3] >> (offset * 4)) & 15;
  }

  size() {
    return this.size_;
  }
}

function solve1(recipes) {
  let digits = new Digits(recipes + 11);
  digits.push(3);
  digits.push(7);
  let i = 0;
  let j = 1;
  while (digits.size() < recipes + 10) {
    let d1 = digits.get(i);
    let d2 = digits.get(j);
    let k = d1 + d2;
    if (k >= 10) {
      digits.push(1);
      k -= 10;
    }
    digits.push(k);
    i = (i + d1 + 1) % digits.size();
    j = (j + d2 + 1) % digits.size();
  }

  let answer1 = [];
  for (let i = 0; i < 10; ++i) {
    answer1.push(digits.get(recipes + i));
  }
  answer1 = answer1.join('');

  console.log("Answer 1 (after %d recipes, the scores of the next 10):", recipes, answer1);
}

function solve2(pattern_str) {
  let pattern = pattern_str.split('').map(x => (+x).toString(2).padStart(4, '0'));
  console.assert(pattern.length <= 8);
  let pattern_mask = (pattern.length == 8) ? 0xffffffff : (1 << (pattern.length * 4)) - 1;
  let pattern_value = parseInt(pattern.join(''), 2);

  let digits = new Digits();
  digits.push(3);
  digits.push(7);
  let i = 0;
  let j = 1;
  let current_value = (3 << 4) | 7;
  while (1) {
    let d1 = digits.get(i);
    let d2 = digits.get(j);
    let k = d1 + d2;
    if (k >= 10) {
      digits.push(1);
      k -= 10;
      current_value = ((current_value << 4) | 1) & pattern_mask;
      if (current_value == pattern_value) break;
    }
    digits.push(k);
    current_value = ((current_value << 4) | k) & pattern_mask;
    if (current_value == pattern_value) break;

    i = (i + d1 + 1) % digits.size();
    j = (j + d2 + 1) % digits.size();
  }

  let answer2 = digits.size() - pattern.length;
  console.log("Answer 2 (%s first appears after recipes):", pattern_str, answer2);
}

solve1(9);
solve1(5);
solve1(18);
solve1(2018);
solve1(165061);

solve2('51589');
solve2('01245');
solve2('92510');
solve2('59414');
solve2('165061');

console.timeEnd("Runtime");
})();

