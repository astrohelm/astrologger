'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const defaultConfig = {
  path: './logs',
  writeInterval: 3000,
  writeBuffer: 64 * 1024,
  keepDays: 14,
  json: false,
};

const createLogger=(config)=> {
  const mergedConfig = { ...defaultConfig, ...config };

  if (!fs.existsSync(mergedConfig.path)) {
    fs.mkdirSync(mergedConfig.path, { recursive: true });
  }

  const getLogFilePath = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return path.join(mergedConfig.path, `${year}-${month}-${day}.log`);
  };

  const logFile = getLogFilePath();

  const stream = fs.createWriteStream(logFile, {
    flags: 'a',
    highWaterMark: mergedConfig.writeBuffer,
  });

  const deleteOldLogs = () => {
    const files = fs.readdirSync(mergedConfig.path);
    const currentDate = new Date();
    const deleteDate = new Date(currentDate);
    deleteDate.setDate(deleteDate.getDate() - mergedConfig.keepDays);

    files.forEach((file) => {
      const filePath = path.join(mergedConfig.path, file);
      const fileDate = new Date(fs.statSync(filePath).ctime);
      if (fileDate < deleteDate) {
        fs.unlinkSync(filePath);
      }
    });
  };

  deleteOldLogs();
  setInterval(deleteOldLogs, 24 * 60 * 60 * 1000);

  const formatTime = () => {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const log = (level, message) => {
    const formattedMessage = `[${level}] ${message}`;
    const coloredMessage = getColorForLevel(level, formattedMessage);
    stream.write(`${formatTime()} ${formattedMessage}\n`);
    console.log(coloredMessage);
  };

  const getColorForLevel = (level, message) => {
    switch (level) {
      case 'INFO':
        return `\x1b[34m${message}\x1b[0m`; // голубой
      case 'WARN':
        return `\x1b[33m${message}\x1b[0m`; // желтый
      case 'ERROR':
        return `\x1b[31m${message}\x1b[0m`; // красный
      default:
        return message;
    }
  };

  return {
    log,
    info: (message) => log('INFO', message),
    warn: (message) => log('WARN', message),
    error: (message) => log('ERROR', message),
    close: () => {
      stream.end();
      rl.close();
      console.log('Логгер завершает работу...');
      process.exit();
    },
  };
}

const processCommand = async (command) => {
  try {
    await eval(command);
  } catch (error) {
    console.log('Произошла ошибка:', error.message);
  }
  rl.prompt();
};

rl.on('line', (command) => {
  processCommand(command);
});

console.log('Логгер готов к использованию. Введите команду:');

module.exports = createLogger;