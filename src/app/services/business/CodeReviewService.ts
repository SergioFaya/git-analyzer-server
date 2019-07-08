import { ICodeReview } from 'git-analyzer-types';
import { CodeReview } from '../../schemas/CodeReviewSchema';
/**
 * Defines an interface for the code reviews
 */
export default interface CodeReviewService {
/**
 * Returns a promise with all the code reviews of a user
 * @param username 
 */
	getAllCodeReviewsForUser(username: string): Promise<Array<ICodeReview>>;
	/**
	 * Creates a code review associated to a user
	 * @param CodeReview 
	 */
	createNewCodeReview(CodeReview: CodeReview): Promise<any>;
	/**
	 * Deletes a code review 
	 * @param id 
	 */
	deleteCodeReview(id: number): Promise<any>;
	/**
	 * Returns a promise with all the code reviews of a user that match a search
	 * @param username 
	 * @param search 
	 */
	getCodeReviewsForUserBySearch(username: string, search: string): Promise<Array<ICodeReview>>;
}