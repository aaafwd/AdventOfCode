// https://adventofcode.com/2023/day/17
// --- Day 17: Clumsy Crucible ---
// Runtime: 500 ms

(function() {
console.time('Runtime');

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

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  return input.trim()
    .split('\n')
    .map(row => row.trim().split('').map(x => +x));
}

function findMinCost(map, minBlocks, maxBlocks) {
  // Runs Dijkstra algorithm with the `queue` of [x, y, dir, count, cost],
  // where `cost` is the minimum cost to reach [x, y] given the last `count`
  // steps in the `dir` direction. The heap is maintained by the `cost` key.
  // The `costs` is a map from [x, y, dir, count] to minimum cost.
  let queue = new Heap([[makeKey(0, 0, 0, 1), 0]], (i1, i2) => i1[1] - i2[1]);
  let costs = new Map();

  while (queue.length > 0) {
    let [key, cost] = queue.pop();
    if (costs.has(key) && costs.get(key) < cost) continue;

    let [x, y, count, dir] = fromKey(key);
    if (y == map.length - 1 && x == map[y].length - 1 && count >= minBlocks) {
      return cost;
    }

    for (let i = 0; i < kDirs.length; ++i) {
      if (i == (dir ^ 2)) continue;
      if (i != dir && count < minBlocks) continue;
      let [dx, dy] = kDirs[i];
      let nx = x + dx;
      let ny = y + dy;
      let ncount = (i == dir) ? count + 1 : 1;
      if (ncount > maxBlocks) continue;
      if (ny < 0 || ny >= map.length) continue;
      if (nx < 0 || nx >= map[y].length) continue;
      let ncost = cost + map[ny][nx];
      let nkey = makeKey(nx, ny, ncount, i);
      if (costs.has(nkey) && costs.get(nkey) <= ncost) continue;
      costs.set(nkey, ncost);
      queue.push([nkey, ncost]);
    }
  }

  function makeKey(x, y, count, dir) {
    // Bits: dir:2, count:4, y:12, x:12
    console.assert(dir < 4 && count < 16 && y < 4096 && x < 4096);
    return (x << 18) | (y << 6) | (count << 2) | dir;
  }

  function fromKey(key) {
    return [key >> 18, (key >> 6) & 4095, (key >> 2) & 15, key & 3];
  }

  console.assert(false);
  return -1;
}

function solve(input) {
  let map = parseInput(input);
  let answer1 = findMinCost(map, 1, 3);
  let answer2 = findMinCost(map, 4, 10);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`);

solve(`
111111111111
999999999991
999999999991
999999999991
999999999991
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

