import { Request, Response, Router } from 'express';
import { errorLogger } from '../../../../logger/Logger';

const router = Router();

// hacer get repo paginado
router.get('/charts/gitTree', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	const reponame = req.header('reponame');
	if (token && reponame) {
		//ChartService.getCommitTree(token, reponame);
	} else {
		errorLogger('cannot get username, token or reponame');
		res.status(404).json({
			message: 'Error: cannot get contributions',
			success: false,
		});
	}
});

export default router;