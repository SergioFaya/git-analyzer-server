import { NextFunction, Request, Response, Router } from 'express';
import request from 'superagent';
import { config } from '../../config/impl/Config';
import { logger } from '../logger/Logger';
import AuthenticationService from '../services/impl/auth';
const router = Router();

router.use((req: Request, res: Response, _next: NextFunction) => {
	const token = req.headers['x-access-token'] as string;
	if (token) {
		AuthenticationService.auth(token);
		/*
		request
			.get(config.services.auth.baseUrl + '/login/check')
			.set('Accept', 'application/json')
			.set('x-access-token', token.toString())
			.then((result: any) => {
				if (result.body.success && !result.body.expired) {
					next();
				} else {
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
				}
			}).catch((err: any) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'cannot connect with authentication server',
					token,
					trace: err.toString(),
				});
				res.status(401).json({
					message: 'Error in authentication server, try again later',
					success: false,
				});
			});
			*/
	} else {
		res.status(401).json({
			message: 'No token provided, please login',
			success: false,
		});
	}

});

export default router;