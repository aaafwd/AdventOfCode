// https://adventofcode.com/2022/day/3
// --- Day 3: Rucksack Reorganization ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim()
      .split('')
      .map(ch => {
        if ('a' <= ch && ch <= 'z') {
          return ch.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
        }
        console.assert('A' <= ch && ch <= 'Z');
        return ch.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
      }));
}

function intersect(/* ...arrays */) {
  let sets = [...arguments].map(array => new Set(array));
  return [...sets[0]].filter(x => sets.every(set => set.has(x)));
}

function getOnlyElement(arrayLike) {
  console.assert(arrayLike.length == 1, String(arrayLike));
  return arrayLike[0];
}

function solve(input) {
  let rucksacks = parseInput(input);

  let answer1 = rucksacks
    .map(array => {
      let len = array.length;
      console.assert((len % 2) == 0, len);
      return intersect(array.slice(0, len / 2), array.slice(len / 2, len));
    })
    .map(getOnlyElement)
    .reduce((a, b) => a + b);

  let answer2 = 0;
  console.assert((rucksacks.length % 3) == 0);
  for (let i = 0; i < rucksacks.length; i += 3) {
    let common = intersect(rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]);
    answer2 += getOnlyElement(common);
  }

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`);

solve(document.body.textContent);

})();

