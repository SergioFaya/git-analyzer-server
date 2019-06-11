import { Iissue, IUserData } from 'git-analyzer-types';
import { prop, Typegoose } from 'typegoose';

export class Issue extends Typegoose implements Iissue {

	@prop({ index: true, required: true })
	public html_url?: string;
	@prop({ required: true })
	public id?: number;
	@prop({ required: true })
	public node_id?: string;
	@prop({ required: true })
	public number?: number;
	@prop({ required: true })
	public title?: string;
	@prop({ required: true })
	public user?: IUserData;
	@prop({ required: true })
	public labels?: string[];
	@prop({ required: true })
	public state?: string;
	@prop({ required: true })
	public created_at?: string;
	@prop({ required: true })
	public updated_at?: string;
	@prop()
	public body?: string;


	constructor(html_url?: string, id?: number, node_id?: string, number?: number, title?: string,
		user?: IUserData, labels?: string[], state?: string, created_at?: string, updated_at?: string, body?: string) {
		super();
		this.html_url = html_url;
		this.id = id;
		this.node_id = node_id;
		this.number = number;
		this.title = title;
		this.user = user;
		this.labels = labels;
		this.state = state;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.body = body;
	}

}

export const IssueModel = new Issue().getModelForClass(Issue);

