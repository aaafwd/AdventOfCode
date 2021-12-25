// https://adventofcode.com/2021/day/23
// --- Day 23: Amphipod ---
//
// Runtime: 2169.869873046875 ms

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

const kMoveCosts = [1, 10, 100, 1000];

// Numeration in the diagram:
//
// ###################################
// # 0  1  2  3  4  5  6  7  8  9 10 #
// ###### 11  # 12  # 13  # 14 #######
//      # 15  # 16  # 17  # 18 #
//      # 19  # 20  # 21  # 22 #
//      # 23  # 24  # 25  # 26 #
//      ########################

/* const */ let kTupleSize; // `2` for part #1 or `4` for part #2
/* const */ let kPositions; // 19 or 27
/* const */ let kTupleMaskToState;
/* const */ let kStateToTuple;
/* const */ let kStatesNum;
/* const */ let kBigIntsThreshold;

function precalculateConstants(tuple_size) {
  kTupleSize = tuple_size;
  kPositions = 11 + kTupleSize * 4;

  let tuple_to_state = new Map();
  let state_to_tuple = [];
  let state = 0;

  function generate(tuple = [], mask = Array(kPositions).fill(0)) {
    if (tuple.length == kTupleSize) {
      state_to_tuple[state] = [...tuple];
      tuple_to_state.set(tupleToTupleMask(tuple), state);
      ++state;
      return;
    }
    let index = tuple.length ? tuple[tuple.length - 1] + 1 : 0;
    for (; index < kPositions; ++index) {
      if (mask[index]) continue;
      mask[index] = 1;
      tuple.push(index);
      generate(tuple, mask);
      tuple.pop();
      mask[index] = 0;
    }
  }
  generate();
  kTupleMaskToState = tuple_to_state;
  kStateToTuple = state_to_tuple;
  kStatesNum = state;

  // Calculate a threshold for the optimisation to avoid BigInt arithmetics.
  // x * kStatesNum + kStatesNum <= Number.MAX_SAFE_INTEGER
  // x <= Number.MAX_SAFE_INTEGER / kStatesNum - 1;
  kBigIntsThreshold = Math.floor(Number.MAX_SAFE_INTEGER / kStatesNum) - 1;
}

function parseInput(input) {
  let chars = input.trim().split('\n').map(row => row.trim().split(''));
  chars = [].concat(...chars)
    .filter(ch => ch != '.' && ch != '#')
    .map(ch => 'ABCD'.indexOf(ch));
  let board = [[], [], [], []];
  for (let i = 0; i < chars.length; ++i) {
    board[chars[i]].push(i + 11);
  }
  return [].concat(...board);
}

function tupleToTupleMask(tuple) {
  return tuple.reduce((x, y) => x |= 1 << y, 0);
}

function boardToState(board) {
  let state = 0;
  for (let i = board.length - 1, mask = 0; i >= 0; --i) {
    mask |= 1 << board[i];
    if ((i % kTupleSize) == 0) {
      let local = kTupleMaskToState.get(mask);
      // Try to avoid BigInt arithmetics when possible.
      if (state <= kBigIntsThreshold) {
        state = state * kStatesNum + local;
        console.assert(state <= Number.MAX_SAFE_INTEGER, state, board);
      } else {
        state = BigInt(state) * BigInt(kStatesNum) + BigInt(local);
      }
      mask = 0;
    }
  }
  return state;
}

function getKindFromIndex(index) {
  return Math.floor(index / kTupleSize);
}

