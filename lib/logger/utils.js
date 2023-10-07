'use strict';

const { time } = require('astropack');

const FILE_DATE_LEN = 10;
const FILE_PATTERN = 'Y-M-D';
const DAY = time.duration('1d');

const filename = (marker = '') => time.prettify(FILE_PATTERN) + `|${marker}.log`;
const filedate = filename => filename.substring(0, FILE_DATE_LEN);
const timecalc = () => time.diff(DAY + new Date().setUTCHours(0, 0, 0, 0), new Date());

module.exports = { filename, filedate, timecalc };
