import { Request, Response, Router } from 'express';
import { ICommitWebhook, IissueWebHook, IPullReqWebHook } from 'git-analyzer-types';
import WebHooksService from '../../services/business/impl/WebHookServiceImpl';

const router = Router();

router.post('/hooks', (req: Request, _res: Response) => {
	var event = req.header('X-GitHub-Event');
	if (event === 'issues') {
		manageIssuesEvent(req.body);
	} else if (event === 'pull_request') {
		managePullReqEvent(req.body);
	} else if (event === 'push') {
		managePushEvent(req.body);
	}
});

function managePullReqEvent(body: any) {
	const { action, repository, pull_request } = body;
	const pullReqWh: IPullReqWebHook = {
		action,
		repository,
		pull_request,
		timestamp: Date.now()
	};
	WebHooksService.savePullReqEvent(pullReqWh);
}

function manageIssuesEvent(body: any) {
	const { issue, repository, action } = body;
	const issueWh: IissueWebHook = {
		issue,
		repository,
		action,
		timestamp: Date.now()
	};
	WebHooksService.saveIssueEvent(issueWh);
}

function managePushEvent(body: any) {
	const { ref, head_commit, repository, pusher } = body;
	const push: ICommitWebhook = {
		ref,
		head_commit,
		repository,
		pusher,
		timestamp: Date.now()
	};
	WebHooksService.savePushEvent(push);
}

export default router;