// https://adventofcode.com/2018/day/15
// --- Day 15: Beverage Bandits ---
//
// Runtime: 436.68408203125 ms

(function() {
console.time("Runtime");

function simulate(map, elf_boost = 0) {
  const [Y, X] = [map.length, map[0].length];
  const vectors = [[0, -1], [-1, 0], [1, 0], [0, 1]];
  let goblins = [];
  let elfs = [];
  let elfsTotalHp = 0;
  let goblinsTotalHp = 0;
  let eliminatedElfs = 0;
  for (let y = 0; y < Y; ++y) {
    for (let x = 0; x < X; ++x) {
      if (map[y][x] == 'E') {
        elfs.push(map[y][x] = {x, y, hp: 200, isgoblin: false, power: 3 + elf_boost});
        elfsTotalHp += 200;
      } else if (map[y][x] == 'G') {
        goblinsTotalHp += 200;
        goblins.push(map[y][x] = {x, y, hp: 200, isgoblin: true, power: 3});
      }
    }
  }

  function getAttackTarget(unit) {
    let target = undefined;
    for (let [dx, dy] of vectors) {
      let nx = unit.x + dx;
      let ny = unit.y + dy;
      let enemy = map[ny][nx];
      if (!enemy || typeof enemy == 'string') continue;
      if (unit.isgoblin == enemy.isgoblin) continue;
      if (!target || target.hp > enemy.hp) {
        target = enemy;
      }
    }
    return target;
  }

  function doAttack(unit, target) {
    let hp = Math.min(unit.power, target.hp);
    console.assert(hp > 0);
    target.hp -= hp;
    if (target.hp <= 0) {
      map[target.y][target.x] = '.';
      if (!target.isgoblin) ++eliminatedElfs;
    }
    if (target.isgoblin) {
      goblinsTotalHp -= hp;
    } else {
      elfsTotalHp -= hp;
    }
    return true;
  }

  function maybeMove(unit) {
    let prevStep = Array(Y).fill().map(() => Array(X).fill());
    prevStep[unit.y][unit.x] = [0, 0];

    function doMove(x, y) {
      while (1) {
        let [dx, dy] = prevStep[y][x];
        let nx = x - dx;
        let ny = y - dy;
        if (unit.x == nx && unit.y == ny) {
          console.assert(map[y][x] == '.');
          map[unit.y][unit.x] = '.';
          unit.x = x;
          unit.y = y;
          map[unit.y][unit.x] = unit;
          break;
        }
        [x, y] = [nx, ny];
      }
    }

    let queue = [[unit.x, unit.y]];
    let target = undefined;
    let wave = 1;
    while (queue.length) {
      let [x, y] = queue.shift();
      for (let [dx, dy] of vectors) {
        let nx = x + dx;
        let ny = y + dy;
        if (prevStep[ny][nx]) continue;
        let enemy = map[ny][nx];
        if (enemy && typeof enemy != 'string' &&
            enemy.isgoblin != unit.isgoblin) {
          if (!target || y < target.y || (y == target.y && x < target.x)) {
            target = {x, y};
          }
        }
        if (map[ny][nx] != '.') continue;
        queue.push([nx, ny]);
        prevStep[ny][nx] = [dx, dy];
      }
      --wave;
      if (!wave) {
        if (target) break;
        wave = queue.length;
      }
    }
    if (target) {
      doMove(target.x, target.y);
      return true;
    }
    return false;
  }

  let rounds = 0;
  while (elfsTotalHp && goblinsTotalHp) {
    let queue = [];
    for (let y = 0; y < map.length; ++y) {
      for (let x = 0; x < map[y].length; ++x) {
        if (typeof map[y][x] == 'string') continue;
        queue.push(map[y][x]);
      }
    }
    while (queue.length) {
      let unit = queue.shift();
      if (unit.hp <= 0) continue;
      if (!elfsTotalHp || !goblinsTotalHp) {
        --rounds;
        break;
      }
      let target = getAttackTarget(unit);
      if (target) {
        doAttack(unit, target);
        continue;
      }
      maybeMove(unit);
      target = getAttackTarget(unit);
      if (target) {
        doAttack(unit, target);
      }
    }
    ++rounds;
  }
  let answer = rounds * (elfsTotalHp + goblinsTotalHp);
  return {rounds, elfsTotalHp, goblinsTotalHp, eliminatedElfs, answer};
}

function solve(input) {
  let map = input.trim().split('\n').map(row => row.split(''));

  let map_copy = map.map(x => Array.from(x));
  let {answer} = simulate(map_copy, 0);
  console.log("Answer 1:", answer);

  for (let elf_boost = 1 ;; ++elf_boost) {
    let map_copy = map.map(x => Array.from(x));
    let {eliminatedElfs, answer} = simulate(map_copy, elf_boost);
    if (!eliminatedElfs) {
      console.log("Answer 2:", answer);
      break;
    }
  }
}

solve(`
#######   
#.G...#
#...EG#
#.#.#G#
#..G#E#
#.....#   
#######
`);

solve(`
#######   
#G..#E#   
#E#E.E#   
#G.##.#  
#...#E#  
#...E.#  
#######
`);

solve(`
####### 
#E..EG# 
#.#G.E# 
#E.##E# 
#G..#.#    
#..E#.#    
####### 
`);

solve(`
#######  
#E.G#.#  
#.#G..#  
#G.#.G#  
#G..#.#   
#...E.#   
#######   
`);

solve(`
#######  
#.E...#  
#.#..G#  
#.###.#  
#E#G#G#  
#...#G#  
#######  
`);

solve(`
#########     
#G......#     
#.E.#...#    
#..##..G#   
#...##..#  
#...#...#  
#.G...G.#  
#.....G.#  
#########  
`);

solve(document.body.textContent);

console.timeEnd("Runtime");
})();

