// https://adventofcode.com/2021/day/16
// --- Day 16: Packet Decoder ---

(function() {

function toBinary(input) {
  return input
    .split('')
    .map(hex => parseInt(hex, 16).toString(2).padStart(4, '0'))
    .join('');
}

function parseLiteral(bits, index) {
  let result = [];
  while (1) {
    let group = bits[index++];
    result.push(bits.substring(index, index + 4));
    index += 4;
    if (group == 0) break;
  }
  return [index, parseInt(result.join(''), 2)];
}

function parsePackets(bits) {
  let packets = [];
  let index = 0;
  while (index + 6 < bits.length) {
    let [next, packet] = parsePacket(bits, index);
    index = next;
    packets.push(packet);
  }
  return packets;
}

function parsePacket(bits, index = 0) {
  console.assert(index < bits.length);
  let packet = {};
  packet.version = parseInt(bits.substring(index, index + 3), 2);
  index += 3;
  packet.type = parseInt(bits.substring(index, index + 3), 2);
  index += 3;
  if (packet.type == 4) {
    let literal;
    [index, literal] = parseLiteral(bits, index);
    packet.literal = literal;
  } else {
    let mode = bits[index++];
    if (mode == 0) {
      let sub_length = parseInt(bits.substring(index, index + 15), 2);
      index += 15;
      packet.sub_packets = parsePackets(bits.substring(index, index + sub_length));
      index += sub_length;
    } else {
      let num_sub_packets = parseInt(bits.substring(index, index + 11), 2);
      index += 11;
      packet.sub_packets = [];
      while (num_sub_packets-- > 0) {
        let sub_packet;
        [index, sub_packet] = parsePacket(bits, index);
        packet.sub_packets.push(sub_packet);
      }
    }
  }
  return [index, packet];
}

function sumAllVersions(packet) {
  return (packet.sub_packets || [])
    .map(sumAllVersions)
    .reduce((x, y) => x + y, packet.version);
}

function calculateValue(packet) {
  if (packet.type == 4) {
    return packet.literal;
  }
  let sub_values = packet.sub_packets.map(calculateValue);
  switch (packet.type) {
    case 0:
      return sub_values.reduce((x, y) => x + y, 0);
    case 1:
      return sub_values.reduce((x, y) => x * y, 1);
    case 2:
      return Math.min(...sub_values);
    case 3:
      return Math.max(...sub_values);
    case 5:
      console.assert(sub_values.length == 2);
      return sub_values[0] > sub_values[1] ? 1 : 0;
    case 6:
      console.assert(sub_values.length == 2);
      return sub_values[0] < sub_values[1] ? 1 : 0;
    case 7:
      console.assert(sub_values.length == 2);
      return sub_values[0] == sub_values[1] ? 1 : 0;
  }
}

function solve(input) {
  let bits = toBinary(input.trim());
  let [, packet] = parsePacket(bits);
  let answer1 = sumAllVersions(packet);
  let answer2 = calculateValue(packet);
  console.log('Answer 1:', answer1, 'Answer 2:', answer2);
}

solve(`8A004A801A8002F478`);
solve(`620080001611562C8802118E34`);
solve(`C0015000016115A2E0802F182340`);
solve(`A0016C880162017C3686B18A3D4780`);

solve(`C200B40A82`);
solve(`04005AC33890`);
solve(`880086C3E88112`);
solve(`CE00C43D881120`);
solve(`D8005AC2A8F0`);
solve(`F600BC2D8F`);
solve(`9C005AC2F8F0`);
solve(`9C0141080250320F1802104A08`);

solve(document.body.textContent);

})();

