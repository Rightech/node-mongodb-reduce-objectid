/**
 * heavily based on https://github.com/treygriffith/short-mongo-id
 * 
 */

const BASE64_SYMBOLS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'.split('');


function parseMongoId(id) {
  id = id.toString();
  let offset = 0;

  const timestamp = parseInt(id.slice(offset, (offset += 8)), 16);
  const machine = parseInt(id.slice(offset, (offset += 6)), 16);
  const process = parseInt(id.slice(offset, (offset += 4)), 16);
  const counter = parseInt(id.slice(offset, (offset += 6)), 16);

  return {
    timestamp,
    machine,
    process,
    counter
  };
}

function toBase(num, base) {
  let decimal = num;
  let temp;
  let conversion = '';

  if (base > BASE64_SYMBOLS.length || base <= 1) {
    throw new RangeError(`Radix must be less than ${BASE64_SYMBOLS.length} and greater than 1`);
  }

  while (decimal > 0) {
    temp = Math.floor(decimal / base);
    conversion = BASE64_SYMBOLS[(decimal - (base * temp))] + conversion;
    decimal = temp;
  }

  return conversion;
}

function reverse(str) {
  return str.split('').reverse().join('');
}


/**
 * @param {string} id mongo id
 */
function shortenMongoId(id = '') {
  let { timestamp, counter } = parseMongoId(id);

  let date = new Date(timestamp * 1000);
  let time = date.getTime();

  // only use the last 3 digits of the counter to serve as our "milliseconds"
  counter = parseInt(counter.toString().slice(-3), 10);

  // add counter as our millisecond precision to our time
  time = time + counter;

  // convert to 64 base string (not strict base64)
  let str = toBase(time, 64);

  // slice off the first, least variating, character
  // this lowers the entropy, but brings us to 6 characters, which is nice.
  // This will cause a roll-over once every two years, but the counter and the rest of the timestamp should make it unique (enough)
  str = str.slice(1);

  // reverse the string so that the first characters have the most variation
  str = reverse(str);

  return str;
}

shortenMongoId.parse = parseMongoId;

module.exports = shortenMongoId;