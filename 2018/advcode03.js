// https://adventofcode.com/2018/day/3
// --- Day 3: No Matter How You Slice It ---

(function() {

function parseInput(input) {
  let rectangles = [];
  let lines = input.trim().split('\n');
  const regex = /^#(\d+)\s*@\s*(\d+),(\d+):\s*(\d+)x(\d+)\s*$/;
  for (let line of lines) {
    let [, id, left, top, width, height] = line.match(regex).map(x => +x);
    rectangles.push({id, left, top, width, height});
  }
  return rectangles;
}

function incMask(mask, x, y) {
  mask[y] = mask[y] || [];
  mask[y][x] = (mask[y][x] || 0) + 1;
}

function isIntersectIntervals(x1, y1, x2, y2) {
  return x2 < y1 && y2 > x1;
}

function isIntersectRects(rect1, rect2) {
  let [l1, r1] = [rect1.left, rect1.left + rect1.width];
  let [l2, r2] = [rect2.left, rect2.left + rect2.width];
  if (!isIntersectIntervals(l1, r1, l2, r2)) return false;
  [l1, r1] = [rect1.top, rect1.top + rect1.height];
  [l2, r2] = [rect2.top, rect2.top + rect2.height];
  if (!isIntersectIntervals(l1, r1, l2, r2)) return false;
  return true;
}

function solve(input) {
  let rectangles = parseInput(input);
  let mask = [];
  for (let rect of rectangles) {
    for (let x = 0; x < rect.width; ++x) {
      for (let y = 0; y < rect.height; ++y) {
        incMask(mask, rect.left + x, rect.top + y);
      }
    }
  }
  let answer1 = mask.map(row => row.filter(x => (x > 1)).length).reduce((x, y) => x + y);
  console.log("Answer 1:", answer1);

  let intersects = Array(rectangles.length).fill(0);
  for (let i = 0; i < rectangles.length; ++i) {
    for (let j = i + 1; j < rectangles.length; ++j) {
      if (isIntersectRects(rectangles[i], rectangles[j])) {
        intersects[i] = intersects[j] = 1;
      }
    }
  }
  for (let i = 0; i < intersects.length; ++i) {
    if (!intersects[i]) {
      console.log("Answer 2:", rectangles[i].id);
    }
  }
}

solve(`
#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
`)

solve(document.body.textContent);

})();

