(function() {

let input = document.body.textContent;

function parseLine(line) {
  let map = new Map;
  let [,node,subnodes] = line.match(/^([\w\s]+) bags contain (.+)\.$/);
  let tuples = [...subnodes.matchAll(/(\d+) ([\w\s]+) bags?/g)];
  for (let [,bags_count,bag_color] of tuples) {
    map.set(bag_color, (map.get(bag_color) || 0) + Number(bags_count));
  }
  return [node, map];
}

function contains(map, node, subnode) {
  if (map.get(node).get(subnode)) return true;
  for (let [i,] of map.get(node)) {
    if (contains(map, i, subnode)) return true;
  }
  return false;
}

function countBags(map, node) {
  let result = map.get(node).__count;
  if (result !== undefined) return result;

  result = 1;
  for (let [i,count] of map.get(node)) {
    result += count * countBags(map, i);
  }
  return (map.get(node).__count = result);
}

let map = new Map(input.trim().split('\n').map(line => parseLine(line)));

let answer1 = 0;
for (let [node,] of map) {
  if (contains(map, node, "shiny gold")) ++answer1;
}
console.log("Answer 1:", answer1);

let answer2 = countBags(map, "shiny gold") - 1;
console.log("Answer 2:", answer2);

})();

