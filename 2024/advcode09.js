// https://adventofcode.com/2024/day/9
// --- Day 9: Disk Fragmenter ---
// Runtime: 12.60302734375 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  return input.trim().split('');
}

function unmapToDisk(diskmap) {
  let disk = [];
  let fileId = 0;
  for (let i = 0; i < diskmap.length; ++i) {
    let isFile = ((i & 1) == 0);
    let id = isFile ? fileId++ : -1;
    for (let count = diskmap[i]; count > 0; --count) {
      disk.push(id);
    }
  }
  return disk;
}

function moveBlocks(disk) {
  disk = disk.slice();
  for (let left = 0, right = disk.length - 1; left < right; --right) {
    if (disk[right] == -1) continue;
    while (left < right && disk[left] != -1) {
      ++left;
    }
    if (left >= right) break;
    disk[left++] = disk[right];
    disk[right] = -1;
  }
  return disk;
}

function checksum(disk) {
  let result = 0;
  for (let i = 0; i < disk.length; ++i) {
    if (disk[i] == -1) continue;
    result += i * disk[i];
  }
  return result;
}

function findFirstContinuousSpace(disk, fileSize, diskSize, offset = 0) {
  for (let i = offset; i < diskSize; ++i) {
    if (disk[i] != -1) continue;
    let size = 1;
    while (1) {
      if (size >= fileSize) return i;
      if (i + size >= diskSize) break;
      if (disk[i + size] != -1) break;
      ++size;
    }
  }
  return -1;
}

function findLastContinuousFile(disk, offset) {
  for (let i = offset - 1; i > 0; --i) {
    if (disk[i] == -1) continue;
    let start = i;
    while (start >= 0 && disk[start] == disk[i]) {
      --start;
    }
    let size = i - start;
    ++start;
    return [start, size];
  }
  return [-1, -1];
}

function moveWholeFiles(disk) {
  disk = disk.slice();

  // Cache the left offsets of the empty spaces.
  // This improves the runtime by ~40x on the given input!
  // Before: Runtime: 480.47705078125 ms
  // After:  Runtime: 12.60302734375 ms
  let leftOffsets = [0];

  for (let rightOffset = disk.length; rightOffset > 0;) {
    let [start, size] = findLastContinuousFile(disk, rightOffset);
    if (start == -1) break;
    rightOffset = start;
    console.assert(size < 10);
    for (let i = 1; i <= size; ++i) {
      leftOffsets[i] = Math.max(leftOffsets[i] || 0, leftOffsets[i - 1]);
    }
    let left = findFirstContinuousSpace(disk, size, start, leftOffsets[size]);
    if (left == -1) continue;
    for (let i = 0; i < size; ++i, ++left, ++start) {
      console.assert(disk[left] == -1);
      console.assert(disk[start] != -1);
      disk[left] = disk[start];
      disk[start] = -1;
    }
    leftOffsets[size] = left;
  }
  return disk;
}

function solve(input) {
  let diskmap = parseInput(input);
  let disk = unmapToDisk(diskmap);

  let answer1 = checksum(moveBlocks(disk));
  let answer2 = checksum(moveWholeFiles(disk));

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
2333133121414131402
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

