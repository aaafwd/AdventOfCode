// https://adventofcode.com/2016/day/5
// --- Day 5: How About a Nice Game of Chess? ---
//
// Runtime: 21911.621826171875 ms (part 1)
// Runtime: 67909.70678710938 ms (part 2)

(function() {

function injectScript(id, src, callback) {
  if (document.getElementById(id)) {
    callback();
    return;
  }
  let js = document.createElement('script');
  js.id = id;
  js.onload = callback;
  js.src = src;
  document.head.appendChild(js);
}

function solve1(id) {
  console.time('Runtime')
  console.log('Solving part 1 for:', id)
  let result = [];
  for (let index = 0; result.length < 8; ++index) {
    let hash = md5(id + index);
    if (hash.startsWith('00000')) {
      result.push(hash.substr(5, 1));
      console.log('\tindex:', index, 'password:', result.join(''));
    }
  }
  let password = result.join('');
  console.log('Answer 1:', password);
  console.timeEnd('Runtime')
}

function solve2(id) {
  console.time('Runtime')
  console.log('Solving part 2 for:', id)
  let result = Array(8).fill('_');
  let left = 8;
  for (let index = 0; left > 0; ++index) {
    let hash = md5(id + index);
    if (hash.startsWith('00000')) {
      let pos = +hash.substr(5, 1);
      if (pos < 8 && result[pos] === '_') {
        let char = hash.substr(6, 1);
        result[pos] = char;
        --left;
        console.log('\tindex:', index, 'password:', result.join(''));
      }
    }
  }
  let password = result.join('');
  console.log('Answer 2:', password);
  console.timeEnd('Runtime')
}

injectScript('__dummy_id', '//www.myersdaily.org/joseph/javascript/md5.js', () => {

  // solve1('abc');
  // solve2('abc');
  solve1('cxdnnyjw');
  solve2('cxdnnyjw');

  /*
    Solving part 1 for: cxdnnyjw
        index: 2307654 password: f
        index: 2503851 password: f7
        index: 3020934 password: f77
        index: 4275978 password: f77a
        index: 7416166 password: f77a0
        index: 7730074 password: f77a0e
        index: 7739164 password: f77a0e6
        index: 8202539 password: f77a0e6e
    Answer 1: f77a0e6e
    Runtime: 21911.621826171875 ms
    Solving part 2 for: cxdnnyjw
        index: 2503851 password: _______c
        index: 7416166 password: 9______c
        index: 7739164 password: 9_____ec
        index: 9196770 password: 9___2_ec
        index: 14466563 password: 9_9_2_ec
        index: 16503992 password: 9_982_ec
        index: 17582424 password: 9_9828ec
        index: 25370046 password: 999828ec
    Answer 2: 999828ec
    Runtime: 67909.70678710938 ms
  */

});

})();

