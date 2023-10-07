'use strict';

const readline = require('node:readline');
const util = require('node:util');

const format = (...args) => {
  const isError = type === '';
};

const clear = () => {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
};

const rgb = rgb => `\x1b[38;2;${rgb}m"\x1b[0m`;
module.exports = { clear, rgb };
