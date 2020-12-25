// https://adventofcode.com/2020/day/18

(function() {

let kOperatorPriority = {'+': 0, '*': 0};

function evaluateInfixOrder(infix) {
  let priority = Math.max(...Object.values(kOperatorPriority));
  for (; priority >= 0; --priority) {
    let next = [infix[0]];
    for (let i = 1; i < infix.length; i += 2) {
      const op = infix[i];
      if (kOperatorPriority[op] != priority) {
        next.push(op, infix[i + 1]);
      } else if (op == '+') {
        next[next.length - 1] += infix[i + 1];
      } else if (op == '*') {
        next[next.length - 1] *= infix[i + 1];
      } else {
        console.error("Unknown op: " + op);
      }
    }
    infix = next;
  }
  console.assert(infix.length == 1);
  return infix[0];
}

function evaluate(expr, offset = 0) {
  let infix = [];
  while (offset < expr.length) {
    if (expr[offset] == ')') {
      return [evaluateInfixOrder(infix), offset];
    }
    if ('0' <= expr[offset] && expr[offset] <= '9') {
      let value = 0;
      while ('0' <= expr[offset] && expr[offset] <= '9') {
        value = value * 10 + Number(expr[offset++]);
      }
      infix.push(value);
    } else if (expr[offset] == '(') {
      let value = 0;
      [value, offset] = evaluate(expr, offset + 1);
      console.assert(expr[offset] == ')');
      ++offset;
      infix.push(value);
    } else {
      infix.push(expr[offset++]);
    }
  }
  return [evaluateInfixOrder(infix), offset];
}

function solve(input) {
  let expressions = input.trim().split('\n').map(line => line.replaceAll(' ', ''));

  function evaluateAll() {
    let sum = 0;
    for (let expr of expressions) {
      let [result, offset] = evaluate(expr);
      console.assert(offset == expr.length);
      sum += result;
    }
    return sum;
  }

  kOperatorPriority = {'+': 0, '*': 0};
  console.log("Answer 1:", evaluateAll());

  kOperatorPriority = {'+': 1, '*': 0};
  console.log("Answer 2:", evaluateAll());

  // Self-test: Evaluate normal math and check against the builtin `eval()`.
  kOperatorPriority = {'+': 0, '*': 1};
  for (let expr of expressions) {
    console.assert(evaluate(expr)[0] == eval(expr));
  }
}

solve(`1 + 2 * 3 + 4 * 5 + 6`);
solve(`1 + (2 * 3) + (4 * (5 + 6))`);
solve(`2 * 3 + (4 * 5)`);
solve(`5 + (8 * 3 + 9 + 3 * 4 * 3)`);
solve(`5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`);
solve(`((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`);

solve(document.body.textContent);

})();

