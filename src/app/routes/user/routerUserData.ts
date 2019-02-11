import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import superagent from 'superagent';
import { config } from '../../../config/impl/Config';
import { userModel } from '../../db/User';
import { IUser } from '../../db/types/User';
import { logger } from '../../logger/Logger';
const router = Router();

// TODO: Extract code and promisify

router.get('/user/info', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	superagent
		.get('https://api.github.com/user')
		.set('Authorization', `token ${token}`)
		.set('Accept', 'application/json')
		.then((result: any) => {
			superagent
				.get('https://api.github.com/user/emails')
				.set('Authorization', `token ${token}`)
				.set('Accept', 'application/json')
				.then((resultEmail: any) => {
					const body = result.body;
					const email = resultEmail.body.find((x: any) => {
						return x.primary;
					}).email;
					createUser(body, email, (err: Error, user: any) => {
						if (err) {
							res.status(500).json({
								message: 'Error storing user info',
								success: false,
							});
						} else {
							res.status(202).json({
								message: 'User information sucessfully obtained',
								success: true,
								user,
							});
						}
					});
				}).catch((err2: any) => {
					res.status(500).json({
						err2,
						message: 'Error when using getting the repo data',
						success: false,
					});
				});
		}).catch((err: any) => {
			res.status(500).json({
				err,
				message: 'Error when using getting the repo data',
				success: false,
			});
		});
});

function createUser(body: any, email: string, callback: any) {
	const user = new userModel({
		avatarUrl: body.avatar_url,
		email,
		login: body.login,
		type: body.type,
		userId: body.id,
	});
	user.save((err, _product) => {
		if (err) {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: '',
				trace: err.message,
			});
			callback(err);
		} else {
			callback(null, user);
		}
	});
}
export default router;