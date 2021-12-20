// https://adventofcode.com/2021/day/4
// --- Day 4: Giant Squid ---

(function() {

function parseInput(input) {
  let parts = input.trim().split('\n\n');
  let numbers = parts.shift().trim().split(',').map(Number);
  let boards = parts.map(part =>
    part.split('\n').map(row => row.trim().split(/\s+/).map(Number)));
  return {numbers, boards};
}

function isWin(marked, board) {
  for (let i = 0; i < 5; ++i) {
    let match_row = true, match_col = true;
    for (let j = 0; j < 5; ++j) {
      if (!marked[board[i][j]]) match_row = false;
      if (!marked[board[j][i]]) match_col = false;
    }
    if (match_row || match_col) return true;
  }
  return false;
}

function sumUnmarked(marked, board) {
  return [].concat(...board).filter(x => !marked[x]).reduce((x, y) => x + y, 0);
}

function solve1(numbers, boards) {
  let marked = [];
  for (let num of numbers) {
    marked[num] = 1;
    for (let board of boards) {
      if (isWin(marked, board)) {
        return sumUnmarked(marked, board) * num;
      }
    }
  }
  return -1;
}

function solve2(numbers, boards) {
  let marked = [];
  let win_boards = [];
  let left = boards.length;
  for (let num of numbers) {
    marked[num] = 1;
    for (let i = 0; i < boards.length; ++i) {
      if (win_boards[i]) continue;
      if (isWin(marked, boards[i])) {
        win_boards[i] = 1;
        if (--left == 0) {
          return sumUnmarked(marked, boards[i]) * num;
        }
      }
    }
  }
  return -1;
}

function solve(input) {
  let {numbers, boards} = parseInput(input);
  let answer1 = solve1(numbers, boards);
  let answer2 = solve2(numbers, boards);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`);

solve(document.body.textContent);

})();

