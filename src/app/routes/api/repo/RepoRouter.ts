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
			}).catch((err: Error) => {
				errorLogger("Repos paged error", err);
				res.status(500).json({
					message: "Repos paged error",
					success: false,
				});
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
	const { search, username } = req.query;
	if (token && username && search) {
		RepoServiceGApiImpl.getReposPagedBySearch(token, search, username)
			.then((repos: Array<IRepo>) => {
				res.status(202).json(repos);
			}).catch((err: Error) => {
				errorLogger("Cannot get repos search", err);
				res.status(505).json({
					message: "Cannot get repos search",
					success: false,
				});
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
			}).catch((err: Error) => {
				errorLogger("Cannot get single repo", err);
				res.status(505).json({
					message: "Cannot get single repo",
					success: false,
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