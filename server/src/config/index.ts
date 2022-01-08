import { ConfigOptions, Env } from '../types';

const config: ConfigOptions = {
  env: process.env.NODE_ENV as Env,
  test: {
    port: 3456,
  },
  app: {
    port: +process.env.SERVER_PORT,
  },
  server: {
    apiContextPath: '/api',
    hostname: '0.0.0.0',
    port: +process.env.SERVER_PORT,
    staticFolderPath: process.env.STATIC_PATH || '../../../clientApp/build',
    indexFile: '/index.html',
  },
  computedOrigins: null,
  get origins(): string[] {
    if (config.computedOrigins) return config.computedOrigins;

    const envOrigins: { ref: string[] } = { ref: [] };
    try {
      envOrigins.ref = JSON.parse(process.env.ORIGINS);
    } catch (e) {
      envOrigins.ref = [];
      throw new Error(`Was not able to parse ORIGINS: ${process.env.ORIGINS};`);
    }

    const http = 'http';
    const domains = ['localhost', '127.0.0.1'];
    const ports = [config.app.port, config.server.port, config.test.port];
    const origins: string[] = [];
    ports.forEach((port) => {
      domains.forEach((domain) => {
        origins.push(`${http}://${domain}:${port}`);
      });
    });
    origins.push(...envOrigins.ref);

    return origins;
  },
  loggerOptions: {
    fileOptions: {
      maxsize: 100000000,
      maxFiles: 8,
      filename: process.env.LOGFILE || 'logs/app.log',
    },
    timeStampFormat: 'YYYY-MM-DD HH:mm:ss:ms',
    excludeUrlsFromLogger: ['/health-check'],
  },
};

export default config;
