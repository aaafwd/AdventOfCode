// https://adventofcode.com/2020/day/4

(function() {

function isValidValue(id, value) {
  const number = Number.parseInt(value);
  switch (id) {
    case "byr":
      return /^\d{4}$/.test(value) && 1920 <= number && number <= 2002;
    case "iyr":
      return /^\d{4}$/.test(value) && 2010 <= number && number <= 2020;
    case "eyr":
      return /^\d{4}$/.test(value) && 2020 <= number && number <= 2030;
    case "hgt":
      return (/^\d{3}cm$/.test(value) && 150 <= number && number <= 193) ||
             (/^\d{2}in$/.test(value) && 59 <= number && number <= 76);
    case "hcl":
      return /^#[0-9a-f]{6}$/i.test(value);
    case "ecl":
      return /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(value);
    case "pid":
      return /^\d{9}$/.test(value);
  }
  return false;
}

let inputData = document.body.textContent;

const requiredIds = new Set(["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]);
let answer1 = 0, answer2 = 0;
for (let passport of inputData.trim().split('\n\n')) {
  const tuples = [...passport.matchAll(/(\w+):(\S+)/g)];
  let ids = new Set();
  let all_valid = true;
  for (const [,id,value] of tuples) {
    if (!requiredIds.has(id)) continue;
    console.assert(!ids.has(id));
    ids.add(id);
    if (!isValidValue(id, value)) all_valid = false;
  }
  if (ids.size == requiredIds.size) {
    ++answer1;
    if (all_valid) ++answer2;
  }
}

console.log("Answer 1:", answer1);
console.log("Answer 2:", answer2);

})();

