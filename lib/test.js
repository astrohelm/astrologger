'use strict';
// const astropack = require('astropack');
// const path = require('node:path');
// const fsp = require('node:fs').promises;
// const clean = async (dirPath, keep) => {
//   const files = await fsp.readdir(dirPath, { withFileTypes: true });
//   for (const file of files) {
//     if (!file.isFile()) continue;
//     if (!file.name.endsWith('.log')) continue;
//     const fileDate = file.name.substring(0, 10);
//     const diffTime = astropack.time.diff(new Date(), new Date(fileDate), 'd');
//     if (diffTime < keep) continue;

//     const filePath = path.join(file.path, file.name);
//     console.log(filePath);
//     fsp.unlink(filePath);
//   }
// };
// clean('.', 3);

const [{ join }, { unlink, readdir }] = [require('node:path'), require('node:fs').promises];
const { filedate } = require('./logger/utils');
const astropack = require('astropack');

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

module.exports = rotate;
