const kDirChars = "^>v<";
const kDirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];

function mapsNew(X, Y) { return Array(Y).fill(0).map(row => Array(X).fill('.')); }
function mapsFromString(str) { return str.trim().split('\n').map(row => row.trim().split('')); }
function mapsClone(map) { return map.slice().map(row => row.slice()); }
function mapsToString(map) { return map.map(row => row.join('')).join('\n'); }
function mapsPrint(map) { console.log(mapsToString(map)); }
function mapsInRange(map, x, y) { return 0 <= y && y < map.length && 0 <= x && x < map[y].length; }

function toKey(x, y) {
  console.assert(0 <= x && x <= 0x7fff && 0 <= y && y <= 0xffff, x, y);
  return (x << 16) | y;
}
function fromKey(key) { return [key >> 16, key & 0xffff]; }

function mapsFindChar(map, ch) {
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      if (map[y][x] == ch) return [x, y];
    }
  }
  console.assert(false, map, ch);
}

function mapsDirFromChar(ch) {
  let i = kDirChars.indexOf(ch);
  console.assert(0 <= i && i < kDirs.length, ch);
  return kDirs[i];
}

// Example usage.
function mapsIterateDirs(map, x, y) {
  for (let [dx, dy] of kDirs) {
    let nx = x + dx;
    let ny = y + dy;
    if (!mapsInRange(map, nx, ny)) continue;
    if (map[ny][nx] == '#') continue;
    // ...
  }
}

