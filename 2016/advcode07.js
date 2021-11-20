// https://adventofcode.com/2016/day/7
// --- Day 7: Internet Protocol Version 7 ---

(function() {

function parseInput(input) {
  return input.trim().split('\n').map(row => row.split(/[\[\]]/));
}

function hasAbba(str) {
  for (let i = 3; i < str.length; ++i) {
    if (str[i] == str[i - 3] && str[i - 1] == str[i - 2] && str[i] != str[i - 1]) {
      return true;
    }
  }
  return false;
}

function supportTls(ip) {
  let result = false;
  for (let i = 0; i < ip.length; ++i) {
    let chunk = ip[i];
    if (hasAbba(chunk)) {
      if (i & 1) return false;
      result = true;
    }
  }
  return result;
}

function extractAba(str) {
  let result = new Set();
  for (let i = 2; i < str.length; ++i) {
    if (str[i] == str[i - 2] && str[i] != str[i - 1]) {
      result.add(str.substr(i - 2, 3));
    }
  }
  return result;
}

function supportSsl(ip) {
  let sets = [new Set(), new Set()];
  for (let i = 0; i < ip.length; ++i) {
    let aba = extractAba(ip[i]);
    for (let s of aba) sets[i & 1].add(s);
  }
  for (let bab of sets[1]) {
    let aba = bab.split('').slice(1);
    aba.push(aba[0]);
    if (sets[0].has(aba.join(''))) return true;
  }
  return false;
}

function solve(input) {
  let ips = parseInput(input);
  let answer1 = ips.filter(ip => supportTls(ip)).length;
  let answer2 = ips.filter(ip => supportSsl(ip)).length;;
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn
aba[bab]xyz
xyx[xyx]xyx
aaa[kek]eke
zazbz[bzb]cdb
`);

solve(document.body.textContent);

})();

