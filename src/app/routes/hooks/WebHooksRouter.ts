import { Request, Response, Router } from 'express';
import { logger } from '../../../logger/Logger';

const router = Router();

router.post('/hooks', (req: Request, res: Response): void => {
	logger.log('info', 'WEBHOOKS: title of the issue ' + req.body.issue.title);
	res.status(200).json({
		message: req.body.issue,
		success: true,
	});
});

export default router;