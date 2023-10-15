'use strict';
const astropack = require('astropack');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('node:path');

const createMethod = (transports, config) => message => {
  const log = {
    lvl: config.lvl,
    timestamp: new Date().getTime(),
    message: config.format(message),
    meta: {},
  };

  for (const transport of transports) transport.write(log);
};

function Logger(options = {}) {
  const emitter = new EventEmitter();
  const emit = emitter.emit.bind(emitter);
  const transports = (options.transports || [consoleTransport()]).map(transport => transport(emit));
  const methods = options.methods || { log: { lvl: 'trace', format: msg => msg } };
  for (const key in methods) this[key] = createMethod(transports, methods[key]);
  this.on = emitter.on.bind(emitter);
  // const levels = options.lvls || { trace: 10 };
  // const meta = options.meta || {};
}

const consoleTransport = options => {
  const timeFormat = options.timeFormat || 'h:m:s.i';
  return () => ({
    destroy: () => {},
    write: data => {
      const timeReadeable = astropack.time.prettify(timeFormat, data.timestamp);
      process.stdout.write(`[${timeReadeable}] ${data.lvl.toUpperCase()}: ${data.message}\n`);
    },
  });
};

const fileTransport = options => {
  // User init
  astropack.fs.dir.ensure(options.path);
  const writeInterval = options.writeInterval || 0;

  return emit => {
    const filepath = path.join(options.path, astropack.time.prettify('Y-M-D') + '.log');
    const stream = fs.createWriteStream(filepath, { flags: 'a' });
    //
    const logBuffer = [];
    const writeLogBufferToFile = () => {
      if (logBuffer.length > 0) {
        const logsToWrite = logBuffer.join('\n');
        stream.write(logsToWrite, error => void (error && emit('error', error)));
        logBuffer.length = 0;
      }
    };
    const logBufferTimer = setInterval(() => {
      writeLogBufferToFile();
    }, writeInterval);
    // Logger init
    return {
      destroy: () => {
        clearInterval(logBufferTimer);
        writeLogBufferToFile();
        stream.end();
      },
      write: ({ lvl, message }) => {
        const time = astropack.time.prettify('h:m:s.i');
        const msg = `[${time}] ${lvl.toUpperCase()}: ${message}`;
        // stream.write(msg, error => void (error && emit('error', error)));
        logBuffer.push(msg);
        // логика ротации
        // перезпустить транспорт после ошибки(event emmiter в параметр)
      },
    };
  };
};

const lvls = { trace: 10, debug: 20, info: 30, warn: 40, error: 50, fatal: 60 };
const methods = {
  info: { lvl: 'trace', format: msg => msg },
  log: { lvl: 'trace', format: msg => msg },
  error: { lvl: 'error', format: msg => msg.stack },
};
const pathFile = '/logs';
const keep = 3;
const timeFormat = 'h:m:s.i';
const writeInterval = 3000;
const writeBuffer = 32 * 1024; // максимальный вес флаша на диск(за 1-у запись на диск) килобайт
const opt = {
  transports: [
    consoleTransport({ timeFormat, lvl: ['trace'] }),
    fileTransport({
      path: __dirname + `${pathFile}`,
      keep,
      writeInterval,
      writeBuffer,
      lvl: ['trace'],
    }),
  ],
  lvls,
  methods,
  meta: {},
};
const logger = new Logger(opt);

logger.info('Пример логгирования');
logger.log('Пример логгирования (не обязателен)');
