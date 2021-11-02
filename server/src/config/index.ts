export default {
  server: {
    apiContextPath: '/api',
    // It has to be 0.0.0.0 when serving from Docker container
    hostname: '0.0.0.0',
    // hostname: 'localhost',
    port: 8000,
    staticFolderPath: '../../../game/build',
    indexFile: '/index.html',
  },
  origins: [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8000',
    'http://localhost:3456',
    'http://192.168.1.154',
    'http://192.168.1.154:3000',
    'http://192.168.1.154:8000',
    'http://192.168.1.154:3456',
  ],
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
