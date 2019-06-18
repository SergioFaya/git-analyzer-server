import { Request, Response, Router } from 'express';
import { IPullReqWebHook } from 'git-analyzer-types';
import WebHooksService from '../../../services/business/impl/WebHookServiceImpl';


const router = Router();

router.get('/pullReq/latest', (req: Request, res: Response): void => {
	const username = req.header('username') as string;
	const limitStr = req.header('limit') as string;
	var limit;
	if (limitStr) {
		limit = Number.parseInt(limitStr);
	}
	WebHooksService
		.findLatestsPullReqs(username, limit)
		.then((pullReqs: Array<IPullReqWebHook>) => {
			res.status(202).json(pullReqs);
		}).catch((err: Error) => {
			res.status(500).json({
				success: false,
				message: 'Cannot get recent pull requests',
				trace: err
			})
		});
});


export default router;