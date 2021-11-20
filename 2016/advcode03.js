// https://adventofcode.com/2016/day/3
// --- Day 3: Squares With Three Sides ---

(function() {

function solve(input) {
  let triangles = input.trim().split('\n').map(row => row.trim().split(/\s+/).map(x => +x));

  let answer1 = 0;
  for (let [x, y, z] of triangles) {
    [x, y, z] = [x, y, z].sort((x, y) => x - y);
    if (x + y > z) ++answer1;
  }

  console.assert(triangles.length % 3 == 0);
  let edges = [];
  for (let i = 0; i < 3; ++i) {
    edges = edges.concat(triangles.map(triangle => triangle[i]));
  }
  let answer2 = 0;
  for (let i = 0; i < edges.length; i += 3) {
    let [x, y, z] = edges.slice(i, i + 3).sort((x, y) => x - y);
    if (x + y > z) ++answer2;
  }

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
101 301 501
102 302 502
103 303 503
201 401 601
202 402 602
203 403 603
`);

solve(document.body.textContent);

})();

