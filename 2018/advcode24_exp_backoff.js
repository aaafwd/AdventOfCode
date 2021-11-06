// https://adventofcode.com/2018/day/24
// --- Day 24: Immune System Simulator 20XX ---
//
// Runtime: 212.947021484375 ms

(function() {
console.time("Runtime");

function parseInput(input) {
  let parts = input.trim().split('\n\n').map(str => str.trim()).sort();
  const regex_line =
    /^(\d+) units each with (\d+) hit points (?:\((.*)\))?\s*with an attack that does (\d+) (\w+) damage at initiative (\d+)$/;
  let armies = [];
  for (let part of parts) {
    let lines = part.split('\n');
    lines.shift();
    let army = [];
    for (let line of lines) {
      let weaknesses = [];
      let immunes = [];
      let [, units, hp, specialties, damage, damage_kind, initiative] = line.match(regex_line);
      specialties = specialties ? specialties.split(';').map(str => str.trim()) : [];
      for (let sp of specialties) {
        if (sp.startsWith('weak to ')) {
          weaknesses = sp.substr(8).split(',').map(str => str.trim());
        } else if (sp.startsWith('immune to ')) {
          immunes = sp.substr(10).split(',').map(str => str.trim());
        } else {
          console.assert(0, line);
        }
      }
      army.push({units: +units,
                 hp: +hp,
                 weaknesses,
                 immunes,
                 damage: +damage,
                 damage_kind,
                 initiative: +initiative});
    }
    armies.push(army);
  }
  return armies;
}

function simulateWar(army1, army2, boost_damage1 = 0) {
  // Shallow clone of the input data.
  [army1, army2] = [army1, army2].map(army => army.map(x => ({...x})));
  if (boost_damage1) {
    army1.forEach(group => group.damage += boost_damage1);
  }

  while (army1.length > 0 && army2.length > 0) {
    // Sort for target selection phase.
    [army1, army2].forEach(army => army.sort((g1, g2) => {
      let pw1 = g1.units * g1.damage;
      let pw2 = g2.units * g2.damage;
      return (pw1 == pw2) ? g2.initiative - g1.initiative : pw2 - pw1;
    }));

    // Target selection phase.
    for (let k = 0; k < 2; ++k) {
      let selected = Array(army2.length).fill(0);
      for (let group of army1) {
        group.target = null;
        let max_damage = -1;
        let selected_index = -1;
        for (let i = 0; i < army2.length; ++i) {
          if (selected[i]) continue;
          let target = army2[i];
          let damage = group.units * group.damage;
          if (target.immunes.indexOf(group.damage_kind) >= 0) {
            damage = 0;
          } else if (target.weaknesses.indexOf(group.damage_kind) >= 0) {
            damage *= 2;
          }
          if (damage == 0) continue;
          if (damage > max_damage) {
            max_damage = damage;
            group.target = target;
            selected_index = i;
            continue;
          }
          if (damage == max_damage) {
            let current_pw = group.target.units * group.target.damage;
            let target_pw = target.units * target.damage;
            if (target_pw > current_pw ||
                (target_pw == current_pw && target.initiative > group.target.initiative)) {
              group.target = target;
              selected_index = i;
            }
          }
        }
        if (selected_index >= 0) selected[selected_index] = 1;
      }
      [army1, army2] = [army2, army1];
    }

    // Attacking phase.
    let total_killed = 0;
    let all_groups = army1.concat(army2)
        .filter(g => g.target != null)
        .sort((g1, g2) => g2.initiative - g1.initiative);
    for (let group of all_groups) {
      let target = group.target;
      let damage = group.units * group.damage;
      if (target.weaknesses.indexOf(group.damage_kind) >= 0) {
        damage *= 2;
      }
      if (damage == 0) continue;
      let killed_units = Math.floor(damage / target.hp);
      total_killed += killed_units;
      target.units -= killed_units;
      if (target.units < 0) target.units = 0;
    }
    if (total_killed == 0) break;

    // Remove destroyed groups.
    [army1, army2].forEach(army => {
      for (let i = 0; i < army.length; ++i) {
        if (army[i].units == 0) army.splice(i--, 1);
      }
    });
  }

  let total_units = [army1, army2].map(army => army.map(g => g.units).reduce((x, y) => x + y, 0));
  return total_units;
}

function expBackoffBinarySearch(callback) {
  let left = 0;
  let right = 1;
  while (!callback(right)) {
    left = right;
    right <<= 1;
  }
  while (left + 1 < right) {
    let middle = Math.floor((left + right) / 2);
    if (callback(middle)) {
      right = middle;
    } else {
      left = middle;
    }
  }
  console.assert(left + 1 == right);
  return right;
}

function solve(input) {
  let [army1, army2] = parseInput(input);

  let [, answer1] = simulateWar(army1, army2);
  let answer2 = -1;

  expBackoffBinarySearch(boost => {
    let [units1, units2] = simulateWar(army1, army2, boost);
    if (units2 > 0) return false;
    answer2 = units1;
    return true;
  });

  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4
`);

solve(document.body.textContent);

console.timeEnd("Runtime");
})();

