import { Request, Response } from 'express';
import { logger } from '../../../app/logger/Logger';
import { Routes } from '../Routes';

class RouterWebhooks extends Routes {
	constructor() {
		super();
		this.setUp();
	}

	private setUp(): void {
		this.router.post('/hooks', (req: Request, res: Response): void => {
			logger.log('info', 'WEBHOOKS: title of the issue ' + req.body.issue.title);
			res.status(200).json({
				message: req.body.issue,
				success: true,
			});
		});
	}
}

export default new RouterWebhooks().router;