import * as superagent from 'superagent';
import { errorLogger } from '../../../../logger/Logger';
import UserData from '../../../models/UserData';
import UserDataService from '../UserDataServiceGApi';

const userDataService: UserDataService = {
	getUserDataByToken: (token: string): Promise<UserData> => {
		return getUserDataByTokenPromise(token)
			.catch((err) => {
				errorLogger(`Cannot get data from user with token ${token}`, err);
				return null;
			})
			.then((result: any) => createUser(result.body));
	},
	getUserPrimaryEmailByToken: (token: string): Promise<string> => {
		return getUserEmailsByTokenPromise(token)
			.catch((err) => {
				errorLogger(`Cannot get emails from user with token ${token}`, err);
				return null;
			})
			.then((result: any) => {
				const email = result.body.find((x: any) => {
					return x.primary;
				}).email;
				return email as string;
			});
	},

};

export default userDataService;

const getUserDataByTokenPromise = (token: string): Promise<any> => {
	return superagent
		.get('https://api.github.com/user')
		.set('Authorization', `token ${token}`)
		.set('Accept', 'application/json');
};

const getUserEmailsByTokenPromise = (token: string): Promise<any> => {
	return superagent
		.get('https://api.github.com/user/emails')
		.set('Authorization', `token ${token}`)
		.set('Accept', 'application/json');
};

const createUser = (body: any): UserData => {
	const { id, login, name, type, avatar_url } = body;
	const user: UserData = {
		email: undefined,
		id,
		imageUrl: avatar_url,
		login,
		name,
		type,
		username: login,
	};
	return user;
};