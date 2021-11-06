import { Env } from './index';

export type ConfigOptions = {
  env: Env;
  test: {
    port: number;
  };
  app: {
    port: number;
  };
  server: ServerConfig;
  computedOrigins: null | string[];
  origins: string[];
  loggerOptions: LoggerOptions;
};

export type ServerConfig = {
  apiContextPath: string;
  hostname: string;
  port: number;
  staticFolderPath: string;
  indexFile: string;
};

export type LoggerOptions = {
  fileOptions: File;
  timeStampFormat: string;
  excludeUrlsFromLogger: string[];
};

export type File = {
  maxsize: number;
  maxFiles: number;
  filename: string;
};
