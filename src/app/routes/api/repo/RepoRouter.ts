import { Request, Response, Router } from 'express';
import { errorLogger, logger } from '../../../../logger/Logger';
import Repo from '../../../models/Repo';
import RepoServiceGApiImpl from '../../../services/githubApi/impl/RepoServiceGApiImpl';

const router = Router();

// hacer get repo paginado
router.get('/repos', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	if (token) {
		RepoServiceGApiImpl.getAllRepos(token)
			.then((repos: Array<Repo>) => {
				res.status(202).json({ repos });
			});
	} else {
		logger.log({
			date: Date.now().toString(),
			level: 'error',
			message: 'cannot get user token',
			trace: req.body.err,
		});
		res.status(404).json({
			message: 'Error: cannot get user repositories',
			success: false,
		});
	}
});

router.get('/repos/reponame', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	const reponame = req.header('reponame');
	if (token && reponame) {
		RepoServiceGApiImpl.getRepoByName(token, reponame)
			.then((repo) => {
				res.status(202).json(repo);
			}).catch((err) => {
				errorLogger('Cannot get access to the repository', err);
				res.status(404).json({ message: 'Cannot get access to the repository' });
			});
	} else {
		errorLogger('Cannot get user repo');
		res.status(404).json({
			message: 'Cannot get user repo',
			success: false,
		});
	}
});

export default router;