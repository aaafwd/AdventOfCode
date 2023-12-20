// https://adventofcode.com/2023/day/1
// --- Day 1: Trebuchet?! ---

(function() {

const kDigitsMap = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9
};
  
function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines;
}

function findFirst(str, haystacks) {
  let minIndex = Infinity;
  let result = '';
  for (let h of haystacks) {
    let index = str.indexOf(h);
    if (index == -1 || minIndex < index) continue;
    minIndex = index;
    result = h;
  }
  return result;
}

function findLast(str, haystacks) {
  let maxIndex = -1;
  let result = '';
  for (let h of haystacks) {
    let index = str.lastIndexOf(h);
    if (index == -1 || maxIndex > index) continue;
    maxIndex = index;
    result = h;
  }
  return result;
}

function replaceDigitString(str) {
  return kDigitsMap[str] || +str;
}

function solve(input) {
  let lines = parseInput(input);
  let answer1 = 0;
  let answer2 = 0;
  let haystacks1 = Object.values(kDigitsMap);
  let haystacks2 = [].concat(Object.keys(kDigitsMap), Object.values(kDigitsMap)); 

  for (let line of lines) {
    let digit1 = +findFirst(line, haystacks1);
    let digit2 = +findLast(line, haystacks1);
    let num = digit1 * 10 + digit2;
    answer1 += num;

    digit1 = replaceDigitString(findFirst(line, haystacks2));
    digit2 = replaceDigitString(findLast(line, haystacks2));
    num = digit1 * 10 + digit2;
    answer2 += num;
  }
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`);

solve(`
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`);

solve(document.body.textContent);

})();

