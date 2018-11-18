import { NextFunction, Request, Response, Router } from 'express';
import { logger } from '../logger/Logger';

const router = Router();
router.use((req: Request, _res: Response, next: NextFunction) => {
	if (req.session.data === null || req.session.data === undefined) {
		logger.log('info', 'Time: ' + String(Date.now()));
		next();
	} else {
		console.log('Not auth');
	}
});

export default router;