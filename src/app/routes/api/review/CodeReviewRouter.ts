import { infoLogger } from './../../../../logger/Logger';
import { Request, Response, Router } from 'express';
import { ICodeReview } from 'git-analyzer-types';
import { CodeReview } from '../../../schemas/CodeReviewSchema';
import CodeReviewService from '../../../services/business/impl/CodeReviewServiceImpl';


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
	// FIXME: llega sin parsear el repo de la review o no se inserta
	infoLogger(review.repository!.toString());
	CodeReviewService.createNewCodeReview(review);
	res.status(202).json({
		message: 'Inserted',
		sucess: true
	});
});

router.post('/codeReview/delete', (req: Request, res: Response): void => {
	const id = Number(req.param('id'));
	CodeReviewService.deleteCodeReview(id);
	res.status(202).json({
		message: 'Deleted',
		sucess: true
	});
});


export default router;
