// https://adventofcode.com/2021/day/18
// --- Day 18: Snailfish ---
//
// Runtime: 137.81591796875 ms

(function() {
console.time('Runtime');

const kDebug = !true;

function parseLiteral(str, index = 0, parent = null) {
  let result = {parent};
  if (str[index] == '[') {
    ++index;
    [result.left, index] = parseLiteral(str, index, result);
    console.assert(str[index] == ',');
    ++index;
    [result.right, index] = parseLiteral(str, index, result);
    console.assert(str[index] == ']');
    ++index;
    return [result, index];
  }
  let literal = 0;
  while ('0' <= str[index] && str[index] <= '9') {
    literal = literal * 10 + Number(str[index]);
    ++index;
  }
  result.literal = literal;
  return [result, index];
}

function parseInput(input) {
  return input.trim().split('\n').map(row => parseLiteral(row.trim())[0]);
}

function isLiteral(node) {
  return node.literal !== undefined;
}

function findPreviousLiteral(node) {
  while (1) {
    let parent = node.parent;
    if (!parent) return null;
    if (node == parent.left) {
      node = parent;
      continue;
    }
    node = parent.left;
    break;
  }
  while (node.right) node = node.right;
  return node;
}

function findNextLiteral(node) {
  while (1) {
    let parent = node.parent;
    if (!parent) return null;
    if (node == parent.right) {
      node = parent;
      continue;
    }
    node = parent.right;
    break;
  }
  while (node.left) node = node.left;
  return node;
}

function explodeNode(node) {
  let parent = node.parent;
  console.assert(isLiteral(node.left));
  console.assert(isLiteral(node.right));
  let left_num = node.left.literal;
  let right_num = node.right.literal;
  node.left = node.right = null;
  node.literal = 0;
  let previous = findPreviousLiteral(node);
  if (previous) previous.literal += left_num;
  let next = findNextLiteral(node);
  if (next) next.literal += right_num;
}

function splitNode(node) {
  console.assert(isLiteral(node));
  let left_num = Math.floor(node.literal / 2);
  let right_num = node.literal - left_num;
  delete node.literal;
  node.left = {parent: node, literal: left_num};
  node.right = {parent: node, literal: right_num};
}

function findAndExplodeAll(node, depth = 0) {
  if (isLiteral(node)) return;
  if (depth == 4) {
    explodeNode(node);
  } else {
    findAndExplodeAll(node.left, depth + 1);
    findAndExplodeAll(node.right, depth + 1);
  }
}

function findAndSplitAny(node, depth = 0) {
  if (isLiteral(node)) {
    if (node.literal >= 10) {
      splitNode(node);
      if (depth == 4) explodeNode(node);
      return true;
    }
    return false;
  }
  return findAndSplitAny(node.left, depth + 1) ||
    findAndSplitAny(node.right, depth + 1);
}

function reduceNode(root) {
  findAndExplodeAll(root);
  while (findAndSplitAny(root)) {}
  return root;
}

function convertToString(node) {
  if (isLiteral(node)) return node.literal + '';
  return '[' + convertToString(node.left) + ',' + convertToString(node.right) + ']';
}

function clone(node) {
  let result = {parent: null};
  if (isLiteral(node)) {
    result.literal = node.literal;
  } else {
    result.left = clone(node.left);
    result.right = clone(node.right);
    result.left.parent = result.right.parent = result;
  }
  return result;
}

function sumAllNodes(nodes) {
  nodes = nodes.map(clone);
  let root = nodes[0];
  let logs = [];
  for (let i = 1; i < nodes.length; ++i) {
    root = {left: root, right: nodes[i], parent: null};
    root.left.parent = root;
    root.right.parent = root;
    if (kDebug) {
      logs.push('  ' + convertToString(root.left));
      logs.push('+ ' + convertToString(root.right));
    }
    reduceNode(root);
    if (kDebug) {
      logs.push('= ' + convertToString(root), '');
    }
  }
  if (logs.length) {
    console.log(logs.join('\n'));
  }
  return root;
}

function getMagnitude(node) {
  if (isLiteral(node)) return node.literal;
  return getMagnitude(node.left) * 3 + getMagnitude(node.right) * 2;
}

function findMaxMagnitudeSum(nodes) {
  let result = 0;
  for (let i = 0; i < nodes.length; ++i) {
    for (let j = 0; j < nodes.length; ++j) {
      if (i == j) continue;
      let root = {left: clone(nodes[i]), right: clone(nodes[j]), parent: null};
      root.left.parent = root;
      root.right.parent = root;
      reduceNode(root);
      result = Math.max(result, getMagnitude(root));
    }
  }
  return result;
}

function solve(input) {
  let nodes = parseInput(input);
  nodes.forEach(reduceNode);
  let root = sumAllNodes(nodes);
  let answer1 = getMagnitude(root);
  let answer2 = findMaxMagnitudeSum(nodes);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
[1,1]
[2,2]
[3,3]
[4,4]
`);

solve(`
[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
`);

solve(`
[1,1]
[2,2]
[3,3]
[4,4]
[5,5]
[6,6]
`);

solve(`
[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]]
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]]
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]
[7,[5,[[3,8],[1,4]]]]
[[2,[2,2]],[8,[8,1]]]
[2,9]
[1,[[[9,3],9],[[9,0],[0,7]]]]
[[[5,[7,4]],7],1]
[[[[4,2],2],6],[8,7]]
`);

solve(`
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

