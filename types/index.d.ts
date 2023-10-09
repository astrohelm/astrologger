// all exports = module.exports items



interface TFileOptions {
  buffer?: number;
  interval?: number;
  format?:
}

interface TFile {
  constructor(options: TFileOptions);
}

interface TOptions {
  transports: [],
  methods: {},
  format: any,
  meta: any,
}

type TLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'

interface Logger {
  static transport(params: any): Transport;
  constructor(options: TOptions);
  child(meta: object): Logger;
  meta(): unknown;
}


