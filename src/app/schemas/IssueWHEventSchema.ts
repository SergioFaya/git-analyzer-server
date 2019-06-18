import { Iissue, IissueWebHook, IRepo } from 'git-analyzer-types';
import { prop, Typegoose } from 'typegoose';

export class IssueWHEvent extends Typegoose implements IissueWebHook {

	@prop({ required: true })
	public issue?: Iissue;
	@prop({ required: true })
	public timestamp?: number;
	@prop({ required: true })
	public repository?: IRepo;
	@prop({ required: true })
	public action?: string;

	constructor(issue?: Iissue, timestamp?: number, repository?: IRepo, action?: string) {
		super();
		this.issue = issue;
		this.timestamp = timestamp;
		this.repository = repository;
		this.action = action;
	}
}

export const IssueWHEventModel = new IssueWHEvent().getModelForClass(IssueWHEvent);

