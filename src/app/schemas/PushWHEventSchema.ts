import { ICommitWebhook, IHeadCommit, IPusher, IRepo, IUserData } from 'git-analyzer-types';
import { prop, Typegoose } from 'typegoose';


export class PushWHEvent extends Typegoose implements ICommitWebhook {

	@prop({ required: true })
	public ref?: string;
	@prop({ required: true })
	public head_commit?: IHeadCommit;
	@prop({ required: true })
	public repository?: IUserData;
	@prop({ required: true })
	public pusher?: IPusher;
	@prop({ required: true })
	public timestamp?: number;

	constructor(ref?: string, head_commit?: IHeadCommit, repository?: IRepo, timestamp?: number, pusher?: IPusher) {
		super();
		this.repository = repository;
		this.timestamp = timestamp;
		this.ref = ref;
		this.head_commit = head_commit;
		this.pusher = pusher;
	}
}

export const PushWHEventModel = new PushWHEvent().getModelForClass(PushWHEvent);