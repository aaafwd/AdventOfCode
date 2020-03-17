(function() {

function assert(condition) {
  if (condition) return;
  console.assert.apply(console, arguments);
  debugger;
  throw new Error('Assertion failed');
}

class Program {
  constructor(bytecodes, initialInput = [], outputBuffer = undefined) {
    this.executor_ = this.makeExecutor_(bytecodes, initialInput, outputBuffer);
    this.lastResult_ = this.executor_.next();
  }

  isDone() {
    return this.lastResult_.done;
  }

  awaitsInput() {
    return !this.lastResult_.done && this.lastResult_.value === undefined;
  }

  awaitsOutput() {
    return !this.lastResult_.done && this.lastResult_.value !== undefined;
  }

  provideInput(value) {
    assert(this.awaitsInput(), this);
    this.lastResult_ = this.executor_.next(value);
  }

  consumeOutput() {
    assert(this.awaitsOutput(), this);
    const value = this.lastResult_.value;
    this.lastResult_ = this.executor_.next();
    return value;
  }

  * makeExecutor_(prog, input = [], output = undefined) {
    const modesCache = {};
    let i = 0;
    let relative_base = 0;
    let opcode = 99;
    let modes = [];

    function getArgument(argIndex) {
      const mode = modes[argIndex - 1] || 0;
      const index = i + argIndex;
      assert(0 <= index && index < prog.length, index, prog.length);
      if (mode == 0) {
        assert(0 <= prog[index], prog[index]);
        return prog[prog[index]] || 0;
      } else if (mode == 1) {
        return prog[index];
      } else if (mode == 2) {
        let relative_index = relative_base + prog[index];
        assert(0 <= relative_index, relative_base, prog[index]);
        return prog[relative_index] || 0;
      } else {
        assert(0, 'Wrong mode for getArgument: ', mode, index);
      }
    }

    function setArgument(argIndex, value) {
      const mode = modes[argIndex - 1] || 0;
      const index = i + argIndex;
      assert(0 <= index && index < prog.length, index, prog.length);
      if (mode == 0) {
        assert(0 <= prog[index], prog[index]);
        prog[prog[index]] = value;
      } else if (mode == 2) {
        let relative_index = relative_base + prog[index];
        assert(0 <= relative_index, relative_base, prog[index]);
        prog[relative_index] = value;
      } else {
        assert(0, 'Wrong mode for setArgument: ', mode, index);
      }
    }

    function calcDecimals(x) {
      let result = [];
      while (x) {
        result.push(x % 10);
        x = Math.floor(x / 10);
      }
      return result;
    }

    while (i < prog.length) {
      opcode = prog[i] % 100;
      const modesCode = Math.floor(prog[i] / 100);
      modes = (modesCode in modesCache) ?
          modesCache[modesCode] :
          (modesCache[modesCode] = calcDecimals(modesCode));
      if (opcode == 1) {
        setArgument(3, getArgument(1) + getArgument(2));
        i += 4;
      } else if (opcode == 2) {
        setArgument(3, getArgument(1) * getArgument(2));
        i += 4;
      } else if (opcode == 3) {
        const value = input.length ? input.shift() : yield;
        assert(value != undefined, value);
        setArgument(1, value);
        i += 2;
      } else if (opcode == 4) {
        const value = getArgument(1);
        if (output) {
          output.push(value);
        } else {
          yield value;
        }
        i += 2;
      } else if (opcode == 5) {
        if (getArgument(1)) {
          i = getArgument(2);
        } else {
          i += 3;
        }
      } else if (opcode == 6) {
        if (!getArgument(1)) {
          i = getArgument(2);
        } else {
          i += 3;
        }
      } else if (opcode == 7) {
        if (getArgument(1) < getArgument(2)) {
          setArgument(3, 1);
        } else {
          setArgument(3, 0);
        }
        i += 4;
      } else if (opcode == 8) {
        if (getArgument(1) == getArgument(2)) {
          setArgument(3, 1);
        } else {
          setArgument(3, 0);
        }
        i += 4;
      } else if (opcode == 9) {
        relative_base += getArgument(1);
        i += 2;
      } else if (opcode == 99) {
        break;
      } else {
        assert(0, 'Wrong opcode: ', prog[i], i);
        break;
      }
    }
    assert(!input.length, 'Unconsumed input: ', input);
  }
}

function generateInstructionOpcode(str) {
  return str.split("").map(char => char.charCodeAt(0)).concat(10);
}

function getAllInstructions() {
  const OPS = ["AND", "OR", "NOT"];
  const REGISTERS = ["A", "B", "C", "D", "T", "J"];
  let instructions = [];
  for (let op = 0; op < 3; ++op) {
    for (let reg1 = 0; reg1 < 6; ++reg1) {
      for (let reg2 = 4; reg2 < 6; ++reg2) {
        if (reg1 == reg2 && OPS[op] != "NOT") {
          continue;
        }
        const str = OPS[op] + " " + REGISTERS[reg1]+ " " + REGISTERS[reg2];
        const opcode = generateInstructionOpcode(str);
        instructions.push({op, reg1, reg2, str, opcode});
      }
    }
  }
  return instructions;
}

function checkProgram(prog, instructions) {
  let input = [];
  instructions.forEach(({opcode}) => input = input.concat(opcode));
  input = input.concat(generateInstructionOpcode("WALK"));

  let output = [];
  let program = new Program(Array.from(prog), input, output);
  console.assert(program.isDone());

  const isFailed = (output[38] == 39 && output[37] == 110 && output[39] == 116);
  if (!isFailed) {
    console.log("Success:", output);
    console.log(output.map(code => String.fromCharCode(code)).join(""));
  }
  return !isFailed;
}

function solve(prog) {
//   console.time("Runtime");

  const suffix = [
    "NOT A J",
    "OR T J",
    "AND D J",
    "RUN"
  ];

  const scripts = [
    [ // !B && !C
      "NOT B J",
      "NOT C T",
      "AND J T",
    ],
    [ // !C && B
      "NOT C T",
      "AND B T",
    ],
    [ // !C
      "NOT C T",
    ],
    [ // !B && C
      "NOT B T",
      "AND C T",
    ],
    [ // !B
      "NOT B T",
    ],
    [ // (!B && C) || (B && !C)
      "NOT B J",
      "AND C J",
      "NOT C T",
      "AND B T",
      "OR J T",
    ],
    [ // (!B && C) || !C
      "NOT B J",
      "AND C J",
      "NOT C T",
      "OR J T",
    ],
    [ // B && C
      "NOT B J",
      "NOT J T",
      "AND C T",
    ],
    [ // (B && C) || (!B && !C)
      "NOT B J",
      "NOT C T",
      "AND J T",
      "NOT B J",
      "NOT J J",
      "AND C J",
      "OR J T",
    ],
    [ // (B && C) || (B && !C) => B
      "NOT B J",
      "NOT J T",
    ],
    [ // B || (!B && !C)
      "NOT B J",
      "NOT C T",
      "AND J T",
      "OR B T",
    ],
    [ // C
      "NOT C J",
      "NOT J T",
    ],
    [ // C || (!B && !C)
      "NOT B J",
      "NOT C T",
      "AND J T",
      "OR C T",
    ],
    [ // C || (B && !C)
      "NOT C T",
      "AND B T",
      "OR C T",
    ],
  ];

  const allSets = [];
  function generateSets(index = 0, current = []) {
    if (index == 5) {
      if (current.length) allSets.push(Array.from(current));
      return;
    }
    for (let i = 0; i < 2; ++i) {
      if (i) {
        current.push("EFGHI"[index]);
        generateSets(index + 1, current);
        current.pop();
      } else {
        generateSets(index + 1, current);
      }
    }
  }
  generateSets();

  function check(first, middle) {
    const totalLength = first.length + middle.length + suffix.length;
    if (totalLength > 15) return false;
    let input = [];
    first.forEach(str => input = input.concat(generateInstructionOpcode(str)));
    middle.forEach(str => input = input.concat(generateInstructionOpcode(str)));
    suffix.forEach(str => input = input.concat(generateInstructionOpcode(str)));
    let output = [];
    let program = new Program(Array.from(prog), input, output);
    console.assert(program.isDone());
    const isFailed = (output[38] == 39 && output[37] == 110 && output[39] == 116);
    if (!isFailed) {
      console.log("SOLVED!", output, first, middle);
      console.log(output.map(code => String.fromCharCode(code)).join(""));
      return true;
    }
    return false;
  }

  for (let i = 0; i < scripts.length; ++i) {
    for (let set of allSets) {
      for (let negIndex = -1; negIndex < set.length; ++negIndex) {
        let middle = [];
        if (negIndex > 0) [set[0], set[negIndex]] = [set[negIndex], set[0]];
        if (negIndex == -1) {
          middle.push("NOT " + set[0] + " J");
          middle.push("NOT J J");
        } else {
          middle.push("NOT " + set[0] + " J");
        }
        for (let op = 0; op < 2; ++op) {
          // "NOT E J",
          // "AND J T",
          for (let k = 1; k < set.length; ++k) {
            middle.push((op ? "AND " : "OR ") + set[k] + " T");
          }
          if (check(scripts[i], middle)) return;
          if (negIndex > 0) [set[0], set[negIndex]] = [set[negIndex], set[0]];
        }
      }
    }
  }
  console.log("FAILED");



//   console.timeEnd("Runtime");
}

console.clear();
solve([109,2050,21101,966,0,1,21102,13,1,0,1105,1,1378,21101,20,0,0,1106,0,1337,21102,27,1,0,1105,1,1279,1208,1,65,748,1005,748,73,1208,1,79,748,1005,748,110,1208,1,78,748,1005,748,132,1208,1,87,748,1005,748,169,1208,1,82,748,1005,748,239,21101,0,1041,1,21101,0,73,0,1105,1,1421,21102,78,1,1,21101,0,1041,2,21102,1,88,0,1106,0,1301,21101,68,0,1,21102,1041,1,2,21101,103,0,0,1106,0,1301,1102,1,1,750,1105,1,298,21102,1,82,1,21102,1,1041,2,21102,1,125,0,1105,1,1301,1101,0,2,750,1105,1,298,21101,79,0,1,21102,1,1041,2,21101,147,0,0,1105,1,1301,21102,84,1,1,21102,1041,1,2,21102,1,162,0,1105,1,1301,1101,0,3,750,1106,0,298,21102,1,65,1,21101,0,1041,2,21101,184,0,0,1106,0,1301,21101,76,0,1,21101,0,1041,2,21102,1,199,0,1106,0,1301,21102,75,1,1,21102,1041,1,2,21101,0,214,0,1106,0,1301,21102,1,221,0,1106,0,1337,21102,1,10,1,21101,0,1041,2,21101,236,0,0,1105,1,1301,1106,0,553,21102,1,85,1,21102,1,1041,2,21101,0,254,0,1106,0,1301,21101,0,78,1,21102,1,1041,2,21102,269,1,0,1105,1,1301,21101,276,0,0,1105,1,1337,21101,10,0,1,21101,1041,0,2,21101,291,0,0,1105,1,1301,1102,1,1,755,1106,0,553,21102,32,1,1,21101,0,1041,2,21102,313,1,0,1105,1,1301,21101,320,0,0,1105,1,1337,21101,327,0,0,1105,1,1279,2101,0,1,749,21102,65,1,2,21101,0,73,3,21101,0,346,0,1105,1,1889,1206,1,367,1007,749,69,748,1005,748,360,1101,1,0,756,1001,749,-64,751,1106,0,406,1008,749,74,748,1006,748,381,1102,1,-1,751,1105,1,406,1008,749,84,748,1006,748,395,1101,-2,0,751,1105,1,406,21102,1,1100,1,21102,1,406,0,1106,0,1421,21101,32,0,1,21102,1100,1,2,21101,0,421,0,1106,0,1301,21101,428,0,0,1106,0,1337,21101,0,435,0,1105,1,1279,2102,1,1,749,1008,749,74,748,1006,748,453,1101,0,-1,752,1105,1,478,1008,749,84,748,1006,748,467,1101,0,-2,752,1106,0,478,21102,1168,1,1,21102,478,1,0,1105,1,1421,21102,1,485,0,1106,0,1337,21102,10,1,1,21101,1168,0,2,21102,1,500,0,1105,1,1301,1007,920,15,748,1005,748,518,21101,0,1209,1,21101,0,518,0,1105,1,1421,1002,920,3,529,1001,529,921,529,101,0,750,0,1001,529,1,537,101,0,751,0,1001,537,1,545,102,1,752,0,1001,920,1,920,1106,0,13,1005,755,577,1006,756,570,21102,1,1100,1,21101,570,0,0,1106,0,1421,21102,1,987,1,1106,0,581,21101,1001,0,1,21101,0,588,0,1105,1,1378,1101,0,758,594,102,1,0,753,1006,753,654,21002,753,1,1,21102,1,610,0,1105,1,667,21101,0,0,1,21102,621,1,0,1106,0,1463,1205,1,647,21101,0,1015,1,21102,635,1,0,1105,1,1378,21101,0,1,1,21101,646,0,0,1106,0,1463,99,1001,594,1,594,1105,1,592,1006,755,664,1101,0,0,755,1106,0,647,4,754,99,109,2,1101,726,0,757,21201,-1,0,1,21101,9,0,2,21102,1,697,3,21101,0,692,0,1105,1,1913,109,-2,2106,0,0,109,2,1001,757,0,706,1202,-1,1,0,1001,757,1,757,109,-2,2106,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,255,63,223,95,127,191,159,0,162,121,141,62,189,227,116,182,153,247,157,124,254,50,138,77,140,39,170,71,214,111,98,173,166,228,187,172,216,230,218,174,252,243,238,253,229,204,155,94,47,200,119,102,167,60,186,117,38,76,201,177,126,199,249,55,106,53,43,163,107,232,125,86,205,190,220,251,215,237,239,46,42,219,34,178,115,139,78,114,156,203,113,51,212,188,118,61,100,87,202,152,242,56,69,136,101,248,143,168,92,35,221,85,154,198,185,57,206,110,120,58,137,59,158,241,234,196,184,123,233,171,70,183,108,93,197,84,181,235,79,109,179,222,236,68,245,244,213,49,142,103,99,217,250,226,54,207,169,231,246,175,122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,73,110,112,117,116,32,105,110,115,116,114,117,99,116,105,111,110,115,58,10,13,10,87,97,108,107,105,110,103,46,46,46,10,10,13,10,82,117,110,110,105,110,103,46,46,46,10,10,25,10,68,105,100,110,39,116,32,109,97,107,101,32,105,116,32,97,99,114,111,115,115,58,10,10,58,73,110,118,97,108,105,100,32,111,112,101,114,97,116,105,111,110,59,32,101,120,112,101,99,116,101,100,32,115,111,109,101,116,104,105,110,103,32,108,105,107,101,32,65,78,68,44,32,79,82,44,32,111,114,32,78,79,84,67,73,110,118,97,108,105,100,32,102,105,114,115,116,32,97,114,103,117,109,101,110,116,59,32,101,120,112,101,99,116,101,100,32,115,111,109,101,116,104,105,110,103,32,108,105,107,101,32,65,44,32,66,44,32,67,44,32,68,44,32,74,44,32,111,114,32,84,40,73,110,118,97,108,105,100,32,115,101,99,111,110,100,32,97,114,103,117,109,101,110,116,59,32,101,120,112,101,99,116,101,100,32,74,32,111,114,32,84,52,79,117,116,32,111,102,32,109,101,109,111,114,121,59,32,97,116,32,109,111,115,116,32,49,53,32,105,110,115,116,114,117,99,116,105,111,110,115,32,99,97,110,32,98,101,32,115,116,111,114,101,100,0,109,1,1005,1262,1270,3,1262,21001,1262,0,0,109,-1,2106,0,0,109,1,21101,0,1288,0,1106,0,1263,21001,1262,0,0,1101,0,0,1262,109,-1,2106,0,0,109,5,21102,1310,1,0,1106,0,1279,21202,1,1,-2,22208,-2,-4,-1,1205,-1,1332,22102,1,-3,1,21101,0,1332,0,1106,0,1421,109,-5,2105,1,0,109,2,21101,1346,0,0,1105,1,1263,21208,1,32,-1,1205,-1,1363,21208,1,9,-1,1205,-1,1363,1106,0,1373,21102,1370,1,0,1105,1,1279,1105,1,1339,109,-2,2105,1,0,109,5,2101,0,-4,1385,21001,0,0,-2,22101,1,-4,-4,21101,0,0,-3,22208,-3,-2,-1,1205,-1,1416,2201,-4,-3,1408,4,0,21201,-3,1,-3,1105,1,1396,109,-5,2106,0,0,109,2,104,10,21201,-1,0,1,21102,1436,1,0,1106,0,1378,104,10,99,109,-2,2105,1,0,109,3,20002,594,753,-1,22202,-1,-2,-1,201,-1,754,754,109,-3,2106,0,0,109,10,21101,5,0,-5,21102,1,1,-4,21101,0,0,-3,1206,-9,1555,21102,3,1,-6,21101,0,5,-7,22208,-7,-5,-8,1206,-8,1507,22208,-6,-4,-8,1206,-8,1507,104,64,1105,1,1529,1205,-6,1527,1201,-7,716,1515,21002,0,-11,-8,21201,-8,46,-8,204,-8,1106,0,1529,104,46,21201,-7,1,-7,21207,-7,22,-8,1205,-8,1488,104,10,21201,-6,-1,-6,21207,-6,0,-8,1206,-8,1484,104,10,21207,-4,1,-8,1206,-8,1569,21101,0,0,-9,1106,0,1689,21208,-5,21,-8,1206,-8,1583,21101,1,0,-9,1105,1,1689,1201,-5,716,1589,20101,0,0,-2,21208,-4,1,-1,22202,-2,-1,-1,1205,-2,1613,21202,-5,1,1,21101,1613,0,0,1106,0,1444,1206,-1,1634,21202,-5,1,1,21102,1627,1,0,1106,0,1694,1206,1,1634,21102,1,2,-3,22107,1,-4,-8,22201,-1,-8,-8,1206,-8,1649,21201,-5,1,-5,1206,-3,1663,21201,-3,-1,-3,21201,-4,1,-4,1106,0,1667,21201,-4,-1,-4,21208,-4,0,-1,1201,-5,716,1676,22002,0,-1,-1,1206,-1,1686,21102,1,1,-4,1106,0,1477,109,-10,2105,1,0,109,11,21102,0,1,-6,21102,0,1,-8,21102,1,0,-7,20208,-6,920,-9,1205,-9,1880,21202,-6,3,-9,1201,-9,921,1724,21002,0,1,-5,1001,1724,1,1733,20101,0,0,-4,21201,-4,0,1,21101,0,1,2,21102,1,9,3,21102,1,1754,0,1106,0,1889,1206,1,1772,2201,-10,-4,1767,1001,1767,716,1767,20102,1,0,-3,1106,0,1790,21208,-4,-1,-9,1206,-9,1786,22102,1,-8,-3,1106,0,1790,22102,1,-7,-3,1001,1733,1,1796,20102,1,0,-2,21208,-2,-1,-9,1206,-9,1812,21201,-8,0,-1,1105,1,1816,21201,-7,0,-1,21208,-5,1,-9,1205,-9,1837,21208,-5,2,-9,1205,-9,1844,21208,-3,0,-1,1105,1,1855,22202,-3,-1,-1,1106,0,1855,22201,-3,-1,-1,22107,0,-1,-1,1106,0,1855,21208,-2,-1,-9,1206,-9,1869,22102,1,-1,-8,1105,1,1873,22102,1,-1,-7,21201,-6,1,-6,1105,1,1708,22101,0,-8,-10,109,-11,2105,1,0,109,7,22207,-6,-5,-3,22207,-4,-6,-2,22201,-3,-2,-1,21208,-1,0,-6,109,-7,2105,1,0,0,109,5,2102,1,-2,1912,21207,-4,0,-1,1206,-1,1930,21102,1,0,-4,22102,1,-4,1,21201,-3,0,2,21102,1,1,3,21102,1,1949,0,1105,1,1954,109,-5,2106,0,0,109,6,21207,-4,1,-1,1206,-1,1977,22207,-5,-3,-1,1206,-1,1977,22101,0,-5,-5,1106,0,2045,21202,-5,1,1,21201,-4,-1,2,21202,-3,2,3,21102,1996,1,0,1105,1,1954,22101,0,1,-5,21101,0,1,-2,22207,-5,-3,-1,1206,-1,2015,21101,0,0,-2,22202,-3,-2,-3,22107,0,-4,-1,1206,-1,2037,21201,-2,0,1,21101,2037,0,0,105,1,1912,21202,-3,-1,-3,22201,-5,-3,-5,109,-6,2105,1,0]);
})();
