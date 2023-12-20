// https://adventofcode.com/2023/day/15
// --- Day 15: Lens Library ---

(function() {

function parseInput(input) {
  return input.trim().split(/[\s,]+/);
}

function hash(str) {
  let result = 0;
  for (let i = 0; i < str.length; ++i) {
    let x = str.charCodeAt(i);
    result += x;
    result *= 17;
    result %= 256;
  }
  return result;
}

function arrangeBoxes(steps) {
  let boxes = Array(256).fill(0).map(_ => []);
  for (let step of steps) {
    let [, label, op, num] = step.match(/^(\w+)([=-])(\d*)?$/);
    let x = hash(label);
    if (op == '-') {
      remove(boxes[x], label);
    } else if (op == '=') {
      add(boxes[x], label, +num);
    } else {
      console.assert(false, op);
    }
  }

  function remove(lens, label) {
    for (let i = 0; i < lens.length; ++i) {
      let code = lens[i][0];
      if (code == label) {
        lens.splice(i, 1);
        break;
      }
    }
  }

  function add(lens, label, focal) {
    for (let i = 0; i < lens.length; ++i) {
      let code = lens[i][0];
      if (code == label) {
        lens[i][1] = focal;
        return;
      }
    }
    lens.push([label, focal]);
  }
  return boxes;
}

function getFocusPower(boxes) {
  let result = 0;
  for (let i = 0; i < boxes.length; ++i) {
    let box = boxes[i];
    for (let j = 0; j < box.length; ++j) {
      let [label, focal] = box[j];
      result += (i + 1) * (j + 1) * focal;
    }
  }
  return result;
}

function solve(input) {
  let steps = parseInput(input);

  let answer1 = steps
    .map(hash)
    .reduce((a, b) => a + b, 0);

  let answer2 = getFocusPower(arrangeBoxes(steps));

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`);

solve(document.body.textContent);

})();

