import { Request, Response, Router } from 'express';
import { ICodeReview } from 'git-analyzer-types';
import { CodeReview } from '../../../schemas/CodeReviewSchema';
import CodeReviewService from '../../../services/business/impl/CodeReviewServiceImpl';
import { infoLogger } from './../../../../logger/Logger';


const router = Router();


router.get('/codeReview/list', (req: Request, res: Response): void => {
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

router.post('/codeReview/create', (req: Request, res: Response): void => {
	const reviewStr = req.param('review');
	const review = JSON.parse(reviewStr) as CodeReview;
	infoLogger(review.repository!.toString());
	CodeReviewService.createNewCodeReview(review)
		.then(() => {
			res.status(202).json({
				message: 'Inserted',
				sucess: true
			});
		}).catch(() => {
			res.status(500).json({
				message: 'Cannot delete code review',
				sucess: false
			});
		});
});

router.post('/codeReview/delete', (req: Request, res: Response): void => {
	const id = Number(req.param('reviewId'));
	CodeReviewService.deleteCodeReview(id)
		.then(() => {
			res.status(202).json({
				message: 'Deleted',
				sucess: true
			});
		}).catch(() => {
			res.status(500).json({
				message: 'Cannot delete code review',
				sucess: false
			});
		});
});

router.get('/codeReview/list/search', (req: Request, res: Response): void => {
	const username = req.header('username') as string;
	const search = req.header('search') as string;
	CodeReviewService.getCodeReviewsForUserBySearch(username, search)
		.then((reviews: Array<ICodeReview>) => {
			res.status(202).json(reviews);
		}).catch(() => {
			res.status(500).json({
				message: 'Cannot get list of code reviews',
				sucess: false
			});
		})
});

export default router;