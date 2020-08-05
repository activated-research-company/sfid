import { env } from "../env";
import winston from "winston";

const logLevels = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

const logger = winston.createLogger({
  level: logLevels[Math.max(env.log.level, logLevels.length - 1)],
  format: winston.format.timestamp(),
  transports: [],
});

const formatter = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level} --> ${message}`;
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    formatter,
  ),
  handleExceptions: true,
});

logger.add(consoleTransport);

export default logger;