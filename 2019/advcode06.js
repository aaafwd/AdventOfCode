(function(){

function depth(graph, v) {
    if (graph.__counts[v] !== undefined) {
        return graph.__counts[v];
    }
    let children = graph[v];
    if (!children) return 0;
    console.assert(children.length == 1, v);
    return graph.__counts[v] = 1 + depth(graph, children[0]);
}

function solve() {
    let graph = input();
    let sum = 0;
    for (let v in graph) {
        if (v == "__counts") continue;
        sum += depth(graph, v);
    }
    return sum;
}
// console.log(solve());

function path(graph, v) {
  let result = [];
  while (v) {
      result.push(v);
      v = graph[v];
  }
  return result;
}

function solve2() {
    let graph = input();
    let path1 = path(graph, "YOU").reverse();
    let path2 = path(graph, "SAN").reverse();
    while (path1.length && path1[0] == path2[0]) {
        path1.shift();
        path2.shift();
    }
    return path1.length + path2.length - 2;
}
console.log(solve2());

function input() {
    let str = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN
`;
    let graph = {__counts:{}};
    str.trim().split("\n").forEach((s) => {
        let pair = s.split(")");
        console.assert(graph[pair[1]] == undefined);
        graph[pair[1]] = pair[0];
    });
    return graph;
}

})();
