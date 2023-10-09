'use strict';
// const events = require('node:events');

const FLUSH_INTERVAL = 3000;

function Logger(opts) {
  let [lock, timer] = [false, null];
  const buffer = [];

  const write = (buff, callback) => {};

  const flush = () => {
    lock = true;
    const copy = Buffer.concat(buffer);
    buffer.length = 0;
    write(copy, () => (lock = false));
  };

  timer = setInterval(flush, opts.interval ?? FLUSH_INTERVAL);
  this.close = async () => {
    clearInterval(timer);
  };
}
