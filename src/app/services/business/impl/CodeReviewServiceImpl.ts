import { errorLogger } from '../../../../logger/Logger';
import { CodeReview, CodeReviewModel } from '../../../schemas/CodeReviewSchema';
import CodeReviewService from '../CodeReviewService';

const CodeReviewService: CodeReviewService = {
	getAllCodeReviews: async () => {
		var reviews: Array<CodeReview> = [];
		await CodeReviewModel.find((err, res) => {
			if (err) {
				errorLogger('Cannot get all code reviews', err);
				throw err;
			} else {
				reviews = res;
			}
		});
		return reviews;
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