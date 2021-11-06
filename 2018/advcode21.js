// https://adventofcode.com/2018/day/21
// --- Day 21: Chronal Conversion ---

(function() {

function solve1() {
  // Registers: [a, b, c, d, e, f]
  //             0  1  2  3  4  5
  // #ip 4 => e (== cp)
  //  0  seti 123 0 1       b := 123
  //  1  bani 1 456 1       b &= 456
  //  2  eqri 1 72 1        b := (b == 72) ? 1 : 0
  //  3  addr 1 4 4         cp += b
  //  4  seti 0 0 4         cp := 0
  //  5  seti 0 7 1         b := 0
  //  6  bori 1 65536 5     f := b | 65536
  //  7  seti 8595037 6 1   b := 8595037
  //  8  bani 5 255 3       d := f & 255
  //  9  addr 1 3 1         b += d
  // 10  bani 1 16777215 1  b &= 16777215
  // 11  muli 1 65899 1     b *= 65899
  // 12  bani 1 16777215 1  b &= 16777215
  // 13  gtir 256 5 3       d := (256 > f) ? 1 : 0
  // 14  addr 3 4 4         cp += d
  // 15  addi 4 1 4         cp++
  // 16  seti 27 4 4        cp := 27
  // 17  seti 0 2 3         d := 0
  // 18  addi 3 1 2         c := d + 1
  // 19  muli 2 256 2       c *= 256
  // 20  gtrr 2 5 2         c := (c > f) ? 1 : 0
  // 21  addr 2 4 4         cp += c
  // 22  addi 4 1 4         cp++
  // 23  seti 25 4 4        cp := 25
  // 24  addi 3 1 3         d++
  // 25  seti 17 8 4        cp := 17
  // 26  setr 3 8 5         f := d
  // 27  seti 7 5 4         cp := 7
  // 28  eqrr 1 0 3         d := (a == b) ? 1 : 0
  // 29  addr 3 4 4         cp += d
  // 30  seti 5 9 4         cp := 5
  //
  // Equivalent code 1:
  //
  //     let b = 0;
  //     do {
  //       let f = b | 65536;
  //       b = 8595037;
  //       while (1) {
  //         let d = f & 255;
  //         b += d;
  //         b &= 16777215;
  //         b *= 65899;
  //         b &= 16777215;
  //         if (f < 256) break;
  //         d = 0;
  //         while ((d + 1) * 256 <= f) ++d;
  //         f = d;
  //       }
  //     } while (a != b);
  //
  // Equivalent code 2:
  //
  //     let b = 0;
  //     do {
  //       let f = b | 65536;
  //       b = 8595037;
  //       while (1) {
  //         b = ((b + (f & 255)) * 65899) mod 2^24;
  //         if (f < 256) break;
  //         f >>= 8;
  //       }
  //     } while (a != b);

  let f = 65536;
  let b = 8595037;
  while (1) {
    b = ((b + (f & 255)) * 65899) & 16777215;
    if (f < 256) break;
    f >>= 8;
  }
  return b;
}

function solve2() {
  let a_options = {};

  let a = -1;
  let b = 0;
  while (1) {
    let f = b | 65536;
    b = 8595037;
    while (1) {
      b = ((b + (f & 255)) * 65899) & 16777215;
      if (f < 256) break;
      f >>= 8;
    }
    if (a_options[b]) break;
    a_options[b] = 1;
    a = b;
  }
  return a;
}

function solve() {
  console.log("Answer 1:", solve1(), "Answer 2:", solve2());
}

solve();

})();

