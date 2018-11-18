import { Request, Response, Router } from 'express';
import { config } from '../../config/impl/Config';

const router = Router();

router.get('/', (req: Request, res: Response) => {
	res.status(202).json({
		client_id: config.oauth.client_id,
		err: req.query.err,
		message: 'Homepage',
		scope: config.oauth.scope,
		user: req.session.user,
	});
});

export default router;