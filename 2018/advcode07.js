// https://adventofcode.com/2018/day/7
// --- Day 7: The Sum of Its Parts ---

(function() {

function parseInput(input) {
  let nodes = {};
  let lines = input.trim().split('\n');
  const regex = /^Step (\w) must be finished before step (\w) can begin\.\s*$/;
  for (let line of lines) {
    let [, a, b] = line.match(regex);
    nodes[a] = nodes[a] || { allows: [], requires: [] };
    nodes[b] = nodes[b] || { allows: [], requires: [] };
    nodes[a].allows.push(b);
    nodes[b].requires.push(a);
  }
  return nodes;
}

function remove(array, item) {
  let index = array.indexOf(item);
  if (index >= 0) array.splice(index, 1);
}

function bfs(nodes) {
  let result = "";
  let queue = Object.keys(nodes).filter(v => nodes[v].requires.length == 0).sort();
  let mask = {};
  for (let v of queue) mask[v] = 1;
  while (queue.length > 0) {
    let node = queue.shift();
    result += node;
    let allows = nodes[node].allows.filter(v => !mask[v]);
    for (let v of allows) {
      remove(nodes[v].requires, node);
      if (nodes[v].requires.length == 0) {
        queue.push(v);
        mask[v] = 1;
      }
    }
    queue.sort();
  }
  return result;
}

function letterDuration(ch) {
  return ch.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
}

function completeWithWorkers(nodes, duration_offset, num_workers) {
  let queue = Object.keys(nodes).filter(v => nodes[v].requires.length == 0).sort();
  let mask = {};
  for (let v of queue) mask[v] = 1;

  let workers = [];
  let total_duration = 0;
  while (workers.length > 0 || queue.length > 0) {
    while (queue.length > 0 && workers.length < num_workers) {
      let node = queue.shift();
      let time = total_duration + duration_offset + letterDuration(node);
      workers.push({node, time});
    }
    workers.sort((w1, w2) => w1.time - w2.time);

    let {node, time} = workers.shift();
    total_duration = time;

    let allows = nodes[node].allows.filter(v => !mask[v]);
    for (let v of allows) {
      remove(nodes[v].requires, node);
      if (nodes[v].requires.length == 0) {
        queue.push(v);
        mask[v] = 1;
      }
    }
    queue.sort();
  }
  return total_duration;
}

function solve(input, duration_offset, num_workers) {
  let answer1 = bfs(parseInput(input));
  let answer2 = completeWithWorkers(parseInput(input), duration_offset, num_workers);
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
`, 0, 2);

solve(document.body.textContent, 60, 5);

})();

