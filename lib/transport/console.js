'use strict';

const TData = {
  lvl: 'info', // Warning, fatal, silent...
  timestamp: 0, // Number
  message: 'Hello world',
  meta: {}, // Meta information:: { pid: 123, service: { host: 'localhost', port: 3000 }, ...any };
};

// Expected:
// [08:41:11.655] INFO: Hello world
const consoleTransport = options => {
  let buffer = [];

  const write = data => {
    buffer.push(data);
  };

  const timer = setInterval(() => {
    const copy = Buffer.concat(buffer);
    buffer.length = 0;
    //...
  }, 300);

  return { write, destroy: () => { clearInterval(timer);  } };
};


const Logger;
const logger = new Logger({
  transports: [ consoleTransport(), fileTransport({ lvl: 'warning', path: __dirname + './logs' }) ],
});

loggger.log()
