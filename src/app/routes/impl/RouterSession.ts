import { NextFunction, Request, Response } from 'express';
import { logger } from '../../../app/logger/Logger';
import { Routes } from '../Routes';

class RouterSession extends Routes {

	constructor() {
		super();
		this.setUp();
	}

	private setUp(): void {
		this.router.use((req: Request, _res: Response, next: NextFunction) => {
			if (req.session.data === null || req.session.data === undefined) {
				logger.log('info', 'Time: ' + String(Date.now()));
				next();
			} else {
				console.log('Not auth');
			}
		});
	}
}

export default new RouterSession().router;