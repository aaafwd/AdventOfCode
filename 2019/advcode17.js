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

function test1(prog) {
  let output = [];
  console.assert(new Program(prog, [], output).isDone());
  let map = [];
  let [x, y] = [0, 0];
  let totalBlocks = 0;
  for (let i = 0; i < output.length; ++i) {
    let code = output[i];
    map[y] = map[y] || [];
    if (code == 35) {
      map[y][x] = '#';
      ++totalBlocks;
    } else if (code == 46) {
      map[y][x] = '.';
    } else if (code == 10) {
      x = -1;
      ++y;
    } else {
      map[y][x] = String.fromCharCode(code);
    }
    ++x;
  }
  console.log(map.map(row => row.join('')).join('\n'));

  const [Y, X] = [map.length, map[0].length];
  const STEPS = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  let result = 0;
  let intersections = 0;
  for (let y = 1; y < Y; ++y) {
    for (let x = 1; x < X; ++x) {
      if (map[y][x] != '#') continue;
      let count = 0;
      for (let [dx, dy] of STEPS) {
        let [nx, ny] = [x + dx, y + dy];
        if (map[ny] && map[ny][nx] != '.') ++count;
      }
      if (count == 4) {
        ++intersections;
        result += x * y;
      }
    }
  }
  console.log('Part 1 result:', result);
  console.log('Total blocks:', totalBlocks);
  console.log('Total intersections:', intersections);
  return map;
}

function compactInstructions(
    instructions, extractedRoutines, mainRoutine, index = 0,
    routine_index = 0) {
  if (index == instructions.length) {
    return routine_index == extractedRoutines.length;
  }

  // Try advancing the |index|.
  for (let ri = 0; ri < routine_index; ++ri) {
    const routine = extractedRoutines[ri];
    const length = routine.length;
    if (index + length > instructions.length) continue;
    let match = true;
    for (let i = 0; i < length; ++i) {
      if (routine[i] != instructions[index + i]) {
        match = false;
        break;
      }
    }
    if (match) {
      mainRoutine.push(ri);
      if (compactInstructions(
              instructions, extractedRoutines, mainRoutine, index + length,
              routine_index))
        return true;
      mainRoutine.pop();
    }
  }

  if (routine_index >= extractedRoutines.length) {
    return false;
  }
  mainRoutine.push(routine_index);
  const routine = extractedRoutines[routine_index] = [];
  for (let i = index; i < instructions.length; ++i) {
    routine.push(instructions[i]);
    if (routine.length > 20) break;
    if (compactInstructions(
            instructions, extractedRoutines, mainRoutine, i + 1,
            routine_index + 1))
      return true;
  }
  mainRoutine.pop();
  return false;
}

function test2(prog) {
  let map = test1(Array.from(prog));
  prog[0] = 2;

  const [Y, X] = [map.length, map[0].length];
  const STEPS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  const DIR_CHARS = ['^', '>', 'v', '<'];
  let [robox, roboy, robodir] = [0, 0, -1];
  let edges = [];
  for (let y = 0; y < Y; ++y) {
    edges[y] = edges[y] || [];
    for (let x = 0; x < X; ++x) {
      let index = DIR_CHARS.indexOf(map[y][x]);
      if (index != -1) {
        [robox, roboy, robodir] = [x, y, index];
      }
      edges[y][x] = 0;
      for (let [dx, dy] of STEPS) {
        let [nx, ny] = [x + dx, y + dy];
        if (map[ny] && map[ny][nx] == '#') ++edges[y][x];
      }
    }
  }
  // console.log("Origin:", robox, roboy, robodir);

  let instructions = [];
  function maybeRotate(newdir) {
    if (robodir == newdir) return;
    if ((robodir + 1) % STEPS.length == newdir) {
      instructions.push('R');
    } else if (robodir == (newdir + 1) % STEPS.length) {
      instructions.push('L');
    } else {
      console.assert(0, 'Unexpected U-turn!', robodir, newdir);
      instructions.push('R', 'R');
    }
    robodir = newdir;
  }
  function runEuler(x, y) {
    edges[y][x] -= 2;
    for (let i = 0, dir = robodir; i < STEPS.length; ++i) {
      let newdir = (dir + i) % STEPS.length;
      let [dx, dy] = STEPS[newdir];
      let [nx, ny] = [x + dx, y + dy];
      if (!map[ny] || !map[ny][nx] || map[ny][nx] == '.') continue;
      if (edges[ny][nx] <= 0) continue;
      maybeRotate(newdir);
      instructions.push(1);
      runEuler(nx, ny);
    }
  }
  runEuler(robox, roboy);
  console.log('Not reduced:', instructions);

  // Reduce instructions.
  let reduced = [];
  for (let i = 0; i < instructions.length; ++i) {
    if (reduced.length && instructions[i] === 1 &&
        typeof reduced[reduced.length - 1] == 'number') {
      ++reduced[reduced.length - 1];
    } else {
      reduced.push(instructions[i]);
    }
  }
  instructions = reduced;
  console.log('Reduced:', instructions);

  let totalMoves =
      reduced.reduce((sum, x) => (sum += typeof x == 'number' ? x : 0), 0);
  console.log('Total moves:', totalMoves);

  let extractedRoutines = [[], [], []];
  let mainRoutine = [];
  console.assert(
      compactInstructions(instructions, extractedRoutines, mainRoutine));
  console.log('Main routine', mainRoutine);
  console.log('Extracted routines', extractedRoutines);

  function makeInputRow(str) {
    return str.split('').map(x => x.charCodeAt(0)).concat(10);
  }

  // Prepare input for the programm.
  let mainRoutineInput = makeInputRow(
      mainRoutine.map(code => String.fromCharCode('A'.charCodeAt(0) + code))
          .join(','));
  console.log(mainRoutineInput);
  let extractedRoutinesInput =
      extractedRoutines.map(routine => makeInputRow(routine.join(',')));
  console.log(extractedRoutinesInput);

  let input = [];
  input = input.concat(mainRoutineInput);
  extractedRoutinesInput.forEach(x => (input = input.concat(x)));
  input.push('n'.charCodeAt(0), 10);
  console.log('Input:', input);

  let output = [];
  console.assert(new Program(prog, input, output).isDone());
  console.log('Output:', output);
  console.log(`Output[${output.length - 1}] =`, output[output.length - 1]);
}

