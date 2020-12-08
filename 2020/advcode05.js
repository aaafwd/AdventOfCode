// https://adventofcode.com/2020/day/5

(function() {

let seats = document.body.textContent.trim().split('\n').map(s => {
  s = s.replaceAll(/[FL]/g, "0").replaceAll(/[BR]/g, "1");
  return Number.parseInt(s, 2);
});
seats.sort((a, b) => a - b);
console.log("Answer 1:", seats[seats.length - 1]);

for (let i = 1; i < seats.length; ++i) {
  if (seats[i] != seats[0] + i) {
    console.log("Answer 2:", seats[0] + i);
    break;
  }
}

})();

