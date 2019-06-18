import { ICommitWebhook, IissueWebHook, IPullReqWebHook } from 'git-analyzer-types';

export interface WebHooksService {

	saveIssueEvent(issueWHEvent: IissueWebHook): void;

	findLatestsIssues(username: string, limit?: number): Promise<Array<IissueWebHook>>;

	savePullReqEvent(pullReq: IPullReqWebHook): void;

	findLatestsPullReqs(username: string, limit?: number): Promise<Array<IPullReqWebHook>>;

	savePushEvent(push: ICommitWebhook): void;

	findLatestsPushEvents(username: string, limit?: number): Promise<Array<ICommitWebhook>>;
}