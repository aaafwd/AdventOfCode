// https://adventofcode.com/2021/day/19
// --- Day 19: Beacon Scanner ---
//
// Runtime: 275.260986328125 ms

(function() {
console.time('Runtime');

const kBases = (function() {
  let result = [];
  let axes = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];

  function negate(vec) {
    for (let i = 0; i < 3; ++i) {
      if (vec[i]) vec[i] *= -1;
    }
  }

  for (let face = 0; face < 3; ++face) {
    for (let sign = -1; sign <= 1; sign += 2) {
      for (let rot = 0; rot < 4; ++rot) {
        result.push(axes.map(axe => [...axe]));
        [axes[1], axes[2]] = [axes[2], axes[1]];
        negate(axes[2]);
      }
      negate(axes[0]);
      negate(axes[1]);
    }
    axes.push(axes.shift());
  }
  return result;
})();

function parseInput(input) {
  const regex = /([-\d]+),([-\d]+),([-\d]+)/;
  let parts = input.trim().split('\n\n');
  return parts.map(part => {
    let lines = part.trim().split('\n');
    lines.shift();
    let relatives = lines.map(line => {
      let [, x, y, z] = line.match(regex).map(Number);
      return [x, y, z];
    });
    return {relatives, absolutes: null, center: null};
  });
}

function cacheKey([x, y, z]) {
  return (x * 8192 + y) * 8192 + z;
}

function findOffsetForOverlaps(points1, points2) {
  let overlaps = new Map();
  let max_count = 0;
  for (let i = 0; i < points1.length && max_count + points1.length - i >= 12; ++i) {
    let pt1 = points1[i];
    for (let pt2 of points2) {
      let offset = [
        pt1[0] - pt2[0],
        pt1[1] - pt2[1],
        pt1[2] - pt2[2],
      ];
      let key = cacheKey(offset);
      let count = (overlaps.get(key) || 0) + 1;
      overlaps.set(key, count);
      max_count = Math.max(max_count, count);
      if (max_count >= 12) return offset;
    }
  }
  return null;
}

function rotatePoints(points, axes) {
  return points.map(([x, y, z]) => {
    let pt = [0, 0, 0];
    for (let i = 0; i < 3; ++i) {
      pt[i] += axes[0][i] * x;
      pt[i] += axes[1][i] * y;
      pt[i] += axes[2][i] * z;
    }
    return pt;
  });
}

function matchScannersPair(s1, s2) {
  for (let axes of kBases) {
    let rotated = rotatePoints(s2.relatives, axes);
    let offset = findOffsetForOverlaps(s1.absolutes, rotated);
    if (!offset) continue;
    s2.absolutes = rotated.map(([x, y, z]) =>
       [x + offset[0], y + offset[1], z + offset[2]]);
    s2.center = offset;
    return true;
  }
  return false;
}

function findAbsoluteCoords(scanners) {
  scanners[0].center = [0, 0, 0];
  scanners[0].absolutes = scanners[0].relatives;

  let queue = [0];
  let unknown = scanners.length - 1;
  while (queue.length > 0) {
    let i = queue.pop();
    for (let j = 0; j < scanners.length; ++j) {
      if (scanners[j].center) continue;
      if (matchScannersPair(scanners[i], scanners[j])) {
        // console.timeLog('Runtime', 'matched pair:', i, j, 'still not matched:', unknown);
        --unknown;
        queue.push(j);
      }
    }
  }
  console.assert(unknown == 0, 'Failed to find a solution');
}

function countAllBeacons(scanners) {
  let set = new Set([].concat(...scanners.map(s => s.absolutes.map(cacheKey))));
  return set.size;
}

function getDistance([x1, y1, z1], [x2, y2, z2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
}

function solve(input) {
  let scanners = parseInput(input);
  findAbsoluteCoords(scanners);
  let answer1 = countAllBeacons(scanners);
  let answer2 = 0;
  for (let s1 of scanners) {
    for (let s2 of scanners) {
      answer2 = Math.max(answer2, getDistance(s1.center, s2.center));
    }    
  }
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
--- scanner 0 ---
404,-588,-901
528,-643,409
-838,591,734
390,-675,-793
-537,-823,-458
-485,-357,347
-345,-311,381
-661,-816,-575
-876,649,763
-618,-824,-621
553,345,-567
474,580,667
-447,-329,318
-584,868,-557
544,-627,-890
564,392,-477
455,729,728
-892,524,684
-689,845,-530
423,-701,434
7,-33,-71
630,319,-379
443,580,662
-789,900,-551
459,-707,401

--- scanner 1 ---
686,422,578
605,423,415
515,917,-361
-336,658,858
95,138,22
-476,619,847
-340,-569,-846
567,-361,727
-460,603,-452
669,-402,600
729,430,532
-500,-761,534
-322,571,750
-466,-666,-811
-429,-592,574
-355,545,-477
703,-491,-529
-328,-685,520
413,935,-424
-391,539,-444
586,-435,557
-364,-763,-893
807,-499,-711
755,-354,-619
553,889,-390

--- scanner 2 ---
649,640,665
682,-795,504
-784,533,-524
-644,584,-595
-588,-843,648
-30,6,44
-674,560,763
500,723,-460
609,671,-379
-555,-800,653
-675,-892,-343
697,-426,-610
578,704,681
493,664,-388
-671,-858,530
-667,343,800
571,-461,-707
-138,-166,112
-889,563,-600
646,-828,498
640,759,510
-630,509,768
-681,-892,-333
673,-379,-804
-742,-814,-386
577,-820,562

--- scanner 3 ---
-589,542,597
605,-692,669
-500,565,-823
-660,373,557
-458,-679,-417
-488,449,543
-626,468,-788
338,-750,-386
528,-832,-391
562,-778,733
-938,-730,414
543,643,-506
-524,371,-870
407,773,750
-104,29,83
378,-903,-323
-778,-728,485
426,699,580
-438,-605,-362
-469,-447,-387
509,732,623
647,635,-688
-868,-804,481
614,-800,639
595,780,-596

--- scanner 4 ---
727,592,562
-293,-554,779
441,611,-461
-714,465,-776
-743,427,-804
-660,-479,-426
832,-632,460
927,-485,-438
408,393,-506
466,436,-512
110,16,151
-258,-428,682
-393,719,612
-211,-452,876
808,-476,-593
-575,615,604
-485,667,467
-680,325,-822
-627,-443,-432
872,-547,-609
833,512,582
807,604,487
839,-516,451
891,-625,532
-652,-548,-490
30,-46,-14
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

