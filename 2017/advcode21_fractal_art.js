// https://adventofcode.com/2017/day/21
// --- Day 21: Fractal Art ---
//
// Runtime: 824.258056640625 ms

(function() {
console.time("Runtime");

function newMap(size) {
  return Array(size).fill(0).map(_ => Array(size).fill('.'));
}

function patternToMap(pattern) {
  return pattern.trim().split('/').map(row => row.split(''));
}

function mapToPattern(map) {
  return map.map(row => row.join('')).join('/');
}

function rotate90(map) {
  let nmap = newMap(map.length);
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      let ny = x;
      let nx = map.length - 1 - y;
      nmap[ny] = nmap[ny] || [];
      nmap[ny][nx] = map[y][x];
    }    
  }
  return nmap;
}

function flip(map) {
  let nmap = newMap(map.length);
  for (let y = 0; y < map.length; ++y) {
    for (let x = 0; x < map[y].length; ++x) {
      let ny = y;
      let nx = map[y].length - 1 - x;
      nmap[ny] = nmap[ny] || [];
      nmap[ny][nx] = map[y][x];
    }    
  }
  return nmap;
}

function getAllRotations(pattern) {
  let rotations = [];
  let map = patternToMap(pattern);
  for (let i = 0; i < 8; ++i) {
    map = rotate90(map);
    rotations.push(mapToPattern(map));
    if (i == 3) {
      map = flip(map);
    }
  }
  return rotations;
}

function parseTransformations(input) {
  let transformations = {};
  let lines = input.trim().split('\n');
  for (let line of lines) {
    let [pattern, replacement] = line.split(/\s*=>\s*/);
    let keys = getAllRotations(pattern);
    let replacement_map = patternToMap(replacement);
    for (let key of keys) {
      transformations[key] = replacement_map;
    }
  }
  return transformations;
}

function extractSubPattern(map, x, y, sq_size) {
  let pattern = [];
  for (let i = 0; i < sq_size; ++i) {
    pattern.push(map[y + i].slice(x, x + sq_size).join(''));
  }
  return pattern.join('/')
}

function insertSubPattern(map, ox, oy, sub_map) {
  for (let y = 0; y < sub_map.length; ++y) {
    for (let x = 0; x < sub_map[y].length; ++x) {
      let nx = ox + x;
      let ny = oy + y;
      map[ny] = map[ny] || [];
      map[ny][nx] = sub_map[y][x];
    }
  }
}

function runTransformations(map, transformations) {
  const sq_size = (map.length % 2 == 0) ? 2 : 3;
  const new_size = (map.length / sq_size) * (sq_size + 1);
  let nmap = newMap(new_size);

  for (let y = 0; y < map.length; y += sq_size) {
    let ny = (y / sq_size) * (sq_size + 1);
    for (let x = 0; x < map[y].length; x += sq_size) {
      let pattern = extractSubPattern(map, x, y, sq_size);
      let sub_map = transformations[pattern];
      // console.assert(sub_map && sub_map.length == sq_size + 1);

      let nx = (x / sq_size) * (sq_size + 1);
      insertSubPattern(nmap, nx, ny, sub_map);
    }
  }
  return nmap;
}

function solve(input, iterations) {
  let transformations = parseTransformations(input);

  let map = patternToMap('.#./..#/###');
  for (let i = 0; i < iterations; ++i) {
    map = runTransformations(map, transformations);
  }
  let answer = mapToPattern(map).replace(/[^#]/g, '').length;
  if (iterations == 18) {
    console.log("Answer 2:", answer);
  } else {
    console.log("Answer 1:", answer);
  }
}

solve(`
../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#
`, 2);

solve(document.body.textContent, 5);

solve(document.body.textContent, 18);

console.timeEnd("Runtime");
})();

