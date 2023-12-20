// https://adventofcode.com/2023/day/4
// --- Day 4: Scratchcards ---

(function() {

function parseInput(input) {
  return input.trim().split('\n')
    .map(row => row.split(":")[1])
    .map(row => row.trim().split("|")
      .map(nums => nums.trim().split(/\s+/).map(num => +num))
      .map(nums => new Set(nums)));
}

function intersect(s1, s2) {
  return new Set([...s1].filter(x => s2.has(x)));
}

function solve(input) {
  let cards = parseInput(input);

  let answer1 = cards
    .map(([wins, guesses]) => intersect(wins, guesses).size)
    .filter(size => size > 0)
    .map(size => (1 << (size - 1)))
    .reduce((a, b) => a + b, 0);
  
  let copies = Array(cards.length).fill(1);
  for (let i = 0; i < cards.length; ++i) {
    let matches = intersect(...cards[i]).size;
    for (let j = 0; j < matches && i + j + 1 < cards.length; ++j) {
      copies[i + j + 1] += copies[i];
    }
  }
  let answer2 = copies.reduce((a, b) => a + b, 0);
    
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`);

solve(document.body.textContent);

})();

