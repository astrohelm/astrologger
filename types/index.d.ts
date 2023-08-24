// all exports = module.exports items
export class Logger {
  log: (msg: string) => void;
}
export const createLogger: () => Logger;
