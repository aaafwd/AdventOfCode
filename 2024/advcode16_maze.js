// https://adventofcode.com/2024/day/16
// --- Day 16: Reindeer Maze ---
// Runtime: 50.669921875 ms (with Heap)
// Runtime: 1410.85009765625 ms (with Array)

(function() {
console.time('Runtime');

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function mapsInRange(map, x, y) { return 0 <= y && y < map.length && 0 <= x && x < map[y].length; }

function mapsFindChar(map, ch) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == ch) return [x, y];
    }
  }
  console.assert(false, map, ch);
}

/**
 * Binary heap data structure where the parent key is less than or equal to (≤)
 * the child keys (min-heap).
 *
 * @param {!Array<*>} array Elements to heapify.
 * @param {function(a, b):boolean} comparator A function that defines the sort
 *     order. The return value should be a number whose sign indicates the
 *     relative order of the two elements: negative if `a` is less than `b`,
 *     positive if `a` is greater than `b`, and zero if they are equal.
 *
 * See:
 *   - https://en.wikipedia.org/wiki/Binary_heap
 *   - https://neerc.ifmo.ru/wiki/index.php?title=Двоичная_куча
 */
class Heap {
  constructor(array, comparator) {
    this.items_ = array;
    this.comparator_ = comparator;
    this.buldHeap_();
  }

  /** Reads the root (minimum element) of the heap. */
  peek() {
    if (this.items_.length == 0) {
      throw new Error('Empty heap');
    }
    return this.items_[0];
  }

  /** Deletes the root (minimum element) from the heap. */
  pop() {
    if (this.items_.length == 0) {
      throw new Error('Empty heap');
    }
    let top = this.items_[0];
    if (this.items_.length == 1) {
      this.items_.length = 0;
    } else {
      this.items_[0] = this.items_.pop();
      this.siftDown_(0);
    }
    return top;
  }

  /** Adds the specified item to the heap. */
  push(item) {
    this.items_.push(item);
    this.siftUp_(this.items_.length - 1);
  }

  /** Executes `pop()` and `push(item)` efficiently. */
  popAndPush(item) {
    if (this.items_.length == 0) {
      throw new Error('Empty heap');
    }
    let top = this.items_[0];
    this.items_[0] = item;
    this.siftDown_(0);
    return top;
  }

  get length() {
    return this.items_.length;
  }

  buldHeap_() {
    // Index of the last non-leaf node.
    let index = (this.items_.length >> 1) - 1;
    for (; index >= 0; --index) {
      this.siftDown_(index);
    }
  }

  siftDown_(index) {
    const array = this.items_;
    const length = array.length;
    while (1) {
      let minIndex = index;
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      if (left < length && this.comparator_(array[left], array[minIndex]) < 0) {
        minIndex = left;
      }
      if (right < length && this.comparator_(array[right], array[minIndex]) < 0) {
        minIndex = right;
      }
      if (minIndex == index) break;
      [array[minIndex], array[index]] = [array[index], array[minIndex]];
      index = minIndex;
    }
  }

  siftUp_(index) {
    const array = this.items_;
    while (index > 0) {
      let parent = (index - 1) >> 1;
      if (this.comparator_(array[parent], array[index]) < 0) break;
      [array[parent], array[index]] = [array[index], array[parent]];
      index = parent;
    }
  }
}

function parseInput(input) {
  let lines = input.trim().split('\n');
  return lines.map(row => row.trim().split(''));
}

function toKey(x, y, dir) {
  console.assert(0 <= x && x <= 0x1fff && 0 <= y && y <= 0x3fff, x, y);
  return (x << 18) | (y << 2) | dir;
}

function fromKey(key) {
  return [key >> 18, (key >> 2) & 0xffff, key & 3];
}

function findMinPath(map) {
  let [sx, sy] = mapsFindChar(map, 'S');
  let [ex, ey] = mapsFindChar(map, 'E');
  let dir = 1; // East
  let costs = new Map();
  // Slow: array queue: 1400 ms
  // let queue = [];
  // Fast: heap queue: 50 ms
  let queue = new Heap([], ([,cost1], [,cost2]) => cost1 - cost2);
  let key = toKey(sx, sy, dir);
  costs.set(key, 0);
  queue.push([key, 0]);
  while (queue.length > 0) {
    let [key, cost] = queue.pop();
    let [x, y, dir] = fromKey(key);
    if (x == ex && y == ey) continue;
    if (costs.get(key) != cost) continue;
    let [dx, dy] = kDirs[dir];
    let nx = x + dx;
    let ny = y + dy;
    if (mapsInRange(map, nx, ny) && map[ny][nx] != '#') {
      let ncost = cost + 1;
      let nkey = toKey(nx, ny, dir);
      if (!costs.has(nkey) || costs.get(nkey) > ncost) {
        costs.set(nkey, ncost);
        queue.push([nkey, ncost]);
      }
    }
    for (let ndir of [dir ^ 1, dir ^ 3]) {
      let ncost = cost + 1000;
      let nkey = toKey(x, y, ndir);
      if (!costs.has(nkey) || costs.get(nkey) > ncost) {
        costs.set(nkey, ncost);
        queue.push([nkey, ncost]);
      }
    }
  }

  let bestCost = Infinity;
  for (let dir = 0; dir < 4; ++dir) {
    let key = toKey(ex, ey, dir);
    if (!costs.has(key)) continue;
    bestCost = Math.min(bestCost, costs.get(key));
  }

  let bestPaths = new Set();
  for (let dir = 0; dir < 4; ++dir) {
    let key = toKey(ex, ey, dir);
    if (costs.get(key) == bestCost) {
      queue.push([key, bestCost]);
    }
  }
  while (queue.length > 0) {
    let [key, cost] = queue.pop();
    let [x, y, dir] = fromKey(key);
    bestPaths.add(toKey(x, y, 0));
    if (x == sx && y == sy) continue;
    let [dx, dy] = kDirs[dir];
    let nx = x - dx;
    let ny = y - dy;
    if (mapsInRange(map, nx, ny) && map[ny][nx] != '#') {
      let ncost = cost - 1;
      let nkey = toKey(nx, ny, dir);
      if (costs.get(nkey) == ncost) {
        queue.push([nkey, ncost]);
      }
    }
    for (let ndir of [dir ^ 1, dir ^ 3]) {
      let ncost = cost - 1000;
      let nkey = toKey(x, y, ndir);
      if (costs.get(nkey) == ncost) {
        queue.push([nkey, ncost]);
      }
    }
  }

  return [bestCost, bestPaths.size];
}

function solve(input) {
  let map = parseInput(input);

  let [answer1, answer2] = findMinPath(map);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`);

solve(`
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

