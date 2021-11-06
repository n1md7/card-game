import { createLogger as initLogger, format, transports } from 'winston';
import config from '../config';
import { Format } from 'logform';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';
import { Level, TransportType, Env } from '../types';

class Logger {
  static instance: Logger;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  private static loggingTransport(type: TransportType): FileTransportInstance | ConsoleTransportInstance {
    const $format = Logger.createFormat();

    if (type === TransportType.File) {
      return new transports.File({
        ...config.loggerOptions.fileOptions,
        format: $format,
      });
    }

    return new transports.Console({
      format: $format,
    });
  }

  private static createFormat(): Format {
    return format.combine(
      format.timestamp({ format: config.loggerOptions.timeStampFormat }),
      format.printf((log) => {
        const { level, message, timestamp } = log;

        return `${level.toUpperCase()} [${timestamp}]: ${message?.toString()}`;
      }),
    );
  }

  createLogger() {
    return initLogger({
      level: config.env === Env.Prod ? Level.Info : Level.Debug,
      silent: config.env === Env.Test, // do not show any log on tests
      handleExceptions: true,
      transports:
        config.env === Env.Prod
          ? Logger.loggingTransport(TransportType.File)
          : Logger.loggingTransport(TransportType.Console),
    });
  }
}

export default Logger.getInstance().createLogger();
