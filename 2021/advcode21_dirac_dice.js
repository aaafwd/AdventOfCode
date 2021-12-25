// https://adventofcode.com/2021/day/21
// --- Day 21: Dirac Dice ---
//
// Runtime: 75.019287109375 ms

(function() {
console.time('Runtime');

function solve1(pos) {
  let scores = [0, 0], index = 0, dice = 1;
  while (1) {
    pos[index] += (dice + 1) * 3;
    dice += 3;
    pos[index] %= 10; 
    scores[index] += pos[index] + 1;
    if (scores[index] >= 1000) break;
    index ^= 1;
  }
  index ^= 1;
  return (dice - 1) * scores[index];
}

function solve2(pos) {
  function getCacheKey([pos1, pos2], [score1, score2], index) {
    // 0 <= pos1 <= 9:     4 bits
    // 0 <= pos2 <= 9:     4 bits
    // 0 <= scores1 <= 29: 5 bits
    // 0 <= scores2 <= 29: 5 bits
    // 0 <= index <= 1:    1 bit
    return (pos1 << 15) | (pos2 << 11) | (score1 << 6) | (score2 << 1) | index;
  }

  let cache = new Map();
  function calculateUniverses(pos, scores, index) {
    if (scores[0] >= 21) return [1, 0];
    if (scores[1] >= 21) return [0, 1];

    let key = getCacheKey(pos, scores, index);
    let result = cache.get(key);
    if (result) return result;

    result = [0, 0];
    for (let sum = 3; sum <= 9; ++sum) {
      let occurances = [1, 3, 6, 7, 6, 3, 1][sum - 3];
      let npos = [...pos];
      npos[index] += sum;
      npos[index] %= 10;
      let nscores = [...scores];
      nscores[index] += npos[index] + 1;
      let sub_result = calculateUniverses(npos, nscores, index ^ 1);
      result[0] += occurances * sub_result[0];
      result[1] += occurances * sub_result[1];
    }
    cache.set(key, result)
    return result;
  }

  let result = calculateUniverses(pos, [0, 0], 0);
  return Math.max(...result);
}

function parseInput(input) {
  const regex = /starting position: (\d+)/g;
  return [...input.matchAll(regex)].map(match => (+match[1]) - 1);
}

function solve(input) {
  let pos = parseInput(input);
  let answer1 = solve1([...pos]);
  let answer2 = solve2([...pos]);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
Player 1 starting position: 4
Player 2 starting position: 8
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

