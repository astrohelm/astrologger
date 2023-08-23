'use strict';

// module.exports = {};
// библиотека

const fs = require('fs');
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
class Logger {
  constructor() {
    this.logFile = null;
    this.stream = null;
    this.time = null;
    this.logLevels = ['LOG', 'INFO', 'WARN', 'ERROR'];
  }
  padNumber(number) {
    return String(number).padStart(2, '0');
  }
  writeLog(message, consoleMessage) {
    this.stream.write(`${message} \n`);
    process.stdout.write(`${consoleMessage} \n`);
  }
  getCurrentTime() {
    const now = new Date();
    const hours = this.padNumber(now.getHours());
    const minutes = this.padNumber(now.getMinutes());
    const seconds = this.padNumber(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
  }
  formatMessage(message) {
    const timestamp = this.getCurrentTime();
    return `${timestamp} ${message}`;
  }
  getLogFileName() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = this.padNumber(currentDate.getMonth() + 1);
    const day = this.padNumber(currentDate.getDate());
    return `${day}-${month}-${year}.log`;
  }
  deleteLogFile() {
    fs.unlink(this.logFile, err => {
      err
        ? this.error(`Ошибка при удалении логов ${err}`)
        : this.log(`Файл логов ${this.logFile} успешно удален`);
    });
  }
  setLogExpirationTimer(duration) {
    this.timer ? clearTimeout(this.timer) : '';

    this.timer = setTimeout(() => {
      this.deleteLogFile();
    }, duration);
  }
  createLogfile() {
    this.logFile = this.getLogFileName();
    this.stream = fs.createWriteStream(this.logFile, { flags: 'a' });
    this.setLogExpirationTimer(TWO_WEEKS);
  }

  info(level, message) {
    if (this.logLevels.includes(level)) {
      const formattedMessage = this.formatMessage(level, message);
      this.writeLog(formattedMessage, message);
    }
  }
  log(message) {
    this.info('LOG', message);
  }
  warn(message) {
    this.info('WARN', message);
  }
  error(message) {
    this.info('ERROR', message);
  }
}

const logger = new Logger();

logger.createLogfile();

logger.warn('1323333');
logger.log('sda');
logger.error('erra1');
