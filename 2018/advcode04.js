// https://adventofcode.com/2018/day/4
// --- Day 4: Repose Record ---

(function() {

function parseInput(input) {
  let lines = input.trim().split('\n').sort();
  const regex = /^\[(\d+)-(\d+)-(\d+)\s+(\d+):(\d+)\]\s*(Guard #(\d+)|wakes|falls)/;

  let records = [];
  let guard = -1;
  let asleep_checksum = 0;
  for (let line of lines) {
    let [, year, month, day, hour, minute, op, new_guard] = line.match(regex);
    [year, month, day, hour, minute] = [year, month, day, hour, minute].map(x => +x);
    let cmd;
    if (op[0] == 'G') {
      guard = +new_guard;
      cmd = 0; // Guard begins shift
    } else if (op[0] == 'f') {
      cmd = 1; // falls asleep
      ++asleep_checksum;
      console.assert(hour == 0);
    } else if (op[0] == 'w') {
      cmd = 2; // wakes up
      --asleep_checksum;
      console.assert(hour == 0);
    } else {
      console.assert(0, line);
    }
    console.assert(guard >= 0);
    records.push({year, month, day, hour, minute, guard, cmd});
  }
  console.assert(asleep_checksum == 0);
  return records;
}

function collectGuardStats(records) {
  let guards = {};

  let guard = -1;
  for (let i = 0; i < records.length; ++i) {
    let rec = records[i];
    if (rec.cmd == 0) {
      guard = rec.guard;
    } else if (rec.cmd == 2) { // wakes up
      console.assert(i && records[i - 1].cmd == 1);
      guards[guard] = guards[guard] || {guard};
      guards[guard].sleep_minutes = guards[guard].sleep_minutes || Array(60).fill(0);
      guards[guard].total_sleep = guards[guard].total_sleep || 0;
      for (let min = records[i - 1].minute; min < rec.minute; ++min) {
        ++guards[guard].sleep_minutes[min];
        ++guards[guard].total_sleep;
      }
    } else {
      console.assert(0);
    }
  }
  return guards;
}

function solve(input) {
  let records = parseInput(input);
  let guards = collectGuardStats(records);

  // Strategy 1: Find the guard that has the most minutes asleep.
  // What minute does that guard spend asleep the most?
  let guard = Object.values(guards).sort((g1, g2) => g2.total_sleep - g1.total_sleep)[0];
  let minute = guard.sleep_minutes.indexOf(Math.max(...guard.sleep_minutes));
  let answer1 = guard.guard * minute;
  console.log("Answer 1:", answer1);

  // Strategy 2: Of all guards, which guard is most frequently asleep on the same minute?
  guard = Object.values(guards)
      .sort((g1, g2) => Math.max(...g2.sleep_minutes) - Math.max(...g1.sleep_minutes))[0];
  minute = guard.sleep_minutes.indexOf(Math.max(...guard.sleep_minutes));
  let answer2 = guard.guard * minute;
  console.log("Answer 2:", answer2);
}

solve(`
[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
`);

solve(document.body.textContent);

})();

