import winston from 'winston';

export const errorLogger = (message: string, trace: Error = null) => {
	logger.log({
		date: Date.now().toString(),
		level: 'error',
		message,
		trace,
	});
};

export const infoLogger = (message: string) => {
	logger.log({
		date: Date.now().toString(),
		level: 'info',
		message,
	});
};

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
			level: 'error',
		}),
		new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
	],
});