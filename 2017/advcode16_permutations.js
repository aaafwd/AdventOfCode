// https://adventofcode.com/2017/day/16
// --- Day 16: Permutation Promenade ---

(function() {

function simulate(permutation, ops) {
  for (let op of ops) {
    if (op[0] == 's') {
      let tail = +op.substr(1);
      let head = permutation.length - tail;
      let removed = permutation.splice(0, head);
      permutation.splice(tail, 0, ...removed);
    } else if (op[0] == 'x') {
      let [pos1, pos2] = op.substr(1).split('/').map(x => +x);
      [permutation[pos2], permutation[pos1]] = [permutation[pos1], permutation[pos2]];
    } else if (op[0] == 'p') {
      let num1 = op[1].charCodeAt(0) - 'a'.charCodeAt(0);
      let num2 = op[3].charCodeAt(0) - 'a'.charCodeAt(0);
      let pos1 = permutation.indexOf(num1);
      let pos2 = permutation.indexOf(num2);
      [permutation[pos2], permutation[pos1]] = [permutation[pos1], permutation[pos2]];
    } else {
      console.assert(0, op);
    }
  }
}

function repeatPermutation(permutation, repeat_count) {
  // Find permutation cycles.
  let cycles = [];
  while (1) {
    let pos = 0;
    while (permutation[pos] == -1 && pos < permutation.length) ++pos;
    if (pos >= permutation.length) break;

    let cycle = [pos];
    while (1) {
      let next = permutation.indexOf(pos);
      console.assert(next >= 0);
      permutation[next] = -1;
      if (next == cycle[0]) break;
      cycle.push(next);
      pos = next;
    }
    cycles.push(cycle);
  }

  // Restore repeated permutation.
  for (let cycle of cycles) {
    let offset = repeat_count % cycle.length;
    for (let i = 0; i < cycle.length; ++i) {
      let pos = cycle[(i + offset) % cycle.length];
      console.assert(permutation[pos] == -1);
      permutation[pos] = cycle[i];
    }
  }
}

function permutationToString(permutation) {
  return permutation.map(x => String.fromCharCode('a'.charCodeAt(0) + x)).join('');
}

function identicalPermutation(size) {
  return Array(size).fill(0).map((_, i) => i);
}

function solve(input, size = 16) {
  let ops = input.trim().split(/\s*,\s*/);
  let permutation = identicalPermutation(size);
  simulate(permutation, ops);
  let answer1 = permutationToString(permutation);

  // Remove swapping (renaming) operations since those are independent of the others
  // and will cancel each other anyways after an even number of permutations.
  ops = ops.filter(op => op[0] != 'p');
  permutation = identicalPermutation(size);
  simulate(permutation, ops);
  repeatPermutation(permutation, 1000000000);
  let answer2 = permutationToString(permutation);

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve('s1,x3/4,pe/b', 5);

solve(document.body.textContent);

})();

