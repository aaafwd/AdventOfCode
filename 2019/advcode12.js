(function() {

function gcd(a, b) {
  while (a && b) {
    [a, b] = [b, a % b];
  }
  return a + b;
}

function lcm(a, b) {
  return a * b / gcd(a, b);
}

function lcmForAll() {
  let result = 1;
  for (let i = 0; i < arguments.length; ++i) {
    result = lcm(result, arguments[i]);
  }
  return result;
}

function simulate(steps, moons) {
  moons.forEach(m => {
    m.vel = [0, 0, 0];
  });

  function applyVelocity(m1, m2) {
    for (let i = 0; i < m1.pos.length; ++i) {
      if (m1.pos[i] == m2.pos[i]) continue;
      if (m1.pos[i] < m2.pos[i]) {
        ++m1.vel[i];
        --m2.vel[i];
      } else {
        ++m2.vel[i];
        --m1.vel[i];
      }
    }
  }

  function sumVec(v1, v2) {
    for (let i = 0; i < v1.length; ++i) {
      v1[i] += v2[i];
    }
  }

  function sumCoords(vec) {
    let sum = 0;
    for (let i = 0; i < vec.length; ++i) {
      sum += Math.abs(vec[i]);
    }
    return sum;
  }

  while (steps > 0) {
    --steps;
    for (let i = 0; moons[i]; ++i) {
      for (let j = i + 1; moons[j]; ++j) {
        applyVelocity(moons[i], moons[j]);
      }
    }
    for (let i = 0; moons[i]; ++i) {
      sumVec(moons[i].pos, moons[i].vel);
    }
  }

  let total = 0;
  for (let i = 0; moons[i]; ++i) {
    total += sumCoords(moons[i].pos) * sumCoords(moons[i].vel);
  }

  console.log('Answer: ', total);
}

function repeatCount(coords) {
  const X = coords.length;
  let state = [];
  for (let i = 0; i < X; ++i) {
    state.push(coords[i], 0);
  }

  let set = new Set();
  set.add(String(state));
  for (let round = 0; round < 10000000; ++round) {
    for (let i = 0; i < 2 * X; i += 2) {
      for (let j = i + 2; j < 2 * X; j += 2) {
        if (state[i] == state[j]) continue;
        if (state[i] < state[j]) {
          ++state[i + 1];
          --state[j + 1];
        } else {
          --state[i + 1];
          ++state[j + 1];
        }
      }
    }
    for (let i = 0; i < 2 * X; i += 2) {
      state[i] += state[i + 1];
    }
    let key = String(state);
    if (set.has(key)) return round + 1;
    set.add(key);
  }
  return -1;
}

// simulate(10, [
//     {pos: [-1, 0, 2]},
//     {pos: [2, -10, -7]},
//     {pos: [4, -8, 8]},
//     {pos: [3, 5, -1]},
// ]);

// simulate(100, [
//     {pos: [-8, -10, 0]},
//     {pos: [5, 5, 10]},
//     {pos: [2, -7, 3]},
//     {pos: [9, -8, -3]},
// ]);

// <x=-3, y=10, z=-1>
// <x=-12, y=-10, z=-5>
// <x=-9, y=0, z=10>
// <x=7, y=-5, z=-3>
// simulate(1000, [
//     {pos: [-3, 10, -1]},
//     {pos: [-12, -10, -5]},
//     {pos: [-9, 0, 10]},
//     {pos: [7, -5, -3]},
// ]);

console.log(lcmForAll(
    repeatCount([-1, 2, 4, 3]),
    repeatCount([0, -10, -8, 5]),
    repeatCount([2, -7, 8, -1])));

console.log(lcmForAll(
    repeatCount([-8, 5, 2, 9]),
    repeatCount([-10, 5, -7, -8]),
    repeatCount([0, 10, 3, -3])));

// <x=-3, y=10, z=-1>
// <x=-12, y=-10, z=-5>
// <x=-9, y=0, z=10>
// <x=7, y=-5, z=-3>
console.log(lcmForAll(
    repeatCount([-3, -12, -9, 7]),
    repeatCount([10, -10, 0, -5]),
    repeatCount([-1, -5, 10, -3])));
})();
