import { ICommitWebhook, IissueWebHook, IPullReqWebHook } from 'git-analyzer-types';

/**
 * Defines an interface for the webhooks service
 */
export interface WebHooksService {

	/**
	 * Stores an issue into the database
	 * @param issueWHEvent 
	 */
	saveIssueEvent(issueWHEvent: IissueWebHook): void;
	/**
	 * Returns the latest issues of a user inserted in the database
	 * @param username 
	 * @param limit 
	 */
	findLatestsIssues(username: string, limit?: number): Promise<Array<IissueWebHook>>;
	/**
	 * Stores a pull request into the database
	 * @param pullReq 
	 */
	savePullReqEvent(pullReq: IPullReqWebHook): void;
	/**
	 * Returns the latest pull requests of a user inserted in the database
	 * @param username 
	 * @param limit 
	 */
	findLatestsPullReqs(username: string, limit?: number): Promise<Array<IPullReqWebHook>>;
	/**
	 * Stores a pushed commit into the database 
	 * @param push 
	 */
	savePushEvent(push: ICommitWebhook): void;
	/**
	 * Returns the latest pushed commmits of a user inserted in the database
	 * @param username 
	 * @param limit 
	 */
	findLatestsPushEvents(username: string, limit?: number): Promise<Array<ICommitWebhook>>;
}