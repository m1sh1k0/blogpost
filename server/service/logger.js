import { createLogger, format, transports } from 'winston'

const env = process.env.ENVIRONMENT

const timestampFormat = format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`
})

const logger = createLogger({
    level: process.env.LOG_LEVEL,
    format:
        env === 'production'
            ? format.combine(
                  format.splat(),
                  format.timestamp(),
                  timestampFormat
              )
            : format.combine(
                  format.colorize(),
                  format.splat(),
                  format.timestamp(),
                  timestampFormat
              ),
    transports: [
        new transports.Console({
            handleExceptions: true
        })
    ],
    exitOnError: false
})

logger.stream = {
    write: (message) => logger.info(message)
}

export default logger
