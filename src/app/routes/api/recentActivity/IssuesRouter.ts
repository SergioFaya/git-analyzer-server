import { errorLogger } from './../../../../logger/Logger';
import { Request, Response, Router } from 'express';
import { Issue } from '../../../schemas/IssueSchema';
import WebHooksService from '../../../services/business/impl/WebHookServiceImpl';


const router = Router();

router.get('/issues/latest', (req: Request, res: Response): void => {
	const username = req.header('username') as string;
	const limitStr = req.header('limit') as string;
	var limit;
	if(limitStr){
		limit = Number.parseInt(limitStr);
	}
	WebHooksService
		.findLatestsIssues(username, limit)
		.then((issues: Array<Issue>) => {
			res.status(202).json(issues);
		}).catch((err: Error) => {
			errorLogger('Cannot find latest issues',err);
			res.status(500).json({
				success: false,
				message: 'Cannot find recent issues'
			});
		});
});


export default router;