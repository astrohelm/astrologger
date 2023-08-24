'use strict';

// module.exports = {};
// библиотека

const fs = require('fs');
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
const LOG_LEVELS = ['LOG', 'INFO', 'WARN', 'ERROR'];

const padNumber = (number) => String(number).padStart(2, '0');
const METHODS = ['getHours', 'getMinutes', 'getSeconds'];

const getCurrentTime = (now = new Date()) =>
  METHODS.map((current) => padNumber(now[current]())).join(':');

const formatMessage = (message) => {
  const timestamp = getCurrentTime();
  return `${timestamp} ${message}`;
};
const getLogFileName = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = padNumber(currentDate.getMonth() + 1);
  const day = padNumber(currentDate.getDate());
  return `${day}-${month}-${year}.log`;
};
class Logger {
  logFile = null;
  stream = null;
  time = null;

  writeLog(message, consoleMessage) {
    this.stream.write(`${message} \n`);
    process.stdout.write(`${consoleMessage} \n`);
  }

  deleteLogFile() {
    fs.unlink(this.logFile, (err) => {
      err
        ? this.error(`Ошибка при удалении логов ${err}`)
        : this.log(`Файл логов ${this.logFile} успешно удален`);
    });
  }
  setLogExpirationTimer(duration) {
    this.timer ? clearTimeout(this.timer) : '';
    this.timer = setTimeout(() => void this.deleteLogFile(), duration);
  }
  createLogfile() {
    this.logFile = getLogFileName();
    this.stream = fs.createWriteStream(this.logFile, { flags: 'a' });

    this.setLogExpirationTimer(TWO_WEEKS);
  }

  info(level, message) {
    if (!LOG_LEVELS.includes(level)) return;
    const formattedMessage = formatMessage(level, message);
    this.writeLog(formattedMessage, message);
  }

  log = this.info.bind(this, 'LOG');
  warn = this.info.bind(this, 'WARN');
  error = this.info.bind(this, 'ERROR');
}

module.exports = Logger;
