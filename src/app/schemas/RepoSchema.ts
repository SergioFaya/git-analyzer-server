import { IRepo } from 'git-analyzer-types';
import { Owner } from 'git-analyzer-types/dst/types/IRepo';
import { prop, Typegoose } from 'typegoose';

export class Repo extends Typegoose implements IRepo {


	@prop({ index: true, required: true })
	public id?: number;
	@prop({ required: true })
	public node_id?: string;
	@prop({ required: true })
	public name?: string;
	@prop({ required: true })
	public full_name?: string;
	@prop({ required: true })
	public html_url?: string;
	@prop({ required: false })
	public description?: string;
	@prop({ required: true })
	public url?: string;
	@prop({ required: true })
	public updated_at?: string;
	@prop({ required: true })
	public open_issues?: number;
	@prop()
	public owner?: Owner;



	constructor(id?: number, node_id?: string, name?: string, full_name?: string, html_url?: string,
		description?: string, url?: string, updated_at?: string, open_issues?: number, owner?: Owner) {
		super();
		this.id = id;
		this.node_id = node_id;
		this.name = name;
		this.full_name = full_name;
		this.html_url = html_url;
		this.description = description;
		this.url = url;
		this.updated_at = updated_at;
		this.open_issues = open_issues;
		this.owner = owner;
	}
}

export const RepoModel = new Repo().getModelForClass(Repo);

