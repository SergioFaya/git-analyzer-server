import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import * as superagent from 'superagent';
import { config } from '../../../config/impl/Config';
import { UserSession } from '../../db/types/Session';
import { logger } from '../../logger/Logger';

const payload = {
	exp: Date.now() + (10 * 60),
	iat: Date.now(),
	// identica al creador del token
	iss: 'Iv1.618440b9cb61855a',
};

const router = Router();
router.get('/repos', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	if (token) {
		superagent
			.get('http://api.github.com/user/repos')
			.set('Authorization', `token ${token}`)
			.then((result) => {
				res.status(202).json({
					message: 'Error: cannot get logger',
					repos: result.body,
					success: true,
				});
			}).catch((err) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant get access to the repository',
					trace: err.message,
				});
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get user token',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get user repositories',
			success: false,
		});
	}
});

router.get('/repos/reponame', (req: Request, res: Response): void => {
	// const token = req.header('x-github-token');
	const token = 'b326925e6c9d8a3c3b20d418fd6bdb434d7b1b66';
	const username = req.header('username');
	const reponame = req.header('reponame');
	if (token && username && reponame) {
		superagent
			.get(`http://api.github.com/repos/${username}/${reponame}`)
			.set('Authorization', `token ${token}`)
			.then((result) => {
				res.status(202).json({
					message: 'User repositories',
					repo: result.body,
					success: true,
				});
			}).catch((err) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Cant get access to the repository',
					trace: err.message,
				});
				res.status(202).json({
					message: 'Error: cannot get repos of user',
					repo: null,
					success: false,
				});
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get username, token or reponame',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get user repo',
			success: false,
		});
	}
});

export default router;