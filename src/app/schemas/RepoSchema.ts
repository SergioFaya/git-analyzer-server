import { IRepo } from 'git-analyzer-types';
import { Typegoose } from 'typegoose';


export class Repo extends Typegoose implements IRepo {

	id?: number;
	node_id?: string;
	name?: string;
	full_name?: string;
	html_url?: string;
	description?: string;
	url?: string;
	updated_at?: string;
	open_issues?: number;

	constructor(id?: number, node_id?: string, name?: string, full_name?: string, html_url?: string,
		description?: string, url?: string, updated_at?: string, open_issues?: number) {
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
	}

}

export const RepoModel = new Repo().getModelForClass(Repo);
