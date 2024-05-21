import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, errors, json, colorize } = format;

// Custom log format
const customFormat = printf(({ level, message, timestamp, stack, req, res }) => {
  // Handle morgan logs specifically
  if (message.includes('HTTP/')) {
    return `${timestamp} ${level}: ${message}`;
  }
  
  // Handle other logs
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create a logger instance
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    format.metadata(), // Enable passing metadata in the log function
    customFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), customFormat),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: json(),
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: json(),
    }),
  ],
});

export { logger };
