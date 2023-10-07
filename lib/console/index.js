'use strict';

const { clear, rgb } = require('./utils');
const methods = require('./methods');

const Console = function (write) {
  Object.entries(methods).forEach(([key, method]) => {
    const { lvl, color, parser, callback } = method;
    this[key] = (...args) => {};
  });
  this.clear = clear;
};
