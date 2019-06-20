import { ICodeReview } from 'git-analyzer-types';
import { errorLogger, infoLogger } from '../../../../logger/Logger';
import { CodeReview, CodeReviewModel } from '../../../schemas/CodeReviewSchema';
import SequenceService from '../../sequences/SequenceServiceImpl';
import CodeReviewService from '../CodeReviewService';

const CodeReviewService: CodeReviewService = {
	getAllCodeReviewsForUser: (username: string): Promise<Array<ICodeReview>> => {
		return CodeReviewModel
			.find({ 'created_by.login': username })
			.then((reviews: Array<CodeReview>) => {
				return reviews;
			})
			.catch((err: Error) => {
				errorLogger('Cannot get all code reviews', err);
				throw err;
			});
	},
	createNewCodeReview: (codeReview: CodeReview) => {
		return SequenceService.getCodeReviewId()
			.then((id: number) => {
				codeReview.id = id;
				codeReview.created_at = Date.now();
			})
			.then(() => {
				var cr = new CodeReviewModel(codeReview);
				cr.save();
			}).catch(() => {
				errorLogger('Cannot save code review ' + codeReview);
			})
	},
	deleteCodeReview: (id: number) => {
		return CodeReviewModel.findOneAndDelete({ id: id })
			.then(() => {
				infoLogger('Deleted review');
			})
			.catch(() => {
				errorLogger('Cannot delete review with id ' + id);
			});
	},
	getCodeReviewsForUserBySearch: (username: string, search: string) => {
		const likeSearch = { $regex: ".*" + search + ".*" };
		const query = {
			title: likeSearch,
			"created_by.login": username
		};
		return CodeReviewModel
			.find(query)
			.then<Array<ICodeReview>>((codeReviews: Array<ICodeReview>) => {
				return codeReviews;
			}).catch(() => {
				return [];
			});
	},
};

export default CodeReviewService;
