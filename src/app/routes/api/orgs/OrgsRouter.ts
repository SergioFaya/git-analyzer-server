import { Request, Response, Router } from 'express';
import { IOrg, IRepo } from 'git-analyzer-types';
import { errorLogger } from '../../../../logger/Logger';
import OrgsService from '../../../services/githubApi/impl/OrgsServiceGApiImpl';
const router = Router();

router.get('/user/organizations', (req: Request, res: Response): void => {
	const token = req.header('x-github-token') as string;
	OrgsService.getOwnedOrganizations(token)
		.then((result: Array<IOrg>) => {
			res.status(200).json(result);
		}).catch((err) => {
			errorLogger('Could not get orgs', err);
			res.status(500).json({
				message: 'Could not get orgs',
				success: false,
			});
		});
});

router.get('/user/organizations/repos', (req: Request, res: Response): void => {
	const token = req.header('x-github-token') as string;
	const orgname = req.header('orgname') as string;
	const page = req.query.page;
	const per_page = req.query.per_page;
	OrgsService.getReposOfOrgPaged(token, orgname, page, per_page)
		.then((result: Array<IRepo>) => {
			res.status(200).json(result);
		}).catch((err) => {
			errorLogger('Could not get org repos', err);
			res.status(500).json({
				message: 'Could not get org repos',
				success: false,
			});
		});
});

// https://api.github.com/orgs/Arquisoft/repos

export default router;