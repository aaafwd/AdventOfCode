// https://adventofcode.com/2023/day/20
// --- Day 20: Pulse Propagation ---

(function() {

function parseInput(input) {
  let config = {};
  input.trim()
    .split('\n')
    .forEach(line => {
      let [, type, src, dsts] = line.match(/^([%&])?(\w+)\s+->\s+(.*)$/);
      dsts = dsts.trim().split(/\s*,\s*/);
      console.assert(config[src] === undefined);
      config[src] = {type, dsts, inputs: new Set()};
    });
  config['rx'] = {type: undefined, dsts: [], inputs: new Set()};
  config['output'] = {type: undefined, dsts: [], inputs: new Set()};
  for (let src in config) {
    for (let dst of config[src].dsts) {
      config[dst].inputs.add(src);
    }
  }
  return config;
}

function gcd(a, b) {
  while (a && b) [a, b] = [b, a % b];
  return a + b;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

class Program {
  constructor(config) {
    this.config_ = config;
    this.runs_ = 0;
    this.flipStates_ = {}; // prefix %
    this.conjStates_ = {}; // prefix &
    this.highPulsesCount_ = 0;
    this.lowPulsesCount_ = 0;
    this.lowOutputs_ = {};
    this.highOutputs_ = {};
  }

  run(count) {
    for (; count > 0; --count) {
      this.runSingle_();
    }
  }

  runSingle_() {
    ++this.runs_;
    let queue = [['broadcaster', 0]];
    ++this.lowPulsesCount_;
    while (queue.length > 0) {
      let next = [];
      while (queue.length > 0) {
        let [src, bit] = queue.shift();
        let {type, dsts, inputs} = this.config_[src];
        for (let dst of dsts) {
          this.sendPulse_(src, bit, dst, next);
        }
        if (bit) {
          this.highOutputs_[src] = this.highOutputs_[src] || [];
          this.highOutputs_[src].push(this.runs_);
        } else {
          // this.lowOutputs_[src] = this.lowOutputs_[src] || [];
          // this.lowOutputs_[src].push(this.runs_);
        }
      }
      queue = next;
    }
  }

  sendPulse_(src, bit, dst, queue) {
    if (bit) {
      ++this.highPulsesCount_;
    } else {
      ++this.lowPulsesCount_;
    }
    if (dst == 'output' || dst == 'rx') return;
    console.assert(this.config_[dst]);
    let type = this.config_[dst].type;
    if (type == '%') {
      this.flipStates_[dst] = this.flipStates_[dst] || 0;
      if (!bit) {
        this.flipStates_[dst] ^= 1;
        queue.push([dst, this.flipStates_[dst]]);
      }
    } else if (type == '&') {
      // Contains 'high' inputs.
      this.conjStates_[dst] = this.conjStates_[dst] || new Set();
      if (bit) {
        this.conjStates_[dst].add(src);
      } else {
        this.conjStates_[dst].delete(src);
      }
      let allHigh = (this.conjStates_[dst].size == this.config_[dst].inputs.size);
      queue.push([dst, allHigh ? 0 : 1]);
    } else {
      console.assert(false, type);
    }
  }

  answer1() {
    return this.highPulsesCount_ * this.lowPulsesCount_;
  }

  answer2() {
    let finalNode = this.config_['rx'];
    if (finalNode.inputs.size == 0) return null;

    // Run more to collect enough data in `this.lowOutputs_` and `this.highOutputs_`.
    this.run(20000);

    // Awaited bit from the `finalNode`: low or high. 
    let awaited = 0;
    while (finalNode.inputs.size == 1) {
      let [parent] = finalNode.inputs;
      let {type} = this.config_[parent];
      if (type == '%') {
        console.assert(false, 'Unsupported case');
      } else if (type == '&') {
        console.assert(awaited == 0);
        awaited = 1;
      } else {
        console.assert(false, type);
      }
      finalNode = this.config_[parent];
    }

    let {type, inputs} = finalNode;
    console.assert(type == '&' && awaited == 1, 'Unsupported case', type, awaited);
    return [...inputs]
      .map(name => this.highOutputs_[name])
      .map(seq => this.checkPeriodicSequence_(seq))
      .reduce(lcm, 1);
  }

  checkPeriodicSequence_(nums) {
    console.assert(nums.length >= 4);
    for (let i = 1; i < nums.length; ++i) {
      console.assert(nums[i] == nums[0] * (i + 1), i, nums);
    }
    return nums[0];
  }
}

function solve(input) {
  let config = parseInput(input);
  let program = new Program(config);
  program.run(1000);

  let answer1 = program.answer1();
  let answer2 = program.answer2();
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`);

solve(`
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`);

solve(document.body.textContent);

})();

