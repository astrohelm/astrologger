'use strict';

const test = require('node:test');
const fs = require('fs');
const assert = require('node:assert');
const { createLogger } = require('..');
test('First test', () => {
  const opts = {
    path: './log',
    writeInterval: 100,
    writeBuffer: 64 * 1024,
    keepDays: 0,
    json: false,
  };

  const astrolog = createLogger(opts);

  astrolog.log('Пример лога');
  astrolog.info('Пример информационного лога');
  astrolog.warn('Пример предупреждения');
  astrolog.error('Пример ошибки');
  const deleteLogFile = (logFile) => {
    fs.rmSync(logFile, { recursive: true }, (err) => {
      err
        ? console.error(`Ошибка при удалении файла логов: ${err}`)
        : console.info(`Файл логов ${logFile} успешно удален.`);
    });
  };
  setTimeout(() => {
    deleteLogFile(opts.path);
    process.exit(0);
  }, 5000);
});
