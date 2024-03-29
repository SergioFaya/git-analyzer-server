import { Request, Response, Router } from 'express';
import { IissueWebHook } from 'git-analyzer-types';
import WebHooksService from '../../../services/business/impl/WebHookServiceImpl';
import { errorLogger } from './../../../../logger/Logger';


const router = Router();

router.get('/issues/latest', (req: Request, res: Response): void => {
	const username = req.header('username') as string;
	const limitStr = req.header('limit') as string;
	var limit;
	if (limitStr) {
		limit = Number.parseInt(limitStr);
	}
	WebHooksService
		.findLatestsIssues(username, limit)
		.then((issues: Array<IissueWebHook>) => {
			res.status(202).json(issues);
		}).catch((err: Error) => {
			errorLogger('Cannot find latest issues', err);
			res.status(500).json({
				success: false,
				message: 'Cannot find recent issues'
			});
		});
});


export default router;