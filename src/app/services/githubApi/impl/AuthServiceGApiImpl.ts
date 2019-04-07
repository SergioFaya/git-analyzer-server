import superagent from 'superagent';
import { config } from '../../../../config/impl/Config';
import AuthService from '../AuthServiceGApi';

const CHECK_LOGIN_URL = '/login/check';
const authService: AuthService = {
	auth: (token: string): Promise<any> => {
		return superagent
			.get(config.services.auth.baseUrl + CHECK_LOGIN_URL)
			.set('Accept', 'application/json')
			.set('x-access-token', token);
	},
};

export default authService as AuthService;