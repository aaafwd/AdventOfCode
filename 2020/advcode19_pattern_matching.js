// https://adventofcode.com/2020/day/19
// Runtime: 450 ms

(function() {

function matchesVariant(rules, variant, message, from, to, cache) {
  if (variant.length == 0) return from >= to;
  if (from >= to) return false;
  if (variant.length == 1) {
    return matchesRule(rules, variant[0], message, from, to, cache);
  }
  const ruleId = variant.shift();
  for (let middle = from + 1; middle < to; ++middle) {
    if (matchesRule(rules, ruleId, message, from, middle, cache) &&
        matchesVariant(rules, variant, message, middle, to, cache)) {
      return true;
    }
  }
  variant.unshift(ruleId);
  return false;
}

function matchesRule(rules, ruleId, message, from, to, cache = {}) {
  if (from >= to) return false;
  const rule = rules[ruleId];
  if (rule.char) {
    return (from + 1 == to) && message[from] == rule.char;
  }

  // Define a cache key.
  // 1) Easier for debugging. Runtime: 1055.365234375 ms
  // const key = ruleId + "|" + from + "|" + to;

  // 2) Faster. Runtime: 480.72900390625 ms
  const key = (ruleId * message.length + from) * message.length + to;

  if (cache[key] !== undefined) return cache[key];

  let result = false;
  for (let variant of rule.variants) {
    if (matchesVariant(rules, [...variant], message, from, to, cache)) {
      result = true;
      break;
    }
  }
  return (cache[key] = result);
}

function solve(input) {
  let [rulesInput, messages] = input.trim().split('\n\n');
  messages = messages.trim().split('\n');

  // Format: id => {char: char, variants: [[or1,or2], [or3,or4], ...]}
  let rules = {};
  rulesInput.split('\n').forEach(line => {
    let [id, rest] = line.split(':');
    let variants = [];
    let char = "";
    let result = rest.match(/^\s*\"(\w)\"$/);
    if (result) {
      char = result[1];
    } else {
      variants = rest.trim().split('|')
          .map(variant => variant.trim().split(' ').map(x => +x));
    }
    rules[+id] = {char, variants};
  });

  function matchAll() {
    let result = 0;
    for (let msg of messages) {
      if (matchesRule(rules, 0, msg, 0, msg.length)) ++result;
    }
    return result;
  }

  console.time("Runtime");
  console.log("Answer 1:", matchAll());
  console.timeEnd("Runtime");

  if (rules[8] && rules[11]) {
    rules[8] = {char: "", variants: [[42], [42, 8]]};
    rules[11] = {char: "", variants: [[42, 31], [42, 11, 31]]};

    console.time("Runtime");
    console.log("Answer 2:", matchAll());
    console.timeEnd("Runtime");
  }
}

solve(`
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb
`);

solve(`
42: 9 14 | 10 1
9: 14 27 | 1 26
10: 23 14 | 28 1
1: "a"
11: 42 31
5: 1 14 | 15 1
19: 14 1 | 14 14
12: 24 14 | 19 1
16: 15 1 | 14 14
31: 14 17 | 1 13
6: 14 14 | 1 14
2: 1 24 | 14 4
0: 8 11
13: 14 3 | 1 12
15: 1 | 14
17: 14 2 | 1 7
23: 25 1 | 22 14
28: 16 1
4: 1 1
20: 14 14 | 1 15
3: 5 14 | 16 1
27: 1 6 | 14 18
14: "b"
21: 14 1 | 1 14
25: 1 1 | 1 14
22: 14 14
8: 42
26: 14 22 | 1 20
18: 15 15
7: 14 5 | 1 21
24: 14 1

abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa
bbabbbbaabaabba
babbbbaabbbbbabbbbbbaabaaabaaa
aaabbbbbbaaaabaababaabababbabaaabbababababaaa
bbbbbbbaaaabbbbaaabbabaaa
bbbababbbbaaaaaaaabbababaaababaabab
ababaaaaaabaaab
ababaaaaabbbaba
baabbaaaabbaaaababbaababb
abbbbabbbbaaaababbbbbbaaaababb
aaaaabbaabaaaaababaa
aaaabbaaaabbaaa
aaaabbaabbaaaaaaabbbabbbaaabbaabaaa
babaaabbbaaabaababbaabababaaab
aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba
`);

solve(document.body.textContent);

})();

