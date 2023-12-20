// https://adventofcode.com/2023/day/2
// --- Day 2: Cube Conundrum ---

(function() {

function parseSet(input) {
  let r = input.replace(/^.*\b(\d+)\s*red.*$/, '$1');
  let g = input.replace(/^.*\b(\d+)\s*green.*$/, '$1');
  let b = input.replace(/^.*\b(\d+)\s*blue.*$/, '$1');
  return [+r || 0, +g || 0, +b || 0];
}

function parseInput(input) {
  return input
    .trim()
    .split('\n')
    .map(line => ({
      game: +line.replace(/^\s*Game\s*(\d+):.*$/, '$1'),
      sets: line.split(';').map(set => parseSet(set))
    }));
}

function solve(input) {
  let games = parseInput(input);

  let answer1 = games
    .filter(({game, sets}) => sets.every(([r, g, b]) => r <= 12 && g <= 13 && b <= 14))
    .map(({game, sets}) => game)
    .reduce((a, b) => a + b, 0);

  let answer2 = games
    .map(({game, sets}) => sets)
    .map(sets =>
      sets.reduce(([r1, g1, b1], [r2, g2, b2]) =>
        ([Math.max(r1, r2), Math.max(g1, g2), Math.max(b1, b2)]), [0, 0, 0]))
    .map(([r, g, b]) => r * g * b)
    .reduce((a, b) => a + b, 0);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`);

solve(document.body.textContent);

})();

