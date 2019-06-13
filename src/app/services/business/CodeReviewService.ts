import { ICodeReview } from 'git-analyzer-types';
import { CodeReview } from '../../schemas/CodeReviewSchema';

export default interface CodeReviewService {

	getAllCodeReviewsForUser(username: string): Promise<Array<ICodeReview>>;

	createNewCodeReview(CodeReview: CodeReview): void;

	deleteCodeReview(id: number): void;

	updateCodeReview(id: number): void;
}