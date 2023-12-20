// https://adventofcode.com/2023/day/7
// --- Day 7: Camel Cards ---

(function() {

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(line => line.trim().split(/\s+/))
    .map(([card, bid]) => [card.split(''), +bid]);
}

function classify(card, withJokers) {
  let map = {};
  card.forEach(ch => {
    map[ch] = map[ch] || 0;
    map[ch]++;
  });
  let result = getRank();
  if (withJokers && map['J']) {
    let jokerCount = map['J'];
    delete map['J'];
    'AKQT98765432'.split('').forEach(ch => {
      map[ch] = map[ch] || 0;
      map[ch] += jokerCount;
      result = Math.min(result, getRank());
      map[ch] -= jokerCount;
      if (map[ch] == 0) delete map[ch];
    });
  }
  return result;

  function getRank() {
    let highest = Math.max(...Object.values(map));
    let keys = Object.keys(map).length;
    if (keys == 1) return 1; // Five of a kind
    if (keys == 2) {
      if (highest == 4) return 2; // Four of a kind
      console.assert(highest == 3);
      return 3; // Full house
    }
    if (keys == 3) {
      if (highest == 3) return 4; // Three of a kind
      return 5; // Two pair
    }
    if (keys == 4) {
      return 6; // One pair
    }
    return 7; // High card
  }
}

function compareLabels(a, b, withJokers) {
  let labels = withJokers ? 'AKQT98765432J' : 'AKQJT98765432';
  let i1 = labels.indexOf(a);
  console.assert(i1 >= 0);
  let i2 = labels.indexOf(b);
  console.assert(i2 >= 0);
  return i1 - i2;
}

function compareCards(a, b, withJokers) {
  let c1 = classify(a, withJokers);
  let c2 = classify(b, withJokers);
  if (c1 != c2) return c1 - c2;
  for (let i = 0; i < 5; ++i) {
    let result = compareLabels(a[i], b[i], withJokers);
    if (result != 0) return result;
  }
  console.assert(false);
}

function solve(input) {
  let cards = parseInput(input);

  let answer1 = cards
    .sort(([a,], [b,]) => compareCards(a, b, false))
    .map(([, bid], index) => (cards.length - index) * bid)
    .reduce((a, b) => a + b);

  let answer2 = cards
    .sort(([a,], [b,]) => compareCards(a, b, true))
    .map(([, bid], index) => (cards.length - index) * bid)
    .reduce((a, b) => a + b);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`);

solve(document.body.textContent);

})();

