// https://adventofcode.com/2020/day/25

(function() {

function solve(pubkey1, pubkey2) {
  const mod = 20201227;
  // 7 ^ (loop1) mod 20201227 == pubkey1
  // 7 ^ (loop2) mod 20201227 == pubkey2
  // 7 ^ (loop1 * loop2) mod 20201227 => private_key
  let loop1, loop2;
  for (let loop = 1, found = 0, subject = 1; found < 2; ++loop) {
    subject *= 7;
    subject %= mod;
    if (subject == pubkey1) {
      loop1 = loop;
      ++found;
    }
    if (subject == pubkey2) {
      loop2 = loop;
      ++found;
    }
  }
  if (loop1 < loop2) {
    [loop1, loop2] = [loop2, loop1];
    [pubkey1, pubkey2] = [pubkey2, pubkey1];
  }
  let prikey = 1;
  while (loop2-- > 0) {
    prikey *= pubkey1;
    prikey %= mod;
  }
  console.log("Answer:", prikey);
}

console.time("Runtime");

solve(5764801, 17807724);
solve(1327981, 2822615);

console.timeEnd("Runtime");

})();

