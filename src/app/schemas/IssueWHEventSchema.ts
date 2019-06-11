import { Iissue, IRepo } from 'git-analyzer-types';
import { prop, Typegoose } from 'typegoose';

export class IssueWHEvent extends Typegoose {

	@prop({ required: true })
	public issue?: Iissue;
	@prop({ required: true })
	public timestamp?: number;
	@prop({ required: true })
	public repo?: IRepo;

	constructor(issue?: Iissue, timestamp?: number, repo?: IRepo) {
		super();
		this.issue = issue;
		this.timestamp = timestamp;
		this.repo = repo;
	}
}

export const IssueWHEventModel = new IssueWHEvent().getModelForClass(IssueWHEvent);

