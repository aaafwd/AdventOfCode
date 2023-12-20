// https://adventofcode.com/2023/day/5
// --- Day 5: If You Give A Seed A Fertilizer ---

(function() {

function parseInput(input) {
  let lines = input.trim().split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  let seeds = lines.shift().split(':')[1].trim().split(/\s+/).map(x => +x);
  let config = {seeds, maps: []};

  let ranges = [];
  for (let line of lines) {
    if (line.endsWith('map:')) {
      // Skip parsing source and destination assuming it's always consecutive:
      // seed-to-soil
      // soil-to-fertilizer
      // ...
      // humidity-to-location
      ranges = [];
      config.maps.push(ranges);
      continue;
    }
    let [a, b, len] = line.trim().split(/\s+/);
    ranges.push([+b, +a, +len]);
  }

  return config;
}

function applyRanges(seed, ranges) {
  for (let [from, to, len] of ranges) {
    if (from <= seed && seed < from + len) {
      return to + (seed - from);
    }
  }
  return seed;
}

function applyMappings(config) {
  let mapping = [];
  for (let seed of config.seeds) {
    let result = seed;
    for (let ranges of config.maps) {
      result = applyRanges(result, ranges);
    }
    mapping.push(result);
  }
  return mapping;
}

function applyRanges2(seeds, ranges) {
  let result = [];
  while (seeds.length > 0) {
    let [seed, slen] = seeds.shift();
    let found = false;
    for (let [from, to, len] of ranges) {
      let commonFrom = Math.max(from, seed);
      let commonRight = Math.min(from + len, seed + slen);
      if (commonFrom >= commonRight) continue;
      result.push([to + (commonFrom - from), commonRight - commonFrom]);
      // Re-enqueue the unmapped left part.
      if (seed < commonFrom) {
        seeds.push([seed, commonFrom - seed]);
      }
      // Re-enqueue the unmapped right part.
      if (commonRight < seed + slen) {
        seeds.push([commonRight, seed + slen - commonRight]);
      }
      found = true;
      break;
    }
    if (!found) result.push([seed, slen]);
  }
  return result;
}

function applyMappings2(config) {
  let mapping = [];
  console.assert(config.seeds.length % 2 == 0);
  for (let i = 0; i < config.seeds.length; i += 2) {
    let seed = config.seeds[i];
    let slen = config.seeds[i + 1];
    let result = [[seed, slen]];
    for (let ranges of config.maps) {
      result = applyRanges2(result, ranges);
    }
    mapping.push(result);
  }
  return mapping;
}

function solve(input) {
  let config = parseInput(input);

  let answer1 = applyMappings(config)
    .reduce((a, b) => Math.min(a, b));

  let answer2 = applyMappings2(config)
    .flatMap(arrays => arrays)
    .map(([seed, len]) => seed)
    .reduce((a, b) => Math.min(a, b));

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}
  
solve(`
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`);

solve(document.body.textContent);

})();

