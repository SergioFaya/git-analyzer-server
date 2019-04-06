import { NextFunction, Request, Response, Router } from 'express';
import request from 'superagent';
import { config } from '../../config/impl/Config';
import { errorLogger, infoLogger, logger } from '../../logger/Logger';
import AuthService from '../services/impl/AuthService';
const router = Router();

const ERROR_IN_SERVER = {
	message: 'Error in authentication server, try again later',
	success: false,
};

const ERROR_TOKEN_NOT_VALID = {
	message: 'Session token not valid, please login again',
	success: false,
};

const ERROR_NO_TOKEN = {
	message: 'No token provided, please login',
	success: false,
};

router.use((req: Request, res: Response, next: NextFunction) => {
	const token = req.headers['x-access-token'] as string;
	if (token) {
		AuthService.auth(token)
			.then((result: any) => {
				const { success, expired } = result.body;
				if (success && !expired) {
					next();
				} else {
					errorLogger(`trying to access with a wrong token -> ${token}`);
					res.status(401).json(ERROR_TOKEN_NOT_VALID);
				}
			}).catch((err: Error) => {
				errorLogger('cannot connect with authentication server', err);
				res.status(401).json(ERROR_IN_SERVER);
			});
	} else {
		res.status(401).json(ERROR_NO_TOKEN);
	}
});

export default router;