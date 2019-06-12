import { errorLogger } from '../../../../logger/Logger';
import { IssueWHEvent, IssueWHEventModel } from '../../../schemas/IssueWHEventSchema';
import { WebHooksService } from '../WebHooksService';

const DEFAULT_LIMIT = 5;
const WebHooksService: WebHooksService = {

	saveIssuesEvent: (issueWHEvent: IssueWHEvent) => {
		var model = new IssueWHEventModel(issueWHEvent);
		model.save();
	},

	findLatestsIssues: (username: string, limit?: number) => {
		return IssueWHEventModel
			.find({ 'repo.owner.login': username })
			.sort({ timestamp: 'desc' })
			.limit(limit || DEFAULT_LIMIT)
			.then((result: Array<IssueWHEvent>) => {
				return result;
			})
			.catch((err: Error) => {
				errorLogger('Cannot findlatest issues', err);
				return [];
			})
	},

	managePullRequestEvent: () => {

	},

	managePushEvent: () => {

	}
};

export default WebHooksService;
