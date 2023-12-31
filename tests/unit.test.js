'use strict';

const test = require('node:test');
const fs = require('fs');
const assert = require('node:assert');
const { createLogger } = require('..');
test('First test', () => {
  const loggerConfig = {
    path: './logs',
    writeInterval: 3000,
    writeBuffer: 64 * 1024,
    keepDays: 14,
    json: false,
  };

  const astrolog = createLogger(loggerConfig);

  astrolog.info('Пример лога');
  astrolog.warn('Пример предупреждения');
  astrolog.error('Пример ошибки');
  astrolog.close();
});
