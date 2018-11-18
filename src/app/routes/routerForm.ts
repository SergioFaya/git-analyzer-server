import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import { config } from '../../config/impl/Config';
import { logger } from '../logger/Logger';

const router = Router();
const octokit = new Octokit({
	agent: undefined,
	headers: {
		'accept': 'application/vnd.github.v3+json',
		'user-agent': config.oauth.userAgent,
	},
	timeout: 0,
});

router.get('/form', (req: Request, res: Response): void => {
	octokit.repos
		.getCommits({
			owner: req.body.owner,
			repo: req.body.repo,
		})
		.then((result) => {
			if (!result) {
				res.status(404).json({
					message: 'No access token provided',
					success: false,
				});
			} else {
				res.status(202).json({
					client_id: config.oauth.client_id,
					commits: result.data,
					err: req.query.err,
					scope: config.oauth.scope,
					user: req.session.user,
				});
			}
		}).catch((err) => {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'Content not found for request with username:' + req.body.owner + ' and repo:' + req.body.repo,
				trace: err.toString(),
			});
			res.status(404).json({
				message: 'No access username or repo provided',
				success: false,
				trace: err.toString(),
			});
		});
});

export default router;