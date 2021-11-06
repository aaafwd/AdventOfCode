// https://adventofcode.com/2018/day/2
// --- Day 2: Inventory Management System ---

(function() {

function count23(word) {
  let repeats = word.split('').sort().join('').match(/(\w)\1+/g) || [];
  let count2 = repeats.filter(x => (x.length == 2)).length > 0;
  let count3 = repeats.filter(x => (x.length == 3)).length > 0;
  return [count2, count3];
}

function solve1(input) {
  let words = input.trim().split('\n');
  let count2 = 0, count3 = 0;
  for (let word of words) {
    let [i, j] = count23(word);
    if (i) ++count2;
    if (j) ++count3;
  }
  console.log("Answer 1:", count2 * count3);
}

function singleLetterDiffIndex(w1, w2) {
  let index = -1;
  for (let i = 0; w1[i] && w2[i]; ++i) {
    if (w1[i] != w2[i]) {
      if (index != -1) return -1;
      index = i;
    }
  }
  return index;
}

function solve2(input) {
  let words = input.trim().split('\n');
  for (let i = 0; i < words.length; ++i) {
    for (let j = i + 1; j < words.length; ++j) {
      let index = singleLetterDiffIndex(words[i], words[j]);
      if (index == -1) continue;
      console.log("Answer 2:", words[i].substr(0, index) + words[i].substr(index + 1));
    }    
  }
}

solve1(`
abcdef
bababc
abbcde
abcccd
aabcdd
abcdee
ababab
`)

solve1(document.body.textContent);

solve2(`
abcde
fghij
klmno
pqrst
fguij
axcye
wvxyz
`)

solve2(document.body.textContent);

})();

