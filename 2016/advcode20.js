// https://adventofcode.com/2016/day/20
// --- Day 20: Firewall Rules ---

(function() {

function sortAndMerge(intervals) {
  intervals.forEach(([x, y]) => console.assert(x <= y, x, y));
  intervals.sort(([x1, y1], [x2, y2]) => (x1 != x2) ? x1 - x2 : y2 - y1);

  let last = 0;
  for (let i = 1; i < intervals.length; ++i) {
    let [px, py] = intervals[last];
    let [nx, ny] = intervals[i];
    if (nx <= py + 1) {
      intervals[last][1] = Math.max(py, ny);
    } else {
      intervals[++last] = intervals[i];
    }
  }
  intervals.length = last + 1;
}

function solve(input) {
  let ips = input.trim().split('\n').map(row => row.split('-').map(x => +x));
  sortAndMerge(ips);

  let answer1 = ips[0][0] == 0 ? ips[1][0] - 1 : ips[0][0] - 1;

  let answer2 = 0;
  for (let i = 0, last = -1; i <= ips.length; ++i) {
    if (i == ips.length) {
      answer2 += 4294967295 - last;
    } else {
      let [x, y] = ips[i];
      answer2 += x - last - 1;
      last = y;
    }
  }

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(document.body.textContent);

})();

