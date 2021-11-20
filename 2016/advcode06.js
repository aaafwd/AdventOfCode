// https://adventofcode.com/2016/day/6
// --- Day 6: Signals and Noise ---

(function() {

function countFrequency(words) {
  let freq = [];
  for (let word of words) {
    word.split('').forEach((ch, index) => {
      freq[index] = freq[index] || {};
      freq[index][ch] = (freq[index][ch] || 0) + 1;
    });
  }
  return freq;
}

function chooseMinMax(frequencies, is_min) {
  let result = [];
  let sort_mod = is_min ? 1 : -1;
  for (let freq of frequencies) {
    let keys = Object.keys(freq).sort((c1, c2) => sort_mod * (freq[c1] - freq[c2]));
    result.push(keys[0]);
  }
  return result.join('');
}

function solve(input) {
  let words = input.trim().split('\n');
  let freq = countFrequency(words);

  let answer1 = chooseMinMax(freq, false);
  let answer2 = chooseMinMax(freq, true);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar
`);

solve(document.body.textContent);

})();

