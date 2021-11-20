// https://adventofcode.com/2016/day/14
// --- Day 14: One-Time Pad ---
//
// Runtime: ~2 minutes

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

function solve(id, md5_repeats = 1) {
  console.time('Runtime')

  const regex = /(\w)\1{2,}/g;
  let result = [];
  let candidates = {};
  let next_candidate = Infinity;
  let last_result = -1;

  for (let index = 0;; ++index) {
    if (index % 200 == 0) {
      console.timeLog('Runtime', 'index:', index, 'found:', result.length);
    }
    let hash = md5(id + index);
    for (let i = 1; i < md5_repeats; ++i) {
      hash = md5(hash);
    }
    let has_3 = false;
    let has_5 = false;
    for (let [str] of hash.matchAll(regex)) {
      let ch = str[0];
      candidates[ch] = candidates[ch] || [];
      if (str.length >= 5) {
        has_5 = true;
        for (let candidate of candidates[ch]) {
          if (candidate < index - 1000) continue;
          result.push(candidate);
          last_result = Math.max(last_result, candidate);
        }
        candidates[ch] = [];
      }
      if (!has_3) {
        has_3 = true;
        candidates[ch].push(index);
        if (next_candidate > index) next_candidate = index;
      }
    }
    if (has_5 || next_candidate < index - 1000) {
      next_candidate = Infinity;
      for (let ch in candidates) {
        while (candidates[ch].length && candidates[ch][0] < index - 1000) {
          candidates[ch].shift();
        }
        if (candidates[ch].length && next_candidate > candidates[ch][0]) {
          next_candidate = candidates[ch][0];
        }
      }
    }
    if (result.length >= 64 && next_candidate > last_result) break;
  }
  result.sort((x, y) => x - y);

  console.log('Answer (repeats: ' + md5_repeats + '):', result[63]);
  console.timeEnd('Runtime')
}

injectScript('__dummy_id', '//www.myersdaily.org/joseph/javascript/md5.js', () => {

  // solve('abc');
  // solve('abc', 2017);
  solve('ngcjuoqr');
  solve('ngcjuoqr', 2017);

});

})();

