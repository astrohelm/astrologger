const Logger = require('leadlogger');

const opts = {
  path: './log', // absolute or relative path
  workerId: 7, // mark for process or thread
  writeInterval: 3000, // flush log to disk interval
  writeBuffer: 64 * 1024, // buffer size (default 64kb)
  keepDays: 5, // delete after N days, 0 - disable
  home: process.cwd(), // remove substring from paths
  json: false, // print logs in JSON format, by default false,
  // Другие настройки которые я тебе давал
}(async () => {
  const logger = await Logger.open(opts);

  // alternative creation
  const logger = await new Logger(opts);

  const { console } = logger;
  console.log('Test message');
  console.error('Error message');
  // Имплементация всех методов console
  // Для начала - log, error, clear, dir, table, warn, info, debug, assert

  await logger.close();
})();
