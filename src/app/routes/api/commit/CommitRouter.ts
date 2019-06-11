import { Request, Router } from 'express';
import { Response } from 'express-serve-static-core';
import { errorLogger, infoLogger } from '../../../../logger/Logger';
import RepoServiceGApi from '../../../services/githubApi/impl/RepoServiceGApiImpl';


const router = Router();

router.get('/commits', (req: Request, res: Response) => {
	const sha = req.header('sha') as string;
	const token = req.header('x-github-token') as string;
	const reponame = req.header('reponame') as string;
	// https://api.github.com/repos/SergioFaya/git-analyzer-client/commits/d67b52499ae5ef1f44528e31d69bd44c9dd07817
	RepoServiceGApi
		.getCommitOfRepo(token, reponame, sha)
		.then((result: any) => {
			infoLogger(result);
			res.status(202).json({ result });
		}).catch((err: Error) => {
			errorLogger('Cannot get repo commit', err);
			res.status(500).json({
				message: 'Cannot get repo commit',
				success: false
			});
		});
});


export default router;