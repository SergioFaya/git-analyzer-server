import { ICommitWebhook, IissueWebHook, IPullReqWebHook } from 'git-analyzer-types';
import { errorLogger } from '../../../../logger/Logger';
import { IssueWHEvent, IssueWHEventModel } from '../../../schemas/IssueWHEventSchema';
import { PullReqWHEventModel } from '../../../schemas/PullReqWHEventSchema';
import { PushWHEventModel } from '../../../schemas/PushWHEventSchema';
import { WebHooksService } from '../WebHooksService';

const DEFAULT_LIMIT = 5;

const WebHooksService: WebHooksService = {

	saveIssueEvent: (issueWHEvent: IssueWHEvent) => {
		var model = new IssueWHEventModel(issueWHEvent);
		model.save();
	},

	findLatestsIssues: (username: string, limit?: number) => {
		return IssueWHEventModel
			.find({ 'repository.owner.login': username })
			.sort({ timestamp: 'desc' })
			.limit(limit || DEFAULT_LIMIT)
			.then((result: Array<IissueWebHook>) => {
				return result;
			})
			.catch((err: Error) => {
				errorLogger('Cannot find latest issues', err);
				return [];
			})
	},

	savePullReqEvent: (pullReqWh: IPullReqWebHook) => {
		var model = new PullReqWHEventModel(pullReqWh);
		model.save();
	},

	findLatestsPullReqs: (username: string, limit?: number) => {
		return PullReqWHEventModel
			.find({ 'repository.owner.login': username })
			.sort({ timestamp: 'desc' })
			.limit(limit || DEFAULT_LIMIT)
			.then((result: Array<IPullReqWebHook>) => {
				return result;
			}).catch((err: Error) => {
				errorLogger('Cannot find latest pullrequests', err);
				return [];
			})
	},

	savePushEvent: (push: ICommitWebhook) => {
		var model = new PushWHEventModel(push);
		model.save();
	},

	findLatestsPushEvents: (username: string, limit?: number) => {
		return PushWHEventModel
			.find({ 'repository.owner.login': username })
			.sort({ timestamp: 'desc' })
			.limit(limit || DEFAULT_LIMIT)
			.then((result: Array<ICommitWebhook>) => {
				return result;
			}).catch((err: Error) => {
				errorLogger('Cannot find latest commit pushes', err);
				return [];
			})
	},
};

export default WebHooksService;
