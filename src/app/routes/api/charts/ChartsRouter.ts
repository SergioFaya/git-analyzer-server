import { Request, Response, Router } from 'express';
import { errorLogger } from '../../../../logger/Logger';
import ChartService from '../../../services/githubApi/impl/ChartServiceGApiImpl';

const router = Router();

// hacer get repo paginado
router.get('/charts/gitTree', (req: Request, res: Response): void => {
	const token = req.header('x-github-token') as string;
	// TODO: send in query the USERNAME TOO
	const reponame = req.header('reponame') as string;

	if (token && reponame) {
		ChartService.getNetworkChartData(token, reponame)
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