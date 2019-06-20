import { ICodeReview } from 'git-analyzer-types';
import { CodeReview } from '../../schemas/CodeReviewSchema';

export default interface CodeReviewService {

	getAllCodeReviewsForUser(username: string): Promise<Array<ICodeReview>>;

	createNewCodeReview(CodeReview: CodeReview): Promise<any>;

	deleteCodeReview(id: number): Promise<any>;

	getCodeReviewsForUserBySearch(username: string, search: string): Promise<Array<ICodeReview>>;
}