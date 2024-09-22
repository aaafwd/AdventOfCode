// https://adventofcode.com/2022/day/5
// --- Day 5: Supply Stacks ---

(function() {

function parseInput(input) {
  let [part1, part2] = input
    .split('\n\n')
    .map(part => part.split('\n'));

  // Line with the numbers:
  let numbers = part1.pop().trim().split(/\s+/).map(Number);
  numbers.forEach((x, i) => console.assert(x == i + 1, x, i));

  let stacks = Array(numbers.length).fill(0).map(_ => []);
  for (let line of part1) {
    // [G]     [P] [C] [F] [G] [T]
    for (let k = 0, i = 1; i < line.length; i += 4, ++k) {
      let ch = line.charAt(i);
      if (ch == ' ') continue;
      console.assert('A' <= ch && ch <= 'Z', ch);
      stacks[k].push(ch);
    }
  }
  stacks.forEach(stack => stack.reverse());

  let moves = part2
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      let [, count, from, to] = line.match(/^move (\d+) from (\d+) to (\d+)$/);
      return [+count, +from - 1, +to - 1];
    });

  return [stacks, moves];
}

function applyMoves(stacks, moves, reverseOrder) {
  stacks = stacks.map(stack => stack.slice()); // Clone.
  for (let [count, from, to] of moves) {
    console.assert(count <= stacks[from].length);
    let removed = stacks[from].splice(-count);
    if (reverseOrder) removed.reverse();
    stacks[to].push(...removed);
  }
  return stacks;
}

function solve(input) {
  let [stacks, moves] = parseInput(input);

  let [answer1, answer2] = [true, false]
    .map(reverseOrder => applyMoves(stacks, moves, reverseOrder)
      .filter(stack => stack.length > 0)
      .map(stack => stack[stack.length - 1])
      .join(''));

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`);

solve(document.body.textContent);

})();

