// https://adventofcode.com/2018/day/20
// --- Day 20: A Regular Map ---
//
// Runtime: 65.1181640625 ms

(function() {
console.time("Runtime");

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const kDirChars = ['N', 'E', 'S', 'W'];

const kBitsToStoreCoords = 7;
const kCoordBounds = (1 << kBitsToStoreCoords);

function assert(condition) {
  if (condition) return;
  console.assert.apply(console, arguments);
  debugger;
  throw new Error('Assertion failed');
}

function cacheKey(x, y) {
  assert(x < kCoordBounds && y < kCoordBounds);
  x += kCoordBounds;
  y += kCoordBounds;
  assert(x >= 0 && y >= 0);
  let key = (x << (kBitsToStoreCoords + 1)) | y;
  return key;
}

function constructGraph(graph, all_paths) {
  assert(all_paths.shift() == '^');
  assert(all_paths.pop() == '$');

  let group_begins = [];
  let group_ends = [];

  for (let i = 0; i < all_paths.length; ++i) {
    let ch = all_paths[i];
    if (ch == '(') {
      group_begins.push(i);
    } else if (ch == ')') {
      assert(group_begins.length > 0);
      let begin_index = group_begins.pop();
      group_ends[begin_index] = i;
    }
  }
  assert(group_begins.length == 0);

  const kShiftBitsForIndexCacheKey = (kBitsToStoreCoords * 2 + 2);
  assert(kShiftBitsForIndexCacheKey < 32 && all_paths.length < (1 << (32 - kShiftBitsForIndexCacheKey)),
      "Fix the kBitsToStoreCoords constant or revisit the cacheKey() function!");

  let cache = {};
  function traverse(x = 0, y = 0, index = 0, groups_stack = []) {
    for (; index < all_paths.length; ++index) {
      let key = cacheKey(x, y);
      let cache_key = (index << kShiftBitsForIndexCacheKey) | key;
      if (cache[cache_key]) break;
      cache[cache_key] = 1;

      let ch = all_paths[index];
      let dir = kDirChars.indexOf(ch);
      if (dir >= 0) {
        graph[key] = (graph[key] || 0) | (1 << dir);
        x += kDirs[dir][0];
        y += kDirs[dir][1];
      } else if (ch == '(') {
        groups_stack.push({start_index: index, start_x: x, start_y: y});
      } else if (ch == ')') {
        assert(groups_stack.length > 0);
        groups_stack.pop();
      } else if (ch == '|') {
        assert(groups_stack.length > 0);
        let last_group = groups_stack.pop();
        let group_end = group_ends[last_group.start_index];
        traverse(x, y, group_end + 1, groups_stack.slice(0));
        groups_stack.push(last_group);
        x = last_group.start_x;
        y = last_group.start_y;
      } else {
        assert(0, ch, index);
      }
    }
  }
  traverse();
}

function bfs(graph) {
  let key = cacheKey(0, 0);
  let queue = [[0, 0, key]];
  let mask = {};
  mask[key] = 1;
  let steps = 0;
  let rooms1000 = 0;
  while (queue.length > 0) {
    let next_queue = [];
    while (queue.length > 0) {
      let [x, y, key] = queue.shift();
      let dirs = graph[key];
      for (let dir = 0; dir < 4; ++dir) {
        if (!(dirs & (1 << dir))) continue;
        let nx = x + kDirs[dir][0];
        let ny = y + kDirs[dir][1];
        let nkey = cacheKey(nx, ny);
        if (mask[nkey]) continue;
        mask[nkey] = 1;
        next_queue.push([nx, ny, nkey]);
      }
    }
    if (next_queue.length == 0) break;
    ++steps;
    queue = next_queue;
    if (steps >= 1000) rooms1000 += queue.length;
  }
  return [steps, rooms1000];
}

function solve(all_paths) {
  let graph = {};
  constructGraph(graph, all_paths.trim().split(''));
  let [answer1, answer2] = bfs(graph);
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve('^ENWWW(NEEE|SSE(EE|N))$');
solve('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$');
solve('^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$');
solve('^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$');

solve(document.body.textContent);

console.timeEnd("Runtime");
})();

