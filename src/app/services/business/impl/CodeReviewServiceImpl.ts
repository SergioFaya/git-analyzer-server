import { ICodeReview } from 'git-analyzer-types';
import { errorLogger } from '../../../../logger/Logger';
import { CodeReview, CodeReviewModel } from '../../../schemas/CodeReviewSchema';
import CodeReviewService from '../CodeReviewService';

const CodeReviewService: CodeReviewService = {
	getAllCodeReviewsForUser: (username: string): Promise<Array<ICodeReview>> => {
		return CodeReviewModel
			.find({ created_by: username })
			.then((reviews: Array<CodeReview>) => {
				return reviews;
			})
			.catch((err: Error) => {
				errorLogger('Cannot get all code reviews', err);
				throw err;
			});
	},
	updateCodeReview: (_id: number) => {

	},
	createNewCodeReview: (codeReview: CodeReview): void => {
		var cr = new CodeReviewModel(codeReview);
		cr.save();
	},
	deleteCodeReview: (_id: number) => {

	},
};

export default CodeReviewService;