import { Request, Response, Router } from 'express';
import { IRepo } from 'git-analyzer-types';
import { errorLogger } from '../../../../logger/Logger';
import RepoServiceGApiImpl from '../../../services/githubApi/impl/RepoServiceGApiImpl';


const router = Router();

// hacer get repo paginado
router.get('/repos', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	const page = req.query.page;
	const per_page = req.query.per_page;
	console.log(req.query);
	if (token) {
		RepoServiceGApiImpl.getReposPaged(token, page, per_page)
			.then((repos: Array<IRepo>) => {
				res.status(202).json(repos);
			});
	} else {
		errorLogger('cannot get user token', req.body.err);
		res.status(404).json({
			message: 'Error: cannot get user repositories',
			success: false,
		});
	}
});

router.get('/repos/search', (req: Request, res: Response): void => {
	const token = req.header('x-github-token');
	const { page, per_page, search, username } = req.query;
	console.log(req.query);
	if (token && username && search) {
		RepoServiceGApiImpl.getReposPagedBySearch(token, page, per_page, search, username)
			.then((repos: Array<IRepo>) => {
				res.status(202).json(repos);
			});
	} else {
		errorLogger('cannot get user token', req.body.err);
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
				res.status(404).json({
					message: 'Cannot get access to the repository',
					success: false
				});
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