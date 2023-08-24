// all exports = module.exports items
type TMethods = 'LOG' | 'INFO' | 'WARN' | 'ERROR';
type TConfig = {
  path: string;
  writeInterval: number;
  writeBuffer: number;
  keepDays: number;
  json: boolean;
};
export const createLogger: (config: TConfig) => { [key: TMethods]: (message: string) => void };
