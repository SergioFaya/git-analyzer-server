import request from 'superagent';
import * as superagent from 'superagent';
import { config } from '../../../config/impl/Config';
import {logger} from '../../logger/Logger';
import AuthService from '../AuthService';

const CHECK_LOGIN_URL = '/login/check';
const authService: AuthService = {
	auth: (token: string): Promise<any> => {
		return request
			.get(config.services.auth.baseUrl + CHECK_LOGIN_URL)
			.set('Accept', 'application/json')
			.set('x-access-token', token)
			.then((result: any) => {
				if (result.body.success && !result.body.expired) {
					return true;
				} else {
					logger.log({
						date: Date.now().toString(),
						level: 'error',
						message: 'trying to access with a wrong token',
						token,
					});
					return false;
				}
			}).catch((err: any) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'cannot connect with authentication server',
					token,
					trace: err.toString(),
				});
				return false;
			});
	},
};

export default authService as AuthService;