import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import { config } from '../../../config/impl/Config';
import { UserSession } from '../../db/Session';
import { logger } from '../../logger/Logger';

const router = Router();
const octokit = new Octokit({
	agent: undefined,
	headers: {
		'accept': 'application/vnd.github.v3+json',
		'user-agent': config.oauth.userAgent,
	},
	timeout: 0,
});

router.get('/repos', (req: Request, res: Response): void => {
	const userSession: UserSession = req.session.user;
	if (userSession) {
		octokit.apps.listRepos({})
			.then((result: any) => {
				console.log(result);
			})
			.catch((err: any) => {
				console.log(err);
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get user repo',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get logger',
			success: false,
		});
	}
});

export default router;