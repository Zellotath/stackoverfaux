import winston from 'winston';

export function getLogger() {
  let logger: winston.Logger | undefined;
  if (!logger) {
    logger = winston.createLogger({
      level: process.env.LOG_LEVEL,
      format: winston.format.combine(
        winston.format.colorize({
          all: true
        }),
        winston.format.label({ label: 'stack-overfaux' }),
        winston.format.timestamp({
          format: 'MM/DD/YYYY HH:mm:ss'
        }),
        winston.format.printf((info) => `${info.timestamp} - ${info.label} [${info.level}]: ${info.message}`)
      ),
      transports: [new winston.transports.Console()]
    });
  }
  return logger;
}
