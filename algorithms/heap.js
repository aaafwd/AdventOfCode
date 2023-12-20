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

