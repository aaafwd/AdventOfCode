// https://adventofcode.com/2017/day/20
// --- Day 20: Particle Swarm ---

(function() {

function findClosestToZero(particles) {
  let indexes = Array(particles.length).fill(0).map((_, i) => i);

  for (let vec_index = 2; vec_index >= 0; --vec_index) {
    let min_speed = +Infinity;
    let filtered = [];
    for (let i = 0; i < indexes.length; ++i) {
      let speed = particles[indexes[i]][vec_index].map(x => Math.abs(x)).reduce((x, y) => x + y);
      if (min_speed > speed) {
        filtered = [indexes[i]];
        min_speed = speed;
      } else if (min_speed == speed) {
        filtered.push(indexes[i]);
      }
    }
    indexes = filtered;
  }

  console.assert(indexes.length == 1);
  return indexes[0];
}

function findCollideTime(p1, p2) {
  // position(t) = x + v*t + a*t*(t+1)/2
  // position(t) * 2 = 2*x + (2*v + a)*t + a*t^2

  // Find integer t >= 0, s.t.: position(p1, t) == position(p2, t)
  // <=> (a1-a2)*t^2 + (2*v1+a1-2*v2-a2)*t + 2*(x1-x2) = 0

  let found_t = [];
  for (let dim = 0; dim <= 2; ++dim) {
    let a = p1[2][dim] - p2[2][dim];
    let b = 2 * (p1[1][dim] - p2[1][dim]) + a;
    let c = 2 * (p1[0][dim] - p2[0][dim]);
    // a*t^2 + b*t + c = 0
    // D = (b^2 - 4*a*c)
    // t1,2 = (-b ± sqrt(D)) / (2*a)

    let times = [];
    if (a == 0) {
      if (b == 0) {
        if (c != 0) return -1;
        continue;
      } else {
        // b*t + c = 0
        times.push(-c / b);
      }
    } else {
      let D = b*b - 4*a*c;
      if (D < 0) return -1;
      D = Math.sqrt(D);
      let t1 = (-b - D) / (2*a);
      let t2 = (-b + D) / (2*a);
      times.push(t1);
      if (t2 != t1) times.push(t2);
    }
    times = times.filter(t => t >= 0 && Math.floor(t) == t);
    if (found_t.length > 0) {
      times = times.filter(t => found_t.indexOf(t) >= 0);
    }
    if (times.length == 0) return -1;
    found_t = times;
  }
  if (found_t.length == 0) return -1;
  console.assert(found_t.length == 1);
  return found_t[0];
}

function resolveAllCollides(particles) {
  let collide_events = [];
  for (let i = 0; i < particles.length; ++i) {
    for (let j = i + 1; j < particles.length; ++j) {
      let time = findCollideTime(particles[i], particles[j]);
      if (time >= 0) {
        collide_events.push({time, i, j});
      }
    }
  }
  collide_events.sort((a, b) => a.time - b.time);

  let collided_times = Array(particles.length).fill(Infinity);
  for (let {time, i, j} of collide_events) {
    if (collided_times[i] < time || collided_times[j] < time) continue;
    collided_times[i] = collided_times[j] = time;
  }

  let left = collided_times.filter(t => t == Infinity).length;
  return left;
}

function parseInput(input) {
  let lines = input.trim().split('\n');
  const regex = /[pva]\s*=\s*<\s*([-\d]+)\s*,\s*([-\d]+)\s*,\s*([-\d]+)\s*>/g;

  let particles = [];
  for (let line of lines) {
    let result = [...line.matchAll(regex)];
    particles.push(result.map(res => [res[1], res[2], res[3]].map(x => +x)));
  }
  return particles;
}

function solve(input) {
  let particles = parseInput(input);
  let answer1 = findClosestToZero(particles);
  let answer2 = resolveAllCollides(particles);
  console.log("Answer 1:", answer1, "Answer 2:", answer2);
}

solve(`
p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>
p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>
`);

solve(`
p=<-6,0,0>, v=< 3,0,0>, a=< 0,0,0>    
p=<-4,0,0>, v=< 2,0,0>, a=< 0,0,0>
p=<-2,0,0>, v=< 1,0,0>, a=< 0,0,0>
p=< 3,0,0>, v=<-1,0,0>, a=< 0,0,0>
`);

solve(document.body.textContent);

})();
