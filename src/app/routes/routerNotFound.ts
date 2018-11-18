import { Request, Response, Router } from 'express';
import { logger } from '../logger/Logger';

const router = Router();

router.use((req: Request, res: Response) => {
	logger.log({ level: 'info', message: '404: Going to ' + req.originalUrl });
	res.status(404).json({
		message: 'Resource not found',
		success: false,
	});
});

export default router;