// https://adventofcode.com/2022/day/21
// --- Day 21: Monkey Math ---
// Runtime: 11.0830078125 ms

(function() {
console.time('Runtime');

function parseInput(input) {
  const regex = /^(\w+)\s*([\+\*\-\/])\s*(\w+)$/;
  let nodes = {};
  for (let line of input.trim().split('\n')) {
    let [name, rest] = line.split(':');
    rest = rest.trim();
    let match = rest.match(regex);
    if (match) {
      let [, left, op, right] = match;
      nodes[name] = {left, op, right};
    } else {
      let value = +rest;
      console.assert(!isNaN(value), rest);
      nodes[name] = {value};
    }
  }
  return nodes;
}

function getValue(nodes, name) {
  let node = nodes[name];
  console.assert(node != null, name);
  if (node.value !== undefined) return node.value;
  if (node.cached !== undefined) return node.cached;
  let left = getValue(nodes, node.left);
  let right = getValue(nodes, node.right);
  let value;
  if (node.op == '+') {
    value = left + right;
  } else if (node.op == '-') {
    value = left - right;
  } else if (node.op == '*') {
    value = left * right;
  } else if (node.op == '/') {
    value = left / right;
    console.assert(Math.floor(value) == value, value);
  } else {
    console.assert(false, node.op);
  }
  node.cached = value;
  return value;
}

class Polynom {
  constructor(coeff) {
    this.coeff = coeff;
    this.reduce();
  }

  reduce() {
    let last = this.coeff.length - 1;
    while (last > 0 && this.coeff[last] == 0) --last;
    this.coeff.length = last + 1;
  }

  plus(other) {
    let N = Math.max(this.coeff.length, other.coeff.length);
    let coeff = Array(N).fill(0n);
    for (let i = 0; i < this.coeff.length; ++i) {
      coeff[i] += this.coeff[i];
    }
    for (let i = 0; i < other.coeff.length; ++i) {
      coeff[i] += other.coeff[i];
    }
    return new Polynom(coeff);
  }

  minus(other) {
    let N = Math.max(this.coeff.length, other.coeff.length);
    let coeff = Array(N).fill(0n);
    for (let i = 0; i < this.coeff.length; ++i) {
      coeff[i] += this.coeff[i];
    }
    for (let i = 0; i < other.coeff.length; ++i) {
      coeff[i] -= other.coeff[i];
    }
    return new Polynom(coeff);
  }

  mult(other) {
    if (other.isConstOne()) return this;
    if (this.isConstOne()) return other;
    let N = this.coeff.length + other.coeff.length - 1;
    let coeff = Array(N).fill(0n);
    for (let k = 0; k < N; ++k) {
      for (let i = 0; i <= k && i < this.coeff.length; ++i) {
        let j = k - i;
        if (j < other.coeff.length) {
          coeff[k] += this.coeff[i] * other.coeff[j];
        }
      }
    }
    return new Polynom(coeff);
  }

  divConst(value) {
    if (value == 1) return this;
    return new Polynom(this.coeff.map(x => x / value));
  }

  isConstOne() {
    return this.coeff.length == 1 && this.coeff[0] == 1;
  }
}

class PolyFraction {
  constructor(p, q) {
    let d = gcd(gcdAll(p.coeff), gcdAll(q.coeff));
    this.p = p.divConst(d);
    this.q = q.divConst(d);
  }

  plus(other) {
    let p = this.p.mult(other.q).plus(this.q.mult(other.p));
    let q = this.q.mult(other.q);
    return new PolyFraction(p, q);
  }

  minus(other) {
    let p = this.p.mult(other.q).minus(this.q.mult(other.p));
    let q = this.q.mult(other.q);
    return new PolyFraction(p, q);
  }

  mult(other) {
    let p = this.p.mult(other.p);
    let q = this.q.mult(other.q);
    return new PolyFraction(p, q);
  }

  div(other) {
    let p = this.p.mult(other.q);
    let q = this.q.mult(other.p);
    return new PolyFraction(p, q);
  }
}

function gcd(a, b) {
  if (a < 0) a = -a;
  if (b < 0) b = -b;
  while (a && b) [a, b] = [b, a % b];
  return a + b;
}

function gcdAll(coeff) {
  return coeff.reduce(gcd);
}

function getPolyFractionValue(nodes, name) {
  let node = nodes[name];
  console.assert(node != null, name);
  if (node.cachedPoly !== undefined) return node.cachedPoly;
  if (name == "humn") {
    // return x / 1;
    return (node.cachedPoly = new PolyFraction(
      new Polynom([0n, 1n]),
      new Polynom([1n])));
  }
  if (node.value !== undefined) {
    // return value / 1;
    return (node.cachedPoly = new PolyFraction(
      new Polynom([BigInt(node.value)]),
      new Polynom([1n])));
  }
  let left = getPolyFractionValue(nodes, node.left);
  let right = getPolyFractionValue(nodes, node.right);
  let value;
  if (node.op == '+') {
    value = left.plus(right);
  } else if (node.op == '-') {
    value = left.minus(right);
  } else if (node.op == '*') {
    value = left.mult(right);
  } else if (node.op == '/') {
    value = left.div(right);
  } else {
    console.assert(false, node.op);
  }
  node.cachedPoly = value;
  return value;
}

function getRootEqualityValue(nodes) {
  let root = nodes['root'];
  let left = getPolyFractionValue(nodes, root.left);
  let right = getPolyFractionValue(nodes, root.right);
  let diff = left.minus(right).p;
  let coeff = diff.coeff;
  console.assert(coeff.length == 2, 'Unsupported case:', coeff);
  return -coeff[0] / coeff[1];
}

function solve(input) {
  let nodes = parseInput(input);

  let answer1 = getValue(nodes, 'root');

  let answer2 = getRootEqualityValue(nodes);

  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`);

solve(document.body.textContent);

console.timeEnd('Runtime');
})();

