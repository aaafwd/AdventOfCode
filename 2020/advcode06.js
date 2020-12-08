// https://adventofcode.com/2020/day/6

(function() {

let input = document.body.textContent.trim().split('\n\n');

let answer1 = 0;
for (let group of input) {
  answer1 += new Set(group.split(/\s*/g)).size;
}
console.log("Answer 1:", answer1);

let answer2 = 0;
for (let group of input) {
  let intersection = null;
  for (let person of group.split('\n')) {
    intersection = new Set(person.split('').filter(
        x => !intersection || intersection.has(x)));
  }
  answer2 += intersection.size;
}
console.log("Answer 2:", answer2);

})();

