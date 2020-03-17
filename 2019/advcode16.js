(function() {

function input(str) {
  return str.split('').map(x => Number(x));
}

function solve(str, phases, TIMES = 1) {
  console.time('Runtime');
  let arr = input(str);
  const offset = TIMES == 1 ? 0 : Number(str.substr(0, 7));
  const INITSIZE = arr.length;
  const SIZE = arr.length * TIMES;
  console.log('SIZE:', SIZE);

  arr.length = SIZE;
  for (let i = INITSIZE; i < SIZE; ++i) {
    arr[i] = arr[i % INITSIZE];
  }

  let newarr = Array(SIZE).fill(0);
  let accumsum = Array(SIZE + 1).fill(0);
  for (let phase = 0; phase < phases; ++phase) {
    accumsum[0] = 0;
    for (let i = Math.max(0, offset - 2); i < SIZE; ++i) {
      accumsum[i + 1] = accumsum[i] + arr[i];
    }
    // Optimization: can calculate only for [offset - 1, SIZE).
    for (let i = Math.max(1, offset); i <= SIZE; ++i) {
      let sum = 0;
      let k = i - 1;
      while (1) {
        sum += accumsum[Math.min(SIZE, k + i)] - accumsum[k];
        k += 2 * i;
        if (k >= SIZE) break;

        sum -= accumsum[Math.min(SIZE, k + i)] - accumsum[k];
        k += 2 * i;
        if (k >= SIZE) break;
      }
      newarr[i - 1] = Math.abs(sum) % 10;
    }
    [arr, newarr] = [newarr, arr];
  }

  for (let i = 0; i < 8; ++i) {
    arr[i] = arr[offset + i];
  }
  arr.length = 8;
  console.log('Answer:', arr.join(''));
  console.timeEnd('Runtime');
}

// solve("12345678", 1);
// solve("12345678", 2);
// solve("12345678", 3);
// solve("12345678", 4);

// solve("80871224585914546619083218645595", 100);
// solve("19617804207202209144916044189917", 100);
// solve("69317163492948606335995924319873", 100);

// solve("03036732577212944063491565474664", 100, 10000);
// solve("02935109699940807407585447034323", 100, 10000);
// solve("03081770884921959731165446850517", 100, 10000);

// SIZE: 6500000
// Answer: 80722126
// Runtime: 738.3720703125ms
solve("59713137269801099632654181286233935219811755500455380934770765569131734596763695509279561685788856471420060118738307712184666979727705799202164390635688439701763288535574113283975613430058332890215685102656193056939765590473237031584326028162831872694742473094498692690926378560215065112055277042957192884484736885085776095601258138827407479864966595805684283736114104361200511149403415264005242802552220930514486188661282691447267079869746222193563352374541269431531666903127492467446100184447658357579189070698707540721959527692466414290626633017164810627099243281653139996025661993610763947987942741831185002756364249992028050315704531567916821944", 100, 10000);

})();
