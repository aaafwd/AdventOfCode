// https://adventofcode.com/2016/day/21
// --- Day 21: Scrambled Letters and Hash ---

(function() {

function parseInput(input) {
  const regex_swap = /^swap position (\d+) with position (\d+)/;
  const regex_swap_letters = /^swap letter (\w) with letter (\w)/;
  const regex_rotate = /^rotate (left|right) (\d+) steps?/;
  const regex_rotate_letter = /^rotate based on position of letter (\w)/;
  const regex_reverse = /^reverse positions (\d+) through (\d+)/;
  const regex_move = /^move position (\d+) to position (\d+)/;

  let commands = [];
  let lines = input.trim().split('\n'), match;
  for (let line of lines) {
    if ((match = line.match(regex_swap))) {
      let [, x, y] = match.map(x => +x);
      commands.push({id: 0, x, y});
    } else if ((match = line.match(regex_swap_letters))) {
      let [, ch1, ch2] = match;
      commands.push({id: 1, ch1, ch2});
    } else if ((match = line.match(regex_rotate))) {
      let [, dir, steps] = match;
      commands.push({id: 2, steps: (dir == 'right') ? +steps : -steps});
    } else if ((match = line.match(regex_rotate_letter))) {
      let [, ch] = match;
      commands.push({id: 3, ch});
    } else if ((match = line.match(regex_reverse))) {
      let [, x, y] = match.map(x => +x);
      commands.push({id: 4, x, y});
    } else if ((match = line.match(regex_move))) {
      let [, x, y] = match.map(x => +x);
      commands.push({id: 5, x, y});
    } else {
      console.assert(0, line);
    }
  }
  return commands;
}

function runCommand(cmd, chars, is_reverse) {
  function rotate(offset) {
    offset %= chars.length;
    chars = chars.map((ch, i) => chars[(i - offset + chars.length) % chars.length]);
  }

  if (cmd.id == 0) {
    let {x, y} = cmd;
    [chars[x], chars[y]] = [chars[y], chars[x]];
  } else if (cmd.id == 1) {
    let {ch1, ch2} = cmd;
    let x = chars.indexOf(ch1);
    let y = chars.indexOf(ch2);
    [chars[x], chars[y]] = [chars[y], chars[x]];
  } else if (cmd.id == 2) {
    let {steps} = cmd;
    if (is_reverse) steps *= -1;
    rotate(steps);
  } else if (cmd.id == 3) {
    let {ch} = cmd;
    let index = chars.indexOf(ch);
    let steps = 1 + index + (index >= 4 ? 1 : 0);
    if (is_reverse) {
      // index - 1 - (x >= 4 ? 1 : 0) = 2*x
      // 1) suppose x >= 4
      steps = null
      let tmp = index - 2;
      if (tmp < 0) tmp += chars.length;
      for (; tmp / 2 < chars.length; tmp += chars.length) {
        if ((tmp & 1) == 0 && tmp / 2 >= 4) {
          steps = index - tmp / 2;
        }  
      }
      // 2) x < 4;
      if (steps === null) {
        tmp = index - 1;
        if (tmp < 0) tmp += chars.length;
        for (; tmp / 2 < chars.length; tmp += chars.length) {
          if ((tmp & 1) == 0 && tmp / 2 < 4) {
            steps = index - tmp / 2;
          }  
        }
      }
      console.assert(steps !== null);
      steps *= -1;
    }
    rotate(steps);
  } else if (cmd.id == 4) {
    let {x, y} = cmd;
    for (; x < y; ++x, --y) {
      [chars[x], chars[y]] = [chars[y], chars[x]];
    }
  } else if (cmd.id == 5) {
    let {x, y} = cmd;
    if (is_reverse) [x, y] = [y, x];
    let tmp = chars.splice(x, 1)[0];
    chars.splice(y, 0, tmp);
  } else {
    console.assert(0, cmd);
  }

  return chars;
}

function runCommands(commands, chars, is_reverse, self_test = true) {
  if (is_reverse) commands = commands.splice(0).reverse();

  for (let cmd of commands) {
    let before = self_test ? chars.join('') : '';
    chars = runCommand(cmd, chars, is_reverse);
    let after = self_test ? chars.join('') : '';

    if (self_test) {
      let reversed = runCommand(cmd, chars.slice(0), !is_reverse).join('');
      console.assert(before == reversed, before, after, reversed, cmd);
    }
  }

  return chars;
}

function solve(input, password1, password2) {
  let commands = parseInput(input);

  let answer1 = runCommands(commands, password1.split(''), false);
  console.log('Answer 1:', answer1.join(''));

  let answer2 = runCommands(commands, password2.split(''), true);
  console.log('Answer 2:', answer2.join(''));
}

solve(`
swap position 4 with position 0
swap letter d with letter b
reverse positions 0 through 4
rotate left 1 step 
move position 1 to position 4
move position 3 to position 0
rotate based on position of letter b
rotate based on position of letter d
`, 'abcde', 'decab');

solve(document.body.textContent, 'abcdefgh', 'fbgdceah');

})();

