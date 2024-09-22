// https://adventofcode.com/2022/day/7
// --- Day 7: No Space Left On Device ---

(function() {

function parseInput(input) {
  let lines = input.trim()
    .split('\n')
    .map(line => line.trim());
  let root = {
    children: {},
    parent: null,
    size: undefined
  };
  let current = root;
  let match;
  for (let line of lines) {
    if ((match = line.match(/^\$\s*cd\s+(\S+)$/))) {
      let dir = match[1];
      if (dir == "..") {
        console.assert(current.parent != null, current);
        current = current.parent;
      } else if (dir == "/") {
        current = root;
      } else {
        console.assert(current.children[dir] != null, current, dir);
        current = current.children[dir];
      }
    } else if ((match = line.match(/^\$\s*ls$/))) {
      // Do nothing.
    } else if ((match = line.match(/^dir\s+(\S+)$/))) {
      let dir = match[1];
      console.assert(current.children[dir] == null, current, dir);
      current.children[dir] = {
        children: {},
        parent: current,
        size: undefined
      };
    } else if ((match = line.match(/^(\d+)\s+(\S+)$/))) {
      let [, size, name] = match;
      current.children[name] = {
        children: null,
        parent: current,
        size: +size
      };
    } else {
      console.assert(false, line);
    }
  }
  return root;
}

function getSize(node) {
  if (node.size !== undefined) return node.size;
  let size = 0;
  for (let child of Object.values(node.children)) {
    size += getSize(child);
  }
  node.size = size;
  return size;
}

function getDirectories(node) {
  if (node.children == null) return [];
  let result = [node];
  for (let child of Object.values(node.children)) {
    result.push(...getDirectories(child));
  }
  return result;
}

function solve(input) {
  let root = parseInput(input);
  let dirs = getDirectories(root);

  let answer1 = dirs
    .map(getSize)
    .filter(size => size <= 100000)
    .reduce((a, b) => a + b);

  let needed = getSize(root) - 40000000;
  console.assert(needed > 0);

  let answer2 = dirs
    .map(getSize)
    .filter(size => size >= needed)
    .reduce((a, b) => Math.min(a, b));

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`);

solve(document.body.textContent);

})();

