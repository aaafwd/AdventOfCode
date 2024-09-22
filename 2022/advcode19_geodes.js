// https://adventofcode.com/2022/day/19
// --- Day 19: Not Enough Minerals ---
// Runtime: 16140.22998046875 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  const regex = new RegExp(
    "Blueprint (\\d+):\\s*" +
    "Each ore robot costs (\\d+) ore.\\s*" +
    "Each clay robot costs (\\d+) ore.\\s*" +
    "Each obsidian robot costs (\\d+) ore and (\\d+) clay.\\s*" +
    "Each geode robot costs (\\d+) ore and (\\d+) obsidian.",
    "g");
  let blueprints = [];
  let match;
  let lastIndex = 0;
  while ((match = regex.exec(input)) !== null) {
    let [, id, ore1, ore2, ore3, clay3, ore4, obsidian4] = match.map(Number);
    console.assert(id == blueprints.length + 1);
    blueprints.push([ore1, ore2, ore3, ore4, clay3, obsidian4]);
    lastIndex = regex.lastIndex;
  }
  console.assert(input.substring(lastIndex).trim() == "");
  return blueprints;
}

function getMaxGeode(blueprint, minutes) {
  let maxGeode = 0;
  let seen = Array(minutes).fill(0).map(_ => new Set());
  generateMinutes([0, 0, 0, 0], [1, 0, 0, 0], minutes, 0);
  return maxGeode;

  function generateMinutes(res, robots, minutes) {
    if (minutes == 0) {
      maxGeode = Math.max(maxGeode, res[3]);
      // console.log(""+blueprint,maxGeode);
      return;
    }
    let upper = getGeodeUpperBound(res, robots, minutes);
    if (maxGeode >= upper) {
      return;
    }

    let key = getCacheKey(res, robots);
    if (seen[minutes - 1].has(key)) return;
    seen[minutes - 1].add(key);

    for (let spawn = 0; spawn < 4; ++spawn) {
      if (!spawnRobot(res, robots, spawn)) continue;
      for (let i = 0; i < 4; ++i) res[i] += robots[i];
      res[spawn]--;

      generateMinutes(res, robots, minutes - 1);
      
      res[spawn]++;
      for (let i = 0; i < 4; ++i) res[i] -= robots[i];
      unspawnRobot(res, robots, spawn);
    }
    for (let i = 0; i < 4; ++i) res[i] += robots[i];
    generateMinutes(res, robots, minutes - 1);
    for (let i = 0; i < 4; ++i) res[i] -= robots[i];
  }

  function getCacheKey(res, robots) {
    const kMaxRes = 512; // 9 bits
    const kMaxRobots = 32; // 5 bits
    let key = 0;
    for (let i = 0; i < 4; ++i) {
      console.assert(res[i] < kMaxRes);
      key = key * kMaxRes + res[i];
    }
    for (let i = 0; i < 4; ++i) {
      console.assert(robots[i] < kMaxRobots);
      key = key * kMaxRobots + robots[i];
    }
    return key;
  }

  function spawnRobot(res, robots, spawn) {
    // blueprint = [ore1, ore2, ore3, ore4, clay3, obsidian4]
    let canSpawn = (res[0] >= blueprint[spawn]);
    if (spawn == 2) {
      canSpawn = canSpawn && (res[1] >= blueprint[4]);
    } else if (spawn == 3) {
      canSpawn = canSpawn && (res[2] >= blueprint[5]);
    }
    if (!canSpawn) return false;
    res[0] -= blueprint[spawn];
    if (spawn == 2) {
      res[1] -= blueprint[4];
    } else if (spawn == 3) {
      res[2] -= blueprint[5];
    }
    robots[spawn]++;
    return true;
  }

  function unspawnRobot(res, robots, spawn) {
    res[0] += blueprint[spawn];
    if (spawn == 2) {
      res[1] += blueprint[4];
    } else if (spawn == 3) {
      res[2] += blueprint[5];
    }
    robots[spawn]--;
  }

  function getGeodeUpperBound(res, robots, minutes) {
    // blueprint = [ore1, ore2, ore3, ore4, clay3, obsidian4]
    let ore = res[0] + robots[0] * minutes;
    let dOre = minutes - 1 - blueprint[0];
    if (dOre > 0) ore += (1 + dOre) * dOre / 2;

    let clay = res[1] + robots[1] * minutes;
    let dClay = Math.min(minutes - 1, Math.floor(ore / blueprint[1]));
    clay += (minutes*2 - 1 - dClay) * dClay / 2;

    let obsidian = res[2] + robots[2] * minutes;
    let dObsidian = Math.min(
      minutes - 1,
      Math.floor(ore / blueprint[2]),
      Math.floor(clay / blueprint[4]));
    obsidian += (minutes*2 - 1 - dObsidian) * dObsidian / 2;

    let geode = res[3] + robots[3] * minutes;
    let dGeode = Math.min(
      minutes - 1,
      Math.floor(ore / blueprint[3]),
      Math.floor(obsidian / blueprint[5]));
    geode += (minutes*2 - 1 - dGeode) * dGeode / 2;

    return geode;
  }
}

function solve(input) {
  let blueprints = parseInput(input);

  let answer1 = blueprints
    .map(blueprint => getMaxGeode(blueprint, 24))
    .map((geodes, index) => geodes * (index + 1))
    .reduce((a, b) => a + b);
  console.log('Answer 1:', answer1);

  let answer2 = blueprints
    .filter((_, index) => index < 3)
    .map(blueprint => getMaxGeode(blueprint, 32));

  console.log('Answer 2:', answer2.reduce((a, b) => a * b, 1), answer2);
}

solve(`
Blueprint 1:
  Each ore robot costs 4 ore.
  Each clay robot costs 2 ore.
  Each obsidian robot costs 3 ore and 14 clay.
  Each geode robot costs 2 ore and 7 obsidian.

Blueprint 2:
  Each ore robot costs 2 ore.
  Each clay robot costs 3 ore.
  Each obsidian robot costs 3 ore and 8 clay.
  Each geode robot costs 3 ore and 12 obsidian.
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

