// https://adventofcode.com/2018/day/8
// --- Day 8: Memory Maneuver ---

(function() {

function parseInput(input) {
  let nums = input.trim().split(/\s+/).map(x => +x);

  function process(index, node) {
    let child_count = nums[index++];
    let entry_count = nums[index++];
    node.children = [];
    for (let i = 0; i < child_count; ++i) {
      let sub_node = {};
      index = process(index, sub_node);
      node.children.push(sub_node);
    }
    node.entries = [];
    for (let i = 0; i < entry_count; ++i) {
      node.entries.push(nums[index++]);
    }
    return index;
  }

  let root = {};
  let end = process(0, root);
  console.assert(end == nums.length);
  return root;
}

function sumMetadata(node) {
  let result = node.entries.reduce((x, y) => x + y);
  for (let sub_node of node.children) {
    result += sumMetadata(sub_node);
  }
  return result;
}

function getNodeValue(node) {
  if (node.children.length == 0) {
    return node.entries.reduce((x, y) => x + y);
  }
  let result = 0;
  for (let entry of node.entries) {
    let index = entry - 1;
    if (index < 0 || index >= node.children.length) continue;
    result += getNodeValue(node.children[index]);
  }
  return result;
}

function solve(input) {
  let root = parseInput(input);
  let answer1 = sumMetadata(root);
  let answer2 = getNodeValue(root);
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`);

solve(document.body.textContent);

})();

