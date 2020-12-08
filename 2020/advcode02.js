// https://adventofcode.com/2020/day/2

(function() {

let lines = document.body.textContent.trim().split('\n');
let answer1 = 0;
let answer2 = 0;
for (let line of lines) {
  const [,min_count,max_count,char,str] =
      line.match(/^(\d+)-(\d+)\s*(\w):\s*(\w+)$/);
  let count1 = 0;
  let count2 = 0;
  for (let i = 0; i < str.length; ++i) {
    if (str[i] == char) {
      ++count1;
      if (i == min_count - 1 || i == max_count - 1) ++count2;
    }
  }
  if (min_count <= count1 && count1 <= max_count) ++answer1;
  if (count2 == 1) ++answer2;
}
console.log("Answer 1:", answer1);
console.log("Answer 2:", answer2);

})();

