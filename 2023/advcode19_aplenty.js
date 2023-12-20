// https://adventofcode.com/2023/day/19
// --- Day 19: Aplenty ---

(function() {

function parseInput(input) {
  let [workflows, parts] = input.trim()
    .split('\n\n')
    .map(part => part.trim().split('\n'));

  let workflowsMap = {};
  workflows = workflows.forEach(line => {
    let [, name, rules] = line.match(/^(\w+)\{(.+)\}$/);
    rules = rules.split(',').map(rule => {
      let [, op, cmp, value, result] = rule.match(/^(?:(\w+)([<>])(\d+):)?(\w+)$/);
      if (value !== undefined) value = +value;
      return [op, cmp, value, result];
    });
    workflowsMap[name] = rules;
  });

  parts = parts.map(line => {
    let [, x, m, a, s] = line.match(/^\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}$/);
    return [+x, +m, +a, +s];
  });

  return [workflowsMap, parts];
}

// part == [x, m, a, s]
function getDestination(rules, part) {
  for (let [op, cmp, value, result] of rules) {
    if (op === undefined) return result;
    let i = "xmas".indexOf(op);
    console.assert(i >= 0);
    console.assert(value !== undefined);
    let actual = part[i];
    if (cmp == '>') {
      if (actual > value) return result;
    } else if (cmp == '<') {
      if (actual < value) return result;
    } else {
      console.assert(false, cmp);
    }
  }
  console.assert(false);
}

// part == [x, m, a, s]
function isAccepted(workflows, part) {
  let current = 'in';
  while (1) {
    current = getDestination(workflows[current], part);
    if (current == 'A') return true;
    if (current == 'R') return false;
  }
}

function getDestinationRanges(rules, minPart, maxPart) {
  let queue = [[minPart, maxPart]];
  let ranges = [];
  while (queue.length > 0) {
    [minPart, maxPart] = queue.pop();
    
    // Splitting.
    let splitted = false;
    for (let [op, cmp, value, result] of rules) {
      if (op === undefined) continue;
      let i = "xmas".indexOf(op);
      console.assert(i >= 0);
      console.assert(value !== undefined);
      let min = minPart[i];
      let max = maxPart[i];
      if (cmp == '>' && min <= value && value < max) {
        minPart[i] = min;
        maxPart[i] = value;
        queue.push([minPart.slice(), maxPart.slice()]);
        minPart[i] = value + 1;
        maxPart[i] = max;
        queue.push([minPart.slice(), maxPart.slice()]);
        splitted = true;
        break;
      } else if (cmp == '<' && min < value && value <= max) {
        minPart[i] = min;
        maxPart[i] = value - 1;
        queue.push([minPart.slice(), maxPart.slice()]);
        minPart[i] = value;
        maxPart[i] = max;
        queue.push([minPart.slice(), maxPart.slice()]);
        splitted = true;
        break;
      }
    }
    if (splitted) continue;

    // Matching.
    for (let [op, cmp, value, result] of rules) {
      if (op === undefined) {
        ranges.push([result, minPart, maxPart]);
        break;
      }
      let i = "xmas".indexOf(op);
      console.assert(i >= 0);
      console.assert(value !== undefined);
      let min = minPart[i];
      let max = maxPart[i];
      if (cmp == '>') {
        console.assert(value < min || value >= max, min, max, value);
        if (min > value) {
          ranges.push([result, minPart, maxPart]);
          break;
        }
      } else if (cmp == '<') {
        console.assert(max < value || value <= min, min, max, value);
        if (max < value) {
          ranges.push([result, minPart, maxPart]);
          break;
        }
      } else {
        console.assert(false, cmp);
      }
    }
  }
  return ranges;
}

// {min,max}Part == [x, m, a, s]
function getAcceptedRanges(workflows, minPart, maxPart) {
  let name;
  let ranges = [['in', minPart, maxPart]];
  let accepted = [];
  while (ranges.length > 0) {
    [name, minPart, maxPart] = ranges.pop();
    if (name == 'A') {
      accepted.push([minPart, maxPart]);
      continue;
    }
    if (name == 'R') continue;
    let next = getDestinationRanges(workflows[name], minPart, maxPart);
    ranges.push(...next);
  }

  return accepted
    .map(([minPart, maxPart]) => {
      let result = 1;
      console.assert(minPart.length == 4);
      console.assert(maxPart.length == 4);
      for (let i = 0; i < minPart.length; ++i) {
        console.assert(maxPart[i] >= minPart[i]);
        result *= (maxPart[i] - minPart[i] + 1);
      }
      console.assert(result > 0);
      return result;
    })
    .reduce((a, b) => a + b, 0);
}

function solve(input) {
  let [workflows, parts] = parseInput(input);

  let answer1 = parts
    .filter(part => isAccepted(workflows, part))
    .flatMap(part => part)
    .reduce((a, b) => a + b, 0);

  let answer2 = getAcceptedRanges(
    workflows,
    [1, 1, 1, 1],
    [4000, 4000, 4000, 4000]);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`);

solve(document.body.textContent);

})();

