import { Request, Response, Router } from 'express';
import { ICodeReview } from 'git-analyzer-types';
import CodeReviewService from '../../../services/business/impl/CodeReviewServiceImpl';


const router = Router();


router.get('/codeReview/list', (req: Request, res: Response): void => {
	//const reponame = req.header('reponame') as string;
	const username = req.header('username') as string;
	CodeReviewService.getAllCodeReviewsForUser(username)
		.then((reviews: Array<ICodeReview>) => {
			res.status(202).json(reviews);
		}).catch(() => {
			res.status(500).json({
				message: 'Cannot get list of code reviews',
				sucess: false
			});
		})

});
/*
router.post('/codeReview/create', (req: Request, res: Response): void => {
	res.status(202).json(userData);
});

router.post('/codeReview/delete', (req: Request, res: Response): void => {
	res.status(202).json(userData);
});

*/

export default router;
