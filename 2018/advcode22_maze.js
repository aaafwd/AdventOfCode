// https://adventofcode.com/2018/day/22
// --- Day 22: Mode Maze ---
//
// Runtime: 948.843994140625 ms

(function() {
console.time("Runtime");

function cacheKey(x, y, p) {
  return (x << 16) | (y << 2) | p;
}

function solve(depth, [tx, ty]) {
  const MOD = 20183;

  let geoIndexCache = {};
  geoIndexCache[ty] = {};
  geoIndexCache[ty][tx] = 0;
  function getGeoIndex(x, y) {
    if (x == 0) return (y * 48271) % MOD;
    if (y == 0) return (x * 16807) % MOD;
    geoIndexCache[y] = geoIndexCache[y] || {};
    if (geoIndexCache[y][x] === undefined) {
      geoIndexCache[y][x] = (getErosion(x - 1, y) * getErosion(x, y - 1)) % MOD;
    }
    return geoIndexCache[y][x];
  }
  function getErosion(x, y) {
    return (getGeoIndex(x, y) + depth) % MOD;
  }
  function getKind(x, y) {
    // 0 = rocky
    // 1 = wet
    // 2 = narrow
    return getErosion(x, y) % 3;
  }

  let total_risk = 0;
  for (let y = 0; y <= ty; ++y) {
    for (let x = 0; x <= tx; ++x) {
      total_risk += getKind(x, y);
    }
  }
  console.log("Answer 1:", total_risk);

  // 0 = climbing gear
  // 1 = torch
  // 2 = neither
  // rocky(0) => {0,1}
  // wet(1) => {0,2}
  // narrow(2) => {1,2}
  // START: x=0,y=0,p=1(torch)
  // END: tx,ty,p=1(torch)
  // move == 1 minute
  // switch p == 7 minutes

  function checkIsCompatible(x, y, p) {
    let kind = getKind(x, y);
    if (kind == 0) return p != 2;
    if (kind == 1) return p != 1;
    if (kind == 2) return p != 0;
    console.assert(0, 'Wrong kind: ', kind, x, y);
  }

  let queue = [[0, 0, 1]];  // [x, y, p]
  let visited = {};
  let wave = visited[cacheKey(...queue[0])] = 0;
  let nextQueues = {};
  while (1) {
    let [x, y, p] = queue.shift();
    if (x == tx && y == ty && p == 1) {
      break;
    }
    if (visited[cacheKey(x, y, p)] == wave) {
      for (let [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
        let [nx, ny, np] = [x + dx, y + dy, p];
        if (nx < 0 || ny < 0) continue;
        if (!checkIsCompatible(nx, ny, np)) continue;
        let key = cacheKey(nx, ny, np);
        if (visited[key] !== undefined && visited[key] <= wave + 1) {
          continue;
        }
        visited[key] = wave + 1;
        nextQueues[wave + 1] = nextQueues[wave + 1] || [];
        nextQueues[wave + 1].push([nx, ny, np]);
      }
      for (let dp = 1; dp < 3; ++dp) {
        let np = (p + dp) % 3;
        if (!checkIsCompatible(x, y, np)) continue;
        let key = cacheKey(x, y, np);
        if (visited[key] !== undefined && visited[key] <= wave + 7) {
          continue;
        }
        visited[key] = wave + 7;
        nextQueues[wave + 7] = nextQueues[wave + 7] || [];
        nextQueues[wave + 7].push([x, y, np]);
      }
    } else {
      console.assert(visited[cacheKey(x, y, p)] < wave);
    }
    if (queue.length == 0) {
      ++wave;
      while (!nextQueues[wave]) ++wave;
      queue = nextQueues[wave];
    }
  }
  console.log("Answer 2:", wave);
}

solve(510, [10, 10]);
solve(4845, [6, 770]);

console.timeEnd("Runtime");
})();

