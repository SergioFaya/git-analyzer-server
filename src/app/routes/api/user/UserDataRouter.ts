import { Request, Response, Router } from 'express';
import { IUserData } from 'git-analyzer-types';
import { errorLogger } from '../../../../logger/Logger';
import { UserData } from '../../../schemas/UserDataSchema';
import UserDataService from '../../../services/githubApi/impl/UserDataServiceGApiImpl';
import SyncUserDataService from '../../../services/sync/impl/SyncUserService';

const router = Router();

router.get('/user/info', (req: Request, res: Response): void => {
	const token = req.headers['x-github-token'] as string;

	const p1 = UserDataService.getUserPrimaryEmailByToken(token);
	const p2 = UserDataService.getUserDataByToken(token);

	Promise.all([p1, p2])
		.then((result: [string, IUserData]) => {
			const email = result[0];
			const userData = result[1];
			userData.email = email;
			return userData;
		})
		.then((userData: IUserData) => {
			const user = userData as UserData;
			SyncUserDataService.sync(user);
			res.status(202).json(userData);
		})
		.catch((err: any) => {
			errorLogger('Could not get user info', err);
			res.status(500).json({
				message: "Cannot get user info"
			});
		});
});

export default router;
