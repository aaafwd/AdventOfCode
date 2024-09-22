// https://adventofcode.com/2022/day/15
// --- Day 15: Beacon Exclusion Zone ---
//
// Also see: https://adventofcode.com/2018/day/23
//
// Runtime: 137.265869140625 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  const regex = /^Sensor at x=([-\d]+), y=([-\d]+): closest beacon is at x=([-\d]+), y=([-\d]+)$/;
  return input.trim()
    .split('\n')
    .map(line => {
      let [, sx, sy, bx, by] = line.trim().match(regex);
      return [sx, sy, bx, by].map(Number);
    });
}

function countNoBeaconCells(sensors, rowY) {
  let intervals = [];
  for (let [sx, sy, bx, by] of sensors) {
    let distance = Math.abs(bx - sx) + Math.abs(by - sy);
    let dy = Math.abs(sy - rowY);
    let dx = distance - dy;
    if (dx < 0) continue;
    intervals.push([sx - dx, sx + dx]);
  }
  intervals.sort(([a1, b1], [a2, b2]) => {
    if (a1 != a2) return a1 - a2;
    return b2 - b1;
  });
  let last = 0;
  for (let i = 1; i < intervals.length; ++i) {
    let [a1, b1] = intervals[last];
    let [a2, b2] = intervals[i];
    if (a2 <= b1) {
      intervals[last] = [a1, Math.max(b1, b2)];
    } else {
      intervals[last++] = intervals[i];
    }
  }
  intervals.length = last + 1;
  let beacons = sensors
    .filter(([sx, sy, bx, by]) => by == rowY)
    .map(([sx, sy, bx, by]) => bx);
  let result = intervals
    .map(([a, b]) => b - a + 1)
    .reduce((a, b) => a + b);
  result -= new Set(beacons).size;
  return result;
}

// Rectangle area.
//
//    +---------------(x2,y2)
//    |                  |
//    |                  |
// (x1,y1)---------------+
//
class Rect {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  split() {
    let sx = Math.floor((this.x2 - this.x1 + 1) / 2);
    let sy = Math.floor((this.y2 - this.y1 + 1) / 2);
    console.assert(sx > 0 || sy > 0);
    let rects = [];
    if (sx > 0 && sy > 0) {
      rects.push(new Rect(this.x1, this.y1, this.x1 + sx - 1, this.y1 + sy - 1));
    }
    if (sy > 0) {
      rects.push(new Rect(this.x1 + sx, this.y1, this.x2, this.y1 + sy - 1));
    }
    if (sx > 0) {
      rects.push(new Rect(this.x1, this.y1 + sy, this.x1 + sx - 1, this.y2));
    }
    rects.push(new Rect(this.x1 + sx, this.y1 + sy, this.x2, this.y2));
    console.assert(rects.length > 1);
    return rects;
  }

  area() {
    return (this.x2 - this.x1 + 1) * (this.y2 - this.y1 + 1);
  }
}

class Sensor {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }

  containsFully(rect) {
    return this.inRange([rect.x1, rect.y1]) &&
      this.inRange([rect.x2, rect.y2]) &&
      this.inRange([rect.x1, rect.y2]) &&
      this.inRange([rect.x2, rect.y1]);
  }

  intersects(rect) {
    let [x, y] = this.center;
    let rowY = y;
    if (y < rect.y1) rowY = rect.y1;
    else if (y > rect.y2) rowY = rect.y2;
    let dy = Math.abs(y - rowY);
    let dx = this.radius - dy;
    if (dx < 0) return false;
    return isIntervalsOverlap(rect.x1, rect.x2, x - dx, x + dx);
  }

  inRange(point) {
    return getDistance(this.center, point) <= this.radius;
  }
}

function getDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function isIntervalsOverlap(a1, b1, a2, b2) {
  return Math.max(a1, a2) <= Math.min(b1, b2);
}

function findDistress(rect, sensors) {
  if (rect.area() == 1) {
    if (sensors.some(sensor => sensor.intersects(rect))) {
      return null;
    }
    return [rect.x1, rect.y1];
  }
  if (sensors.length == 1) {
    let sensor = sensors[0];
    if (sensor.containsFully(rect)) return null;
    if (!sensor.inRange([rect.x1, rect.y1])) return [rect.x1, rect.y1];
    if (!sensor.inRange([rect.x2, rect.y2])) return [rect.x2, rect.y2];
    if (!sensor.inRange([rect.x1, rect.y2])) return [rect.x1, rect.y2];
    if (!sensor.inRange([rect.x2, rect.y1])) return [rect.x2, rect.y1];
    console.assert(false);
    return null;
  }
  if (sensors.some(sensor => sensor.containsFully(rect))) {
    return null;
  }
  let rects = rect.split();
  for (let subrect of rects) {
    let subsensors = sensors.filter(sensor => sensor.intersects(subrect));
    let result = findDistress(subrect, subsensors);
    if (result != null) return result;
  }
  return null;
}

function solve(input, rowY) {
  let sensors = parseInput(input);

  let answer1 = countNoBeaconCells(sensors, rowY);

  sensors = sensors.map(([sx, sy, bx, by]) => {
    let radius = Math.abs(bx - sx) + Math.abs(by - sy);
    return new Sensor([sx, sy], radius);
  });
  let [x, y] = findDistress(new Rect(0, 0, 4000000, 4000000), sensors);
  let answer2 = x * 4000000 + y;

  console.log('Answer 1:', answer1, 'Answer 2:', answer2, "(at: " + x + ", " + y + ")");
}

solve(`
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`, 10);

solve(document.body.textContent, 2000000);

console.timeEnd('Runtime');
})();

