import winston from 'winston';

export const errorLogger = (message: string, trace: Error | undefined = undefined) => {
	logger.log({
		date: Date.now(),
		level: 'error',
		message: message,
		trace: trace,
	});
};

export const infoLogger = (message: string) => {
	logger.log({
		date: Date.now(),
		level: 'info',
		message: message,
	});
};

export interface Log {
	date: string;
	level: LogLevel;
	message?: string;
	trace?: Error;
}

export enum LogLevel {
	error = 'error',
	info = 'info',
}

export const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.json(),
		winston.format.colorize(),
	),
	levels: winston.config.syslog.levels,
	// TODO: definir logpath en la config
	transports: [
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.simple(),
				winston.format.colorize(),
			),
			level: 'info',
		}),
		new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
	],
});