export enum token {
  self = 'token',
  userId = 'userId',
  name = 'name',
}

export enum room {
  two = 2,
  three,
  four,
}

export default {
  server: {
    apiContextPath: '/api',
    hostname: '0.0.0.0',
    port: 8000,
    staticFolderPath: '../../../game/build',
    indexFile: '/index.html',
  },
  origin: 'http://localhost:3000',
  loggerOptions: {
    fileOptions: {
      maxsize: 100000000,
      maxFiles: 7,
      filename: process.env.LOGFILE || 'logs/app.log',
    },
    timeStampFormat: 'YYYY-MM-DD HH:mm:ss:ms',
    excludeUrlsFromLogger: ['/health-check'],
  },
};
