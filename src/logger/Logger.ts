import winston from 'winston';

/**
 * Logs the message and trace in the error logs file
 * @param message 
 * @param trace 
 */
export const errorLogger = (message: string, trace: Error | undefined = undefined) => {
	logger.log({
		date: Date.now(),
		level: 'error',
		message: message,
		trace: trace,
	});
};

/**
 * Logs the message in the info logs file
 * @param message 
 */
export const infoLogger = (message: string) => {
	logger.log({
		date: Date.now(),
		level: 'info',
		message: message,
	});
};

/**
 * Models a log into a file
 */
export interface Log {
	date: string;
	level: LogLevel;
	message?: string;
	trace?: Error;
}

/**
 * Defines the log levels 
 */
export enum LogLevel {
	error = 'error',
	info = 'info',
}

/**
 * Winston logger instance
 */
export const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.json(),
		winston.format.colorize(),
	),
	levels: winston.config.syslog.levels,
	transports: [
		new winston.transports.File({ filename: '../logs/server/error.log', level: 'error' }),
		new winston.transports.File({ filename: '../logs/server/info.log', level: 'info' }),
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.simple(),
				winston.format.colorize(),
			),
			level: 'info',
		}),
	],
});