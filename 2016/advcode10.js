// https://adventofcode.com/2016/day/10
// --- Day 10: Balance Bots ---

(function() {

function parseInput(input) {
  const regex_value = /^value (\d+) goes to bot (\d+)$/;
  const regex_gives = /^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/;
  let lines = input.trim().split('\n'), match;
  let commands = [];
  for (let line of lines) {
    if ((match = line.match(regex_value))) {
      let [, value, bot] = match;
      commands.push({bot: +bot, value: +value});
    } else if ((match = line.match(regex_gives))) {
      let [, bot, low_output, low_num, high_output, high_num] = match;
      let cmd = {bot: +bot};
      if (low_output == 'bot') {
        cmd.low_bot = +low_num;
      } else {
        cmd.low_output = +low_num;
      }
      if (high_output == 'bot') {
        cmd.high_bot = +high_num;
      } else {
        cmd.high_output = +high_num;
      }
      commands.push(cmd);
    } else {
      console.assert(0, line);
    }
  }
  return commands;
}

function simulate(commands, value1, value2) {
  let bots = {};
  let outputs = {};

  if (value1 > value2) [value1, value2] = [value2, value1];
  let compared_bot = -1;

  function getBotById(id) {
    return (bots[id] = bots[id] || {id, values: [], queue: []});
  }

  function getOutputById(id) {
    return (outputs[id] = outputs[id] || {id, values: []});
  }

  function runQueue(bot) {
    if (bot.values.length != 2) return;
    if (bot.queue.length == 0) return;
    let cmd = bot.queue.shift();
    let [v1, v2] = bot.values;
    bot.values.length = 0;
    if (v1 > v2) [v1, v2] = [v2, v1];
    if (v1 == value1 && v2 == value2) compared_bot = bot.id;
    if (cmd.low_bot !== undefined) {
      let low_bot = getBotById(cmd.low_bot);
      low_bot.values.push(v1);
      runQueue(low_bot);
    } else {
      let low_output = getOutputById(cmd.low_output);
      low_output.values.push(v1);
    }
    if (cmd.high_bot !== undefined) {
      let high_bot = getBotById(cmd.high_bot);
      high_bot.values.push(v2);
      runQueue(high_bot);
    } else {
      let high_output = getOutputById(cmd.high_output);
      high_output.values.push(v2);
    }
  }
  
  for (let cmd of commands) {
    let bot = getBotById(cmd.bot);
    if (cmd.value !== undefined) {
      bot.values.push(cmd.value);
    } else {
      bot.queue.push(cmd);
    }
    runQueue(bot);
  }

  let output_mult = 1;
  for (let i = 0; i < 3; ++i) {
    let output = getOutputById(i);
    console.assert(output.values.length == 1);
    output_mult *= output.values[0];
  }

  return [compared_bot, output_mult];
}

function solve(input, value1, value2) {
  let commands = parseInput(input);
  let [answer1, answer2] = simulate(commands, value1, value2);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`
value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2
`, 5, 2);

solve(document.body.textContent, 61, 17);

})();

