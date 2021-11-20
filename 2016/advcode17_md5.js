// https://adventofcode.com/2016/day/17
// --- Day 17: Two Steps Forward ---
//
// Runtime: 1648.36376953125 ms

(function() {

// up, down, left, and right
const kDirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
const kDirChars = 'UDLR';

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

function bfs(passcode) {
  let queue = [{x: 0, y: 0, path: passcode}];
  let shortest = '';
  let longest_length = 0;
  while (queue.length > 0) {
    let new_queue = [];
    for (let {x, y, path} of queue) {
      let hash = md5(path);
      for (let dir = 0; dir < 4; ++dir) {
        let ch = hash[dir];
        if (ch <= 'a') continue;
        let nx = x + kDirs[dir][0];
        let ny = y + kDirs[dir][1];
        if (nx < 0 || nx > 3 || ny < 0 || ny > 3) continue;
        let new_path = path + kDirChars[dir];
        if (nx == 3 && ny == 3) {
          let result = new_path.substr(passcode.length);
          if (!shortest) shortest = result;
          if (longest_length < result.length) longest_length = result.length;
        } else {
          new_queue.push({x: nx, y: ny, path: new_path});
        }
      }
    }
    queue = new_queue;
  }
  return [shortest, longest_length];
}

function solve(passcode) {
  let [shortest, longest_length] = bfs(passcode);
  console.log('Answer 1:', shortest);
  console.log('Answer 2:', longest_length);
}

injectScript('__dummy_id', '//www.myersdaily.org/joseph/javascript/md5.js', () => {
  console.time('Runtime');

  solve('ihgpwlah');
  solve('kglvqrro');
  solve('ulqzkmiv');
  solve('dmypynyp');

  console.timeEnd('Runtime');
});

})();

