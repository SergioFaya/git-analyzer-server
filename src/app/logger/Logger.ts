import winston from 'winston';

export const logger = winston.createLogger({
	format: winston.format.combine(
		winston.format.json(),
		winston.format.colorize(),
	),
	levels: winston.config.syslog.levels,
	transports: [
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.Console({ level: 'error'}),
		new winston.transports.File({ filename: 'logs.log', level: 'info' }),
	],
});