function makeNextMoves(board) {
  let mask = Array(kPositions).fill(-1);
  board.forEach((pos, index) => mask[pos] = getKindFromIndex(index));

  let moves = [];
  for (let index = 0; index < board.length; ++index) {
    let pos = board[index];
    const kind = getKindFromIndex(index);

    // Moving from the hallway into a room.
    if (pos < 11) {
      let targets = Array(kTupleSize).fill(0)
        .map((_, index) => 11 + kind + index * 4);
      if (mask[targets[0]] != -1) continue;
      if (targets.some(target => mask[target] != -1 && mask[target] != kind)) {
        continue;
      }

      let cost = 0;
      for (let step = 1; pos - step >= 0; ++step) {
        cost += kMoveCosts[kind];
        let curr = pos - step;
        if (mask[curr] != -1) break;
        if ((curr & 1) == 0 && 2 <= curr && curr <= 8) {
          if ((curr >> 1) != kind + 1) continue;
          for (let h = 0; h < targets.length; ++h) {
            if (mask[targets[h]] != -1) break;
            cost += kMoveCosts[kind];
            curr = targets[h];
          }
          [curr, board[index]] = [board[index], curr];
          moves.push([[...board], boardToState(board), cost]);
          board[index] = curr;
          break;
        }
      }

      cost = 0;
      for (let step = 1; pos + step < 11; ++step) {
        cost += kMoveCosts[kind];
        let curr = pos + step;
        if (mask[curr] != -1) break;
        if ((curr & 1) == 0 && 2 <= curr && curr <= 8) {
          if ((curr >> 1) != kind + 1) continue;
          for (let h = 0; h < targets.length; ++h) {
            if (mask[targets[h]] != -1) break;
            cost += kMoveCosts[kind];
            curr = targets[h];
          }
          [curr, board[index]] = [board[index], curr];
          moves.push([[...board], boardToState(board), cost]);
          board[index] = curr;
          break;
        }
      }
      
      continue;
    }

    // Moving from a room up to the hallway.
    let cost = 0;
    while (pos >= 15) {
      if (mask[pos - 4] != -1) {
        cost = -1;
        break;
      }
      cost += kMoveCosts[kind];
      pos -= 4;
    }
    if (cost < 0) continue;
    if (pos >= 11) {
      let above = (pos - 11) * 2 + 2;
      if (mask[above] != -1) continue;
      cost += kMoveCosts[kind];
      pos = above;
    }

    // Moving left along the hallway.
    let saved_cost = cost;
    for (let step = 1; pos - step >= 0; ++step) {
      cost += kMoveCosts[kind];
      let curr = pos - step;
      if (mask[curr] != -1) break;
      if ((curr & 1) == 0 && 2 <= curr && curr <= 8) continue;
      [curr, board[index]] = [board[index], curr];
      moves.push([[...board], boardToState(board), cost]);
      board[index] = curr;
    }

    // Moving right along the hallway.
    cost = saved_cost;
    for (let step = 1; pos + step < 11; ++step) {
      cost += kMoveCosts[kind];
      let curr = pos + step;
      if (mask[curr] != -1) break;
      if ((curr & 1) == 0 && 2 <= curr && curr <= 8) continue;
      [curr, board[index]] = [board[index], curr];
      moves.push([[...board], boardToState(board), cost]);
      board[index] = curr;
    }
  }

  return moves;
}

function generateFinalBoard() {
  let board = [];
  for (let i = 0; i < 4; ++i) {
    let pos = 11 + i;
    for (let j = 0; j < kTupleSize; ++j, pos += 4) {
      board.push(pos);
    }
  }
  return board;
}

function arrangeBoard(board) {
  precalculateConstants(board.length / 4);

  let state = boardToState(board);
  let final_state = boardToState(generateFinalBoard());

  let queue = new Heap([[board, state, 0]], (s1, s2) => s1[2] - s2[2]);
  let seen = new Set();

  while (queue.length > 0) {
    let [board, state, cost] = queue.pop();
    if (state == final_state) return cost;
    if (seen.has(state)) continue;
    seen.add(state);

    makeNextMoves(board).forEach(([new_board, new_state, new_cost]) => {
      if (!seen.has(new_state)) {
        queue.push([new_board, new_state, cost + new_cost]);
      }
    });
  }
  return -1;
}

function solve(input) {
  let answer1 = arrangeBoard(parseInput(input));

  input = input.trim().split('\n');
  input.splice(3, 0, '  #D#C#B#A#  ', '  #D#B#A#C#  ');
  input = input.join('\n');
  let answer2 = arrangeBoard(parseInput(input));

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

