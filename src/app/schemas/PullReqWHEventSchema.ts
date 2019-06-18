import { IPullReq, IPullReqWebHook, IRepo } from 'git-analyzer-types';
import { prop, Typegoose } from 'typegoose';


export class PullReqWHEvent extends Typegoose implements IPullReqWebHook {

	@prop({ required: true })
	public pull_request?: IPullReq;
	@prop({ required: true })
	public repository?: IRepo;
	@prop({ required: true })
	public timestamp?: number;
	@prop({ required: true })
	public action?: string;


	constructor(pull_request?: IPullReq, repository?: IRepo, timestamp?: number, action?: string) {
		super();
		this.pull_request = pull_request;
		this.repository = repository;
		this.timestamp = timestamp;
		this.action = action;
	}
}

export const PullReqWHEventModel = new PullReqWHEvent().getModelForClass(PullReqWHEvent);