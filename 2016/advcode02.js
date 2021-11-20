// https://adventofcode.com/2016/day/2
// --- Day 2: Bathroom Security ---

(function() {

function simulate1(commands, num) {
  --num;
  // 0 1 2
  // 3 4 5
  // 6 7 8
  for (let cmd of commands) {
    if (cmd == 'U') {
      if (num >= 3) num -= 3;
    } else if (cmd == 'R') {
      if ((num % 3) < 2) ++num;
    } else if (cmd == 'D') {
      if (num < 6) num += 3;
    } else if (cmd == 'L') {
      if ((num % 3) > 0) --num;
    } else {
      console.assert(0, cmd);
    }
  }
  return num + 1;
}

function simulate2(commands, num) {
  //     1
  //   2 3 4
  // 5 6 7 8 9
  //   A B C
  //     D
  const kNumpads = '123456789ABCD';
  const kMoves = {
   U: '121452349678B',
   D: '36785ABC9ADCD',
   R: '134467899BCCD',
   L: '122355678AABD',
  };
  for (let cmd of commands) {
    num = kMoves[cmd][kNumpads.indexOf(num)];
  }
  return num;
}

function runSimulate(commands, simulate_fn) {
  let result = [];
  for (let i = 0; i < commands.length; ++i) {
    let num = i ? result[i - 1] : 5;
    result.push(simulate_fn(commands[i], num));
  }
  return result.join('');
}

function solve(input) {
  let commands = input.trim().split('\n').map(row => row.trim().split(''));
  let answer1 = runSimulate(commands, simulate1);
  let answer2 = runSimulate(commands, simulate2);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
ULL
RRDDD
LURDL
UUUUD
`);

solve(document.body.textContent);

})();

