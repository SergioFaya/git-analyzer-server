import Octokit from '@octokit/rest';
import { Request, Response, Router } from 'express';
import { config } from '../../config/impl/Config';
import { logger } from '../logger/Logger';

const router = Router();
const octokit = new Octokit({
	timeout: 0,
	userAgent: config.oauth.userAgent,
});

router.post('/form', (req: Request, res: Response): void => {
	octokit.repos
		.listCommits({
			owner: req.body.owner,
			repo: req.body.repo,
		})
		.then((result: any) => {
			if (!result) {
				res.status(404).json({
					message: 'Error when using getting the repo data',
					result: { result },
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
		}).catch((err: any) => {
			logger.log({
				date: Date.now().toString(),
				level: 'error',
				message: 'Content not found for request with username:' + req.body.owner + ' and repo:' + req.body.repo,
				trace: err.toString(),
			});
			res.status(404).json({
				message: 'No owner or repo provided',
				success: false,
				trace: err.toString(),
			});
		});
});

export default router;