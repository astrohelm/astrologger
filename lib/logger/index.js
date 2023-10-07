'use strict';

const [path, EventEmitter] = [require('node:path'), require('node:events').EventEmitter];
const { timecalc, filename: getFilename } = require('./utils');
const { fs: astrofs } = require('astropack');
const Console = require('../console');
const rotate = require('./rotate');

const Logger = function (opts) {
  const bridge = new EventEmitter();
  const buffer = [];
  let active = false;
  let reopen = null;

  const open = async () => {
    if (active) return bridge;
    active = true;

    if (!opts.path || (!opts.lvl?.file?.length && !opts.lvl?.length)) {
      process.nextTick(() => bridge.emit('open'));
      return bridge;
    }

    await astrofs.dir.ensure(opts.path).catch(err => bridge.emit('error', err));
    const filename = getFilename(opts.marker);
    const filepath = path.join(opts.path, filename);

    reopen = setTimeout(() => {
      bridge.once('close', bridge.open);
      bridge.close().catch(err => {
        process.stdout.write(`${err.stack}\n`);
        bridge.emit('error', err);
      });
    }, timecalc());

    return bridge;
  };

  const write = line => buffer.push(Buffer.from(line + '\n'));
  bridge.console = new Console(opts, opts.path ? write : undefined);
  bridge.close = () => {};

  return bridge.open();
};

module.exports = Logger;
module.exports.open = opts => new Logger(opts);
