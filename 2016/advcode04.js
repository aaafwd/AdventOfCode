// https://adventofcode.com/2016/day/4
// --- Day 4: Security Through Obscurity ---

(function() {

function rotate(ch, offset) {
  let code = ch.charCodeAt(0) - 'a'.charCodeAt(0);
  code += offset;
  code %= 26;
  return String.fromCharCode('a'.charCodeAt(0) + code);
}

function parseInput(input) {
  const regex = /^([\w-]+)-(\d+)\[(\w+)\]$/;
  return input.trim().split('\n').map(line => {
    let [, name, id, checksum] = line.match(regex);
    id = +id;
    let decrypted = name
        .split('-')
        .map(str => str.split('').map(ch => rotate(ch, id)).join(''))
        .join(' ');
    return {name, id, checksum, decrypted};
  });
}

function isRealRoom({name, id, checksum}) {
  let freqs = {};
  name.replaceAll('-', '').split('').forEach(ch => freqs[ch] = (freqs[ch] || 0) + 1);
  let counts = Object.keys(freqs).map(ch => ([freqs[ch], ch]));
  counts.sort(([f1, c1], [f2, c2]) => f1 != f2 ? f2 - f1 : (c1 < c2 ? -1 : 1));
  counts.length = 5;
  let expected = counts.map(([_, ch]) => ch).join('');
  return expected == checksum;
}

function solve(input) {
  let rooms = parseInput(input);
  let answer1 = rooms.filter(r => isRealRoom(r)).map(r => r.id).reduce((x, y) => x + y, 0);

  let north_rooms = rooms.filter(r => r.decrypted.indexOf('north') >= 0);
  let answer2 = north_rooms.length == 1 ? north_rooms[0].id : 'N/A';

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]
qzmt-zixmtkozy-ivhz-343[zzzzz]
`);

solve(document.body.textContent);

})();

