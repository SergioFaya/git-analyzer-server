import { Request, Response, Router } from 'express';
import { errorLogger } from '../../../../logger/Logger';
import OrgsService from '../../../services/githubApi/impl/OrgsServiceGApiImpl';
const router = Router();

router.get('/user/organizations', (req: Request, res: Response): void => {
	const token = req.header('x-github-token') as string;
	const username = req.query.username;
	OrgsService.getOwnedOrganizations(token, username)
		.then((_result) => {
			res.status(200).json();
		}).catch((_err) => {
			errorLogger('Could not get user info');
			res.status(500).json();
		});

});

export default router;