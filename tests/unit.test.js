'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { Logger } = require('..');

test('First test', () => {
  const logger = new Logger();
  logger.createLogfile();
  logger.warn('1323333');
  logger.log('sda');
  logger.error('erra1');
});

// pino, metalog
