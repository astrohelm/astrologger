'use strict';

const lvls = { trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60 };

const methods = {
  log: { lvl: 'trace', format: msg => msg },
  error: { lvl: 'error', format: msg => msg.stack },
};

const lvls = { ...default_lvls, ...custom_lvls };

lvls[opts.lvl] <= lvls[lvl];

Logger({
  transports: [console({ lvl: 'silent' })],
  lvls,
  methods,
  meta: {},
});

logger.child({ pid: process.pid, port: 300 });
