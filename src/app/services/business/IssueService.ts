import { Issue } from '../../schemas/IssueSchema';

export default interface IssueService {

	getAllIssuesOfUser(username: string): any;

	createNewIssue(issue: Issue): void;

}