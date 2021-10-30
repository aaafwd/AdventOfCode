// https://adventofcode.com/2017/day/13
// --- Day 13: Packet Scanners ---

(function() {

function nextCaughtPosition(firewall, depth, delay = 0) {
  for (; depth < firewall.length; ++depth) {
    let range = firewall[depth];
    if (!range) continue;
    let pos = (delay + depth) % (2 * range - 2);
    if (pos == 0) break;
  }
  return depth;
}

function solve(input) {
  let lines = input.trim().split('\n');
  let firewall = [];
  for (let line of lines) {
    let [depth, range] = line.split(/\s*:\s*/);
    firewall[+depth] = +range;
  }

  let answer1 = 0;
  for (let depth = 0;; ++depth) {
    depth = nextCaughtPosition(firewall, depth);
    if (depth >= firewall.length) break;
    answer1 += depth * firewall[depth];
  }

  let answer2 = 0;
  for (let delay = 1;; ++delay) {
    let depth = nextCaughtPosition(firewall, 0, delay);
    if (depth >= firewall.length) {
      answer2 = delay;
      break;
    }
  }

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
0: 3
1: 2
4: 4
6: 4
`);

solve(document.body.textContent);

})();

