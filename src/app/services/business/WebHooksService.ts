import { IssueWHEvent } from '../../schemas/IssueWHEventSchema';

export interface WebHooksService {

	saveIssuesEvent(issueWHEvent: IssueWHEvent): void;

	findLatestsIssues(username: string, limit?: number): Promise<Array<IssueWHEvent>>;

	managePullRequestEvent(): void;

	managePushEvent(): void;
}