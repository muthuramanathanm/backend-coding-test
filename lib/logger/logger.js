const winston = require('winston');
const path = require('path');

//define custom log format
const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  );

  //add file and console loggers to the winston instance
const logger = winston.createLogger({
    format: logFormat,
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, 'error.log'),
            level: 'info',
            maxsize: 500
        })
    ]
});

module.exports = logger;