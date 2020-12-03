(function() {

let numbers = document.body.textContent.trim().split('\n');

let set = new Set();
for (let x of numbers) {
  x = +x;
  if (set.has(2020-x)) {
    console.log("Answer 1:", x*(2020-x));
  }
  set.add(x);
}

for (let i = 0; i < numbers.length; ++i) {
  for (let j = i + 1; j < numbers.length; ++j) {
    const a = +numbers[i];
    const b = +numbers[j];
    const c = 2020-a-b;
    if (c > 0 && set.has(c)) {
      console.log("Answer 2:", a*b*c);
    }
  }
}

})();

