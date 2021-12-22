// https://adventofcode.com/2021/day/15
// --- Day 15: Chiton ---
//
// Runtime: 119.15600585 ms (with Heap)
// Runtime: 481.44921875 ms (w/o using Heap)

(function() {
console.time('Runtime');

class Heap {
  constructor(array, comparator) {
    this.items_ = array;
    this.comparator_ = comparator;
    this.buldHeap_();
  }

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

  push(item) {
    this.items_.push(item);
    this.siftUp_(this.items_.length - 1);
  }

  get length() {
    return this.items_.length;
  }

  buldHeap_() {
    // Index of the last non-leaf node.
    let index = Math.floor(this.items_.length / 2) - 1;
    for (; index >= 0; --index) {
      this.siftDown_(index);
    }
  }

  siftDown_(index) {
    const array = this.items_;
    const length = array.length;
    while (1) {
      let min_index = index;
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      if (left < length && this.comparator_(array[left], array[min_index]) < 0) {
        min_index = left;
      }
      if (right < length && this.comparator_(array[right], array[min_index]) < 0) {
        min_index = right;
      }
      if (min_index == index) break;
      [array[min_index], array[index]] = [array[index], array[min_index]];
      index = min_index;
    }
  }

  siftUp_(index) {
    const array = this.items_;
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (this.comparator_(array[parent], array[index]) < 0) break;
      [array[parent], array[index]] = [array[index], array[parent]];
      index = parent;
    }
  }
}

const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function parseInput(input) {
  return input.trim().split('\n').map(row => row.trim().split('').map(Number));
}

function findMinPath(map, kOptUseHeap = !false) {
  const target_x = map[0].length - 1;
  const target_y = map.length - 1;
  let queue = [[0, 0, 0]]; // [x, y, cost]
  if (kOptUseHeap) queue = new Heap(queue, (i1, i2) => i1[2] - i2[2]);
  map[0][0] = -1;
  while (queue.length > 0) {
    let [x, y, cost] = queue.pop();
    if (!kOptUseHeap) {
      for (let i = 0; i < queue.length; ++i) {
        if (queue[i][2] < cost) {
          [[x, y, cost], queue[i]] = [queue[i], [x, y, cost]];
        }
      }
    }
    if (x == target_x && y == target_y) return cost;
    for (let [dx, dy] of kDirs) {
      let nx = x + dx;
      let ny = y + dy;
      if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[ny].length) continue;
      if (map[ny][nx] < 0) continue;
      let ncost = cost + map[ny][nx];
      queue.push([nx, ny, ncost]);
      map[ny][nx] = -1;
    }
  }
}

function foldX5(map) {
  let Y = map.length;
  let X = map[0].length;
  let mapX5 = Array(Y * 5).fill(0).map(row => Array(X * 5).fill(0));
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      for (let i = 0; i < 5; ++i) {
        for (let j = 0; j < 5; ++j) {
          let value = map[y][x] + i + j;
          while (value > 9) value -= 9;
          mapX5[y + Y * i][x + X * j] = value;
        }
      }
    }
  }
  return mapX5;
}

function solve(input) {
  let map = parseInput(input);
  let mapX5 = foldX5(map);
  let answer1 = findMinPath(map);
  let answer2 = findMinPath(mapX5);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

