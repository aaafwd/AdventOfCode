// https://adventofcode.com/2020/day/22

(function() {

function play1(cards1, cards2) {
  while (cards1.length && cards2.length) {
    const a = cards1.shift();
    const b = cards2.shift();
    if (a > b) cards1.push(a, b);
    else cards2.push(b, a);
  }
  return cards1.length ? 0 : 1;
}

function play2(cards1, cards2, subgame = false) {
  // Check if there is any chance for Player 2 to win a subgame, even
  // assuming no round will be repeated (in which case Player 1 wins).
  if (subgame && Math.max(...cards1) > Math.max(...cards2)) {
    return 0;
  }

  let cache = new Set();
  while (cards1.length && cards2.length) {
    const key = cards1 + "|" + cards2;
    if (cache.has(key)) return 0;
    cache.add(key);

    const a = cards1.shift();
    const b = cards2.shift();

    let winner = (a > b) ? 0 : 1;
    if (cards1.length >= a && cards2.length >= b) {
      winner = play2(cards1.slice(0, a), cards2.slice(0, b), true);
    }
    if (winner == 0) {
      cards1.push(a, b);
    } else {
      cards2.push(b, a);
    }
  }
  return cards1.length ? 0 : 1;
}

function getScore(cards) {
  let score = 0;
  for (let i = 0; i < cards.length; ++i) {
    score += (cards.length - i) * cards[i];
  }
  return score;
}

function solve(input) {
  const [cards1, cards2] =
      input.trim().split('\n\n').map(text => text.split('\n').slice(1).map(x => +x));

  let game = [[...cards1], [...cards2]];
  console.log("Answer 1:", getScore(game[play1(...game)]));

  game = [[...cards1], [...cards2]];
  console.log("Answer 2:", getScore(game[play2(...game)]));
}

solve(`
Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10
`);

solve(document.body.textContent);

})();

