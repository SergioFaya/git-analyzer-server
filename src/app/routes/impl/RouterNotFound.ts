import { Request } from 'express';
import { Response } from 'express-serve-static-core';
import { logger } from '../../logger/Logger';
import { Routes } from '../Routes';

class RouterNotFound extends Routes {

	constructor() {
		super();
		this.setUp();
	}

	private setUp(): void {

		this.router.use((req, res) => {
			logger.log({ level: 'info', message: '404: Going to ' + req.originalUrl });
			res.status(404).redirect('/notFound');
		});

		this.router.get('/notFound', (_req: Request, res: Response) => {
			res.status(404).json({
				message: 'error, resource not found',
				success: false,
			});
		});
	}
}
export default new RouterNotFound().router;