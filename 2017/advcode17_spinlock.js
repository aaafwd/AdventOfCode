// https://adventofcode.com/2017/day/17
// --- Day 17: Spinlock ---
//
// Runtime: 92390.81005859375 ms (with the `skip_next` optimisation)
// Runtime: 196318.21606445312 ms (w/o optimisation)

(function() {

function makeSpinlock(last_value, step_count, optimise = !true) {
  let next = new Int32Array(last_value + 1);
  next[0] = 0;

  const skip_count = optimise ? Math.floor(Math.sqrt(step_count)) : last_value;

  let value = 1;
  for (; value <= skip_count + 1 && value <= last_value; ++value) {
    if (!(value % 1000000)) console.timeLog("Runtime", "Value:", value);

    // Move the current position (i-1) `step_count` steps forward.
    let index = value - 1;
    for (let steps = 0; steps < step_count; ++steps) {
      index = next[index];
    }
    next[value] = next[index];
    next[index] = value;
  }
  if (value >= last_value) return next;

  // The `skip_next` contains pointers ahead of `skip_count` elements from a current position.
  // Optimal value for the `skip_count` is about `Math.sqrt(step_count)`.
  let skip_next = new Int32Array(last_value + 1);

  // Construct `skip_next` pointers.
  skip_next[0] = 0;
  for (let i = 0; i < skip_count; ++i) {
    skip_next[0] = next[skip_next[0]];
  }
  for (let i = 0, pos = 0; i < value; ++i) {
    skip_next[next[pos]] = next[skip_next[pos]];
    pos = next[pos];
  }

  for (; value <= last_value; ++value) {
    if (!(value % 1000000)) console.timeLog("Runtime", "Value:", value);

    // Move the current position (i-1) `step_count` steps forward.
    let index = value - 1;
    let steps = 0;
    let skip_update_start = index;
    for (; steps + skip_count <= step_count; steps += skip_count) {
      skip_update_start = index;
      index = skip_next[index];
    }
    for (; steps < step_count; ++steps) {
      index = next[index];
      skip_update_start = next[skip_update_start];
    }

    next[value] = next[index];
    next[index] = value;

    // Update the `skip_next` pointers.
    // console.assert(skip_next[skip_update_start] == index);
    while (skip_update_start != value) {
      skip_update_start = next[skip_update_start];
      index = next[index];
      skip_next[skip_update_start] = index;
    }
  }
  return next;
}

function solve(last_value, step_count) {
  console.time("Runtime")

  let nums = makeSpinlock(last_value, step_count);
  let answer1 = nums[last_value];
  let answer2 = nums[0];

  if (last_value == 2017) {
    console.log("Position after #" + last_value + ":", answer1, "(Answer 1)");
  } else {
    console.log("Position after #0:", answer2, "(Answer 2)");
  }
  console.timeEnd("Runtime")
}

solve(2017, 3);
solve(2017, 369);
solve(50000000, 369);

})();

