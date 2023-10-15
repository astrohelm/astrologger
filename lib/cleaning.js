'use strict';
const [{ join }, { unlink, readdir }] = [require('node:path'), require('node:fs').promises];
const astropack = require('astropack');
const FILE_DATE_LEN = 10;
const filedate = filename => filename.substring(0, FILE_DATE_LEN);
const rotate = async (opts, emit) => {
  if (!opts.keep) return;
  const now = new Date();
  const promises = [];
  try {
    const files = await readdir(opts.path);
    for (const filename of files) {
      if (astropack.fs.file.ext(filename) !== '.log') continue;
      if (astropack.time.diff(now, new Date(filedate(filename))) < opts.keep) continue;
      promises.push(unlink(join(opts.path, filename)));
    }
    await Promise.all(promises);
  } catch (err) {
    process.stdout.write(`${err.stack}\n`);
    emit('error', err);
  }
};
//переключение потока и добавление таймера

module.exports = rotate;
