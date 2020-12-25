// https://adventofcode.com/2020/day/16

(function() {

function solve(input) {
  let [requirements, myTicket, otherTickets] = input.trim().split('\n\n');
  requirements = requirements.split('\n').map(line => {
    let [,name,a,b,c,d] = line.match(/^([^:]+):\s*(\d+)-(\d+) or (\d+)-(\d+)$/);
    console.assert(+a < +b);
    console.assert(+c < +d);
    return [name, [[+a,+b], [+c,+d]], new Set()];
  });

  myTicket = myTicket.split('\n')[1];
  myTicket = myTicket.split(',').map(x => +x);

  otherTickets = otherTickets.split('\n').slice(1)
      .map(line => line.split(',').map(x => +x));

  let validTickets = [myTicket];

  function isValid(number) {
    for (let req of requirements) {
      for (let [a,b] of req[1]) {
        if (a <= number && number <= b) return true;
      }
    }
    return false;
  }

  function passesRequirementForAllValidTickets(req, pos) {
    for (let tick of validTickets) {
      const number = tick[pos];
      let passes = false;
      for (let [a,b] of req[1]) {
        if (a <= number && number <= b) passes = true;
      }
      if (!passes) return false;
    }
    return true;
  }

  let answer1 = 0;
  for (let tick of otherTickets) {
    let valid = true;
    for (let number of tick) {
      if (!isValid(number)) {
        answer1 += number;
        valid = false;
      }
    }
    if (valid) validTickets.push(tick);
  }
  console.log("Answer 1:", answer1);

  // Populate index candidates.
  const positions = validTickets[0].length;
  for (let tick of validTickets) {
    console.assert(tick.length == positions);
  }
  for (let req of requirements) {
    for (let pos = 0; pos < positions; ++pos) {
      if (passesRequirementForAllValidTickets(req, pos)) {
        req[2].add(pos);
      }
    }
  }

  // Now that we have index candidates, try to assign one index candidate
  // to each requirement when it's possible to do it in a unique way.
  let reqPositions = [];
  let foundPositions = new Set();
  while (1) {
    let stabilized = true;
    for (let i = 0; i < requirements.length; ++i) {
      let req = requirements[i];
      if (req[2].size != 1) continue;
      const pos = Array.from(req[2])[0];
      if (foundPositions.has(pos)) continue;
      foundPositions.add(pos);
      reqPositions[i] = pos;
      stabilized = false;
    }
    if (stabilized) break;
    for (let req of requirements) {
      for (let found of foundPositions) {
        req[2].delete(found);
      }
    }
  }
  // Check all indexes were assigned, otherwise there is no unique solution.
  console.assert(foundPositions.size == positions);
  
  let answer2 = 1;
  for (let i = 0; i < 6 && i < myTicket.length; ++i) {
    answer2 *= myTicket[reqPositions[i]];
  }
  console.log("Answer 2:", answer2);
}

solve(`
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
`);

solve(`
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
`);

solve(document.body.textContent);

})();

