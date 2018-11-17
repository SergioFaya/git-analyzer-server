import { Request, Response, Router } from 'express';
import { config } from '../../../config/impl/Config';
import { Routes } from '../Routes';

class RouterHome extends Routes {

	constructor() {
		super();
		this.setUp();
	}

	private setUp(): void {
		this.router.get('/', (req: Request, res: Response) => {
			res.status(202).json({
				client_id: config.oauth.client_id,
				err: req.query.err,
				message: 'Homepage',
				scope: config.oauth.scope,
				user: req.session.user,
			});
		});
	}
}

export default new RouterHome().router;