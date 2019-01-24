import { NextFunction, Request, Response, Router } from 'express';
import redis from 'redis';
import { config } from '../../config/impl/Config';
import { logger } from '../logger/Logger';

import jwt from 'jsonwebtoken';

import { UserSession } from '../db/Session';

const redisClient = redis.createClient(config.redis.port);
const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
	// tslint:disable-next-line:no-console
	console.log('EN SESSION');
	const token = req.headers['x-access-token'].toString();
	jwt.verify(token, config.app.tokenSecret, (err, _decoded) => {
		if (err == null || err === undefined) {
			redisClient.get(token, (errRedis, reply) => {
				if (errRedis) {
					// the redis bd is down
					res.status(500).json({
						message: 'Error: redis db not working',
						success: false,
					});
				} else {
					if (reply == null) {
						logger.log({
							date: Date.now().toString(),
							level: 'error',
							message: 'trying to access with a wrong token',
							token,
						});
						res.status(401).json({
							message: 'Error: session token not valid, please login again',
							success: false,
						});
					} else {
						req.session.userSession = JSON.parse(reply) as UserSession;
						next();
					}
				}
			});
		} else {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'trying to access with a wrong token',
				token,
				trace: err,
			});
			res.status(401).json({
				message: 'Error: session token not valid, please login again',
				success: false,
			});
		}
	});
});

export default router;