import { CodeReview } from '../../schemas/CodeReviewSchema';

export default interface CodeReviewService {

	getAllCodeReviews(): any;

	createNewCodeReview(CodeReview: CodeReview): void;

	deleteCodeReview(id: number): void;

	updateCodeReview(id: number): void;
}