test2([1,330,331,332,109,3272,1102,1,1182,16,1101,0,1427,24,102,1,0,570,1006,570,36,102,1,571,0,1001,570,-1,570,1001,24,1,24,1106,0,18,1008,571,0,571,1001,16,1,16,1008,16,1427,570,1006,570,14,21101,58,0,0,1105,1,786,1006,332,62,99,21102,1,333,1,21102,73,1,0,1106,0,579,1102,1,0,572,1101,0,0,573,3,574,101,1,573,573,1007,574,65,570,1005,570,151,107,67,574,570,1005,570,151,1001,574,-64,574,1002,574,-1,574,1001,572,1,572,1007,572,11,570,1006,570,165,101,1182,572,127,1001,574,0,0,3,574,101,1,573,573,1008,574,10,570,1005,570,189,1008,574,44,570,1006,570,158,1106,0,81,21101,340,0,1,1105,1,177,21101,0,477,1,1105,1,177,21102,1,514,1,21101,176,0,0,1106,0,579,99,21102,1,184,0,1106,0,579,4,574,104,10,99,1007,573,22,570,1006,570,165,1002,572,1,1182,21102,375,1,1,21101,211,0,0,1105,1,579,21101,1182,11,1,21101,222,0,0,1106,0,979,21101,0,388,1,21101,0,233,0,1105,1,579,21101,1182,22,1,21101,0,244,0,1105,1,979,21102,401,1,1,21101,255,0,0,1106,0,579,21101,1182,33,1,21102,266,1,0,1105,1,979,21101,414,0,1,21101,0,277,0,1106,0,579,3,575,1008,575,89,570,1008,575,121,575,1,575,570,575,3,574,1008,574,10,570,1006,570,291,104,10,21102,1,1182,1,21101,313,0,0,1105,1,622,1005,575,327,1101,0,1,575,21102,327,1,0,1106,0,786,4,438,99,0,1,1,6,77,97,105,110,58,10,33,10,69,120,112,101,99,116,101,100,32,102,117,110,99,116,105,111,110,32,110,97,109,101,32,98,117,116,32,103,111,116,58,32,0,12,70,117,110,99,116,105,111,110,32,65,58,10,12,70,117,110,99,116,105,111,110,32,66,58,10,12,70,117,110,99,116,105,111,110,32,67,58,10,23,67,111,110,116,105,110,117,111,117,115,32,118,105,100,101,111,32,102,101,101,100,63,10,0,37,10,69,120,112,101,99,116,101,100,32,82,44,32,76,44,32,111,114,32,100,105,115,116,97,110,99,101,32,98,117,116,32,103,111,116,58,32,36,10,69,120,112,101,99,116,101,100,32,99,111,109,109,97,32,111,114,32,110,101,119,108,105,110,101,32,98,117,116,32,103,111,116,58,32,43,10,68,101,102,105,110,105,116,105,111,110,115,32,109,97,121,32,98,101,32,97,116,32,109,111,115,116,32,50,48,32,99,104,97,114,97,99,116,101,114,115,33,10,94,62,118,60,0,1,0,-1,-1,0,1,0,0,0,0,0,0,1,40,26,0,109,4,2101,0,-3,586,21001,0,0,-1,22101,1,-3,-3,21102,1,0,-2,2208,-2,-1,570,1005,570,617,2201,-3,-2,609,4,0,21201,-2,1,-2,1105,1,597,109,-4,2106,0,0,109,5,1201,-4,0,629,21002,0,1,-2,22101,1,-4,-4,21102,0,1,-3,2208,-3,-2,570,1005,570,781,2201,-4,-3,652,21002,0,1,-1,1208,-1,-4,570,1005,570,709,1208,-1,-5,570,1005,570,734,1207,-1,0,570,1005,570,759,1206,-1,774,1001,578,562,684,1,0,576,576,1001,578,566,692,1,0,577,577,21102,702,1,0,1105,1,786,21201,-1,-1,-1,1106,0,676,1001,578,1,578,1008,578,4,570,1006,570,724,1001,578,-4,578,21101,0,731,0,1106,0,786,1105,1,774,1001,578,-1,578,1008,578,-1,570,1006,570,749,1001,578,4,578,21102,1,756,0,1105,1,786,1106,0,774,21202,-1,-11,1,22101,1182,1,1,21101,774,0,0,1106,0,622,21201,-3,1,-3,1105,1,640,109,-5,2105,1,0,109,7,1005,575,802,20101,0,576,-6,20102,1,577,-5,1106,0,814,21101,0,0,-1,21101,0,0,-5,21102,0,1,-6,20208,-6,576,-2,208,-5,577,570,22002,570,-2,-2,21202,-5,45,-3,22201,-6,-3,-3,22101,1427,-3,-3,1202,-3,1,843,1005,0,863,21202,-2,42,-4,22101,46,-4,-4,1206,-2,924,21101,1,0,-1,1105,1,924,1205,-2,873,21102,35,1,-4,1105,1,924,2102,1,-3,878,1008,0,1,570,1006,570,916,1001,374,1,374,2102,1,-3,895,1101,0,2,0,2102,1,-3,902,1001,438,0,438,2202,-6,-5,570,1,570,374,570,1,570,438,438,1001,578,558,921,21001,0,0,-4,1006,575,959,204,-4,22101,1,-6,-6,1208,-6,45,570,1006,570,814,104,10,22101,1,-5,-5,1208,-5,41,570,1006,570,810,104,10,1206,-1,974,99,1206,-1,974,1101,0,1,575,21101,973,0,0,1105,1,786,99,109,-7,2105,1,0,109,6,21101,0,0,-4,21102,0,1,-3,203,-2,22101,1,-3,-3,21208,-2,82,-1,1205,-1,1030,21208,-2,76,-1,1205,-1,1037,21207,-2,48,-1,1205,-1,1124,22107,57,-2,-1,1205,-1,1124,21201,-2,-48,-2,1106,0,1041,21101,-4,0,-2,1105,1,1041,21102,-5,1,-2,21201,-4,1,-4,21207,-4,11,-1,1206,-1,1138,2201,-5,-4,1059,2102,1,-2,0,203,-2,22101,1,-3,-3,21207,-2,48,-1,1205,-1,1107,22107,57,-2,-1,1205,-1,1107,21201,-2,-48,-2,2201,-5,-4,1090,20102,10,0,-1,22201,-2,-1,-2,2201,-5,-4,1103,2102,1,-2,0,1106,0,1060,21208,-2,10,-1,1205,-1,1162,21208,-2,44,-1,1206,-1,1131,1106,0,989,21101,0,439,1,1106,0,1150,21102,477,1,1,1105,1,1150,21101,0,514,1,21101,0,1149,0,1106,0,579,99,21101,1157,0,0,1106,0,579,204,-2,104,10,99,21207,-3,22,-1,1206,-1,1138,1202,-5,1,1176,1202,-4,1,0,109,-6,2106,0,0,28,11,34,1,9,1,34,1,9,1,34,1,9,1,34,1,9,1,34,1,9,1,34,1,5,5,34,1,5,1,24,13,1,1,5,1,24,1,11,1,1,1,5,1,24,1,3,5,3,1,1,9,22,1,3,1,3,1,3,1,7,1,1,1,22,1,3,1,3,1,3,13,20,1,3,1,3,1,11,1,1,1,1,1,6,7,5,11,11,1,1,10,5,1,5,1,1,1,3,1,15,1,3,1,5,2,5,1,3,5,3,1,15,1,3,1,5,2,5,1,3,1,1,1,5,1,15,1,3,1,5,2,5,13,15,9,1,2,9,1,1,1,25,1,3,1,1,2,9,1,1,1,25,1,3,1,1,2,9,1,1,1,25,1,3,1,1,2,9,1,1,1,25,5,1,2,9,1,1,1,31,12,1,1,31,1,12,1,31,1,12,9,19,5,20,1,44,1,44,1,34,5,5,1,34,1,3,1,5,1,34,1,3,1,5,1,34,1,3,1,5,1,34,1,3,1,5,1,34,1,3,1,5,1,34,11,38,1,44,1,44,1,44,13,18]);

})();
