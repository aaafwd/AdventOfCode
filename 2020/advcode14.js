// https://adventofcode.com/2020/day/14

(function() {

function solve1(input) {
  let lines = input.trim().split('\n');

  let set_mask = 0;
  let unset_mask = 0;
  let memory = {};

  function process(line) {
    let res = line.match(/^mask\s*=\s*(\w+)$/)
    if (res) {
      let mask = res[1];
      set_mask = Number.parseInt(mask.replaceAll('X', '0'), 2);
      unset_mask = Number.parseInt(
          mask.replaceAll('0', '2').replaceAll(/[X1]/g, '0').replaceAll('2', '1'), 2);
      return;
    }
    let [,address,value] = line.match(/^mem\[(\d+)\]\s*=\s*(\d+)$/);
    address = +address;
    value = +value;
    value = Number(BigInt(value) | BigInt(set_mask));
    value = Number(BigInt(value) & ~BigInt(unset_mask));
    console.assert(value >= 0);
    memory[address] = value;
  }

  for (let line of lines) process(line);
  let answer1 = 0;
  for (let address in memory) answer1 += memory[address];
  console.log("Answer 1:", answer1);
}

function solve2(input) {
  let lines = input.trim().split('\n');

  let set_mask = 0;
  let unset_mask = 0;
  let floating_masks = [];
  let memory = {};

  function generateFloatingMasks(mask, index = 0) {
    for (; index < mask.length && mask[index] != 'X'; ++index) {
      mask[index] = '0';
    }
    if (index == mask.length) {
      floating_masks.push(Number.parseInt(mask.join(''), 2));
      return;
    }
    mask[index] = '0';
    generateFloatingMasks(mask, index + 1);
    mask[index] = '1';
    generateFloatingMasks(mask, index + 1);
    mask[index] = 'X';
  }

  function process(line) {
    let res = line.match(/^mask\s*=\s*(\w+)$/)
    if (res) {
      let mask = res[1];
      set_mask = Number.parseInt(mask.replaceAll('X', '0'), 2);
      unset_mask = Number.parseInt(
          mask.replaceAll('1', '0').replaceAll('X', '1'), 2);
      floating_masks = [];
      generateFloatingMasks(mask.split(''));
      return;
    }
    let [,address,value] = line.match(/^mem\[(\d+)\]\s*=\s*(\d+)$/);
    address = +address;
    value = +value;
    address = Number(BigInt(address) | BigInt(set_mask));
    address = Number(BigInt(address) & ~BigInt(unset_mask));
    console.assert(address >= 0);
    for (let flmask of floating_masks) {
      let addr = Number(BigInt(address) | BigInt(flmask));
      console.assert(addr >= 0);
      memory[addr] = value;
    }
  }

  for (let line of lines) process(line);
  let answer2 = 0;
  for (let address in memory) answer2 += memory[address];
  console.log("Answer 2:", answer2);
}

solve1(`
mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0
`);

solve1(document.body.textContent);

solve2(`
mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
`);

solve2(document.body.textContent);

})();

