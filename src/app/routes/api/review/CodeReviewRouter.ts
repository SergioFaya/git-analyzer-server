import { Request, Response, Router } from 'express';
import CodeReviewService from '../../../services/business/impl/CodeReviewServiceImpl';


const router = Router();


router.get('/codeReview/list', (_req: Request, res: Response): void => {
	// const reponame = req.header('reponame') as string;
	const codeReviews = CodeReviewService.getAllCodeReviews();
	res.status(202).json(codeReviews);
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
