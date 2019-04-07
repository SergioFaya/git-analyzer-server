import { Request, Response, Router } from 'express';
import { errorLogger } from '../../../../logger/Logger';
import ChartService from '../../../services/githubApi/impl/ChartServiceGApiImpl';

const router = Router();

router.get('/contributors', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	const reponame = req.header('reponame');
	if (token && reponame) {
		ChartService.getStatsOfUser(token, reponame)
			.then((contributionsVM) => {
				res.status(202).json({ contributionsVM });
			}).catch((err: Error) => {
				errorLogger('Cannot get stats from contributors', err);
				res.status(404).json({ message: 'Cannot get stats from contributors', success: false });
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