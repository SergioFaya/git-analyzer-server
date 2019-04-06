import request from 'superagent';
import * as superagent from 'superagent';
import { config } from '../../../config/impl/Config';
import {logger} from '../../../logger/Logger';
import AuthService from '../AuthService';

const CHECK_LOGIN_URL = '/login/check';
const authService: AuthService = {
	auth: (token: string): Promise<any> => {
		return request
			.get(config.services.auth.baseUrl + CHECK_LOGIN_URL)
			.set('Accept', 'application/json')
			.set('x-access-token', token);
	},
};

export default authService as AuthService;