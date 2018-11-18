import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import * as request from 'superagent';
import { config } from '../../config/impl/Config';
import { UserSession } from '../db/Session';
import User from '../db/impl/User';
import { logger } from '../logger/Logger';
import { IUser } from '../db/User';

const router = Router();
const octokit = new Octokit({
	agent: undefined,
	headers: {
		'accept': 'application/vnd.github.v3+json',
		'user-agent': config.oauth.userAgent,
	},
	timeout: 0,
});

// https://github.com/settings/connections/applications/{{client_id}}
router.post('/config', (_req: Request, res: Response): void => {
	res.status(202).json({
		message: 'config',
		sucess: true,
	});
	// call to auth with the client id
});

// https://github.com/login/oauth/authorize?client_id={{client_id}}&scope={{scope}}
router.get('/login', (_req: Request, res: Response): void => {
	res.redirect('https://github.com/login/oauth/authorize?client_id='
		+ config.oauth.client_id + '&scope=' + config.oauth.scope);
});

router.get('/auth', (req: Request, res: Response) => {
	request
		.post('https://github.com/login/oauth/access_token')
		.send({
			client_id: config.oauth.client_id,
			client_secret: config.oauth.client_secret,
			code: req.query.code,
		})
		.set('Accept', 'application/json')
		.then((result) => {
			const accessToken = result.body.access_token;
			octokit.authenticate({
				token: accessToken,
				type: 'oauth',
			});
			saveUserData(req, res, accessToken);
		}).catch((err) => {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'error when getting the github access token',
				trace: err.toString(),
			});
			res.status(404).json({
				message: 'ERROR: cannot get the access token',
				success: false,
			});
		});
});

router.post('/logout', (req: Request, res: Response): void => {
	// Clean the user session
	logger.log({
		date: Date.now().toString(),
		level: 'info',
		message: 'Logout, user:' + req.session.data,
	});
	req.session.data = null;
	res.status(202).json({
		message: 'user session removed',
		sucess: true,
	});
});

async function saveUserData(req: Request, res: Response, accessToken: any) {
	request
		.get('https://api.github.com/user')
		.set('Authorization', 'token ' + accessToken)
		.then((result2): void => {
			const userSession: UserSession = {
				accessToken: String(accessToken),
				avatarUrl: result2.body.avatar_url,
				email: result2.body.login,
				githubUserId: result2.body.user_id,
				login: result2.body.login,
				name: result2.body.name,
				type: result2.body.type,
			};

			const userModel = new User().getModelForClass(User);
			const userData: IUser = {
				avatar_url: result2.body.avatar_url,
				email: result2.body.login,
				login: result2.body.login,
				type: result2.body.type,
			};
			const u = new userModel(userData);
			u.save();
			// TODO: handle response and errors
			req.session.user = userSession;
			logger.log({
				date: Date.now().toString(),
				level: 'info',
				message: 'Assigning the user data to the session',
			});
			res.status(202).json({
				message: 'Success in authorizing the user',
				success: true,
				userSession: { userSession },
			});
		}).catch((err) => {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'error when getting the user data',
				trace: err.toString(),
			});
			res.status(404).json({
				message: 'ERROR: cannot authenticate, try making another request',
				success: false,
			});
		});
}

export default router;