import { Request, Response, Router } from 'express';
import { errorLogger } from '../../../../logger/Logger';
import NetworkChartService from '../../../services/business/impl/NetworkChartServiceImpl';

const router = Router();

// hacer get repo paginado
router.get('/charts/gitTree', (req: Request, res: Response): void => {
	const token = req.header('x-github-token') as string;
	const reponame = req.header('reponame') as string;
	const username = req.header('username') as string;
	if (token && reponame) {
		NetworkChartService.getNetworkChartData(token, username, reponame)
			.then((result) => {
				res.json(result)
			});
	} else {
		errorLogger('cannot get username, token or reponame');
		res.status(404).json({
			message: 'Error: cannot get contributions',
			success: false,
		});
	}
});

export default router;