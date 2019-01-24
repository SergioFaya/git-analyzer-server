import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import { config } from '../../../config/impl/Config';
import { UserSession } from '../../db/Session';
import { logger } from '../../logger/Logger';

const router = Router();
const octokit = new Octokit({
	agent: undefined,
	headers: {
		// 'accept': 'application/vnd.github.v3+json',
		// custom media type for accesing API during preview
		'accept': 'application/vnd.github.machine-man+json',
		'user-agent': config.oauth.userAgent,
	},
	timeout: 0,
});

router.get('/repos', (req: Request, res: Response): void => {
	const userSession: UserSession = req.session.userSession;
	if (userSession) {
		octokit.apps.listRepos({})
			.then((result: any) => {
				res.status(202).json({
					message: 'repo list obtained',
					result,
					success: true,
					userSession,
				});
			})
			.catch((err: any) => {
				logger.log({
					date: Date.now().toString(),
					level: 'error',
					message: 'Error: error when calling api',
					trace: err,
				});
				res.status(500).json({
					message: 'Error with github api',
					trace: err,
				});
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get user session',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get logger',
			success: false,
			userSession,
		});
	}
});

export default router;