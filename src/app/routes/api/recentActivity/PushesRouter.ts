import { Request, Response, Router } from 'express';
import { ICommitWebhook } from 'git-analyzer-types';
import WebHooksService from '../../../services/business/impl/WebHookServiceImpl';


const router = Router();

router.get('/pushes/latest', (req: Request, res: Response): void => {
	const username = req.header('username') as string;
	const limitStr = req.header('limit') as string;
	var limit;
	if (limitStr) {
		limit = Number.parseInt(limitStr);
	}
	WebHooksService
		.findLatestsPushEvents(username, limit)
		.then((pushes: Array<ICommitWebhook>) => {
			res.status(202).json(pushes);
		}).catch((err: Error) => {
			res.status(500).json({
				success: false,
				message: 'Cannot get recent pushes',
				trace: err
			})
		});
});


export default router;