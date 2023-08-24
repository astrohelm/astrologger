'use strict';

const fs = require('fs');
const path = require('path');

const padNumber = (number) => String(number).padStart(2, '0');

const getCurrentTime = () => {
  const now = new Date();
  const hours = padNumber(now.getHours());
  const minutes = padNumber(now.getMinutes());
  const seconds = padNumber(now.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

const formatMessage = (level, message) => {
  const timestamp = getCurrentTime();
  return `${timestamp} [${level}] ${message}`;
};
const deleteLogFile = (logFile) => {
  fs.unlink(logFile, (err) => {
    if (err) {
      console.error(`Ошибка при удалении файла логов: ${err}`);
    } else {
      console.info(`Файл логов ${logFile} успешно удален.`);
    }
  });
};
const setLogExpirationTimer = (logFilePath, keepDays) => {
  const deleteDate = new Date();
  deleteDate.setDate(deleteDate.getDate() - keepDays);

  const checkDelete = () => {
    if (fs.existsSync(logFilePath)) {
      const fileDate = new Date(fs.statSync(logFilePath).ctime);
      if (fileDate <= deleteDate) {
        deleteLogFile(logFilePath);
      }
    }
  };

  setInterval(checkDelete, 60 * 60 * 1000);
};
const getLogFilePath = (config) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = padNumber(currentDate.getMonth() + 1);
  const day = padNumber(currentDate.getDate());
  const fileName = config.json ? `${year}-${month}-${day}.json` : `${year}-${month}-${day}.log`;
  return path.join(config.path, fileName);
};
const createLogFile = (config) => {
  const logFilePath = getLogFilePath(config);

  if (!fs.existsSync(config.path)) {
    fs.mkdirSync(config.path, { recursive: true });
  }

  const stream = fs.createWriteStream(logFilePath, {
    flags: 'a',
    defaultEncoding: 'utf8',
    highWaterMark: config.writeBuffer,
  });

  setLogExpirationTimer(logFilePath, config.keepDays);

  return stream;
};

const logger = (stream, levels, config) => {
  let lastLogTime = new Date().getTime();

  const logFunctions = {};

  levels.forEach((level) => {
    logFunctions[level.toLowerCase()] = (message) => {
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lastLogTime;
      const delay = Math.max(0, config.writeInterval - timeElapsed);
      lastLogTime = currentTime + delay;

      setTimeout(() => {
        const formattedMessage = formatMessage(level, message);
        stream.write(`${formattedMessage}\n`);
        process.stdout.write(`${formattedMessage}\n`);
      }, delay);
    };
  });

  return logFunctions;
};

const createLogger = (config) => {
  const logFileStream = createLogFile(config);
  return logger(logFileStream, ['LOG', 'INFO', 'WARN', 'ERROR'], config);
};

const opts = {
  path: './log',
  writeInterval: 3000,
  writeBuffer: 64 * 1024,
  keepDays: 5,
  json: false,
};

const log = createLogger(opts);

log.log('Пример лога');
log.info('Пример информационного лога');
log.warn('Пример предупреждения');
log.error('Пример ошибки');
