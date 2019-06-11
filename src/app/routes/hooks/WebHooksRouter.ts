import { Request, Response, Router } from 'express';
import { IssueWHEvent } from '../../schemas/IssueWHEventSchema';
import WebHooksService from '../../services/business/impl/WebHookServiceImpl';

const router = Router();

router.post('/hooks', (req: Request, _res: Response) => {
	var event = req.header('X-GitHub-Event');
	if (event === 'issues') {
		var issue = req.body.issue;
		var repo = req.body.repository;
		WebHooksService.saveIssuesEvent(new IssueWHEvent(issue, Date.now(), repo));
	}
});

export default router;