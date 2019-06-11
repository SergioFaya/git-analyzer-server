import { errorLogger } from '../../../../logger/Logger';
import { Issue, IssueModel } from '../../../schemas/IssueSchema';
import IssueService from '../IssueService';


const IssueService: IssueService = {
	getAllIssuesOfUser: async (username: string) => {
		var reviews: Array<Issue> = [];
		return await IssueModel.find({ username }, (err, res) => {
			if (err) {
				errorLogger('Cannot get all code reviews', err);
				throw err;
			} else {
				return res;
			}
		});


	},
	updateIssue: (_id: number) => {

	},
	createNewIssue: (issue: Issue): void => {
		var cr = new IssueModel(issue);
		cr.save();
	},
	deleteIssue: (_id: number) => {

	},
};

export default IssueService;