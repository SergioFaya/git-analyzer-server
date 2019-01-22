import { NextFunction, Request, Response, Router } from 'express';
import redis from 'redis';
import { config } from '../../config/impl/Config';
import { logger } from '../logger/Logger';

import { UserSession } from '../db/Session';

const redisClient = redis.createClient(config.redis.port);
const router = Router();

//TODO: Incluir el jwt.verify para el token
router.use((req: Request, res: Response, next: NextFunction) => {
	const token = req.headers['x-access-token'].toString();
	redisClient.get(token, (err, reply) => {
		if (err) {
			// the redis bd is down
			res.status(500).json({
				message: 'Error: redis db not working',
				success: false,
			});
		} else {
			if (reply == null) {
				// 401 unauthorized
				res.status(401).json({
					message: 'Error: session token not valid, please login again',
					success: false,
				});
			} else {
				req.session.userSession = JSON.parse(reply) as UserSession;
			}
		}
	});

});

export default router;