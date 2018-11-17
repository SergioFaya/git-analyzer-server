import { prop, Typegoose } from 'typegoose';
import {Author, Committer, CommitContent, ICommit, Tree, Verification} from '../Commit';

export class User extends Typegoose implements ICommit {

	@prop()
	public commit: CommitContent;
	@prop()
	// tslint:disable-next-line:variable-name
	public node_id: string;
	@prop()
	public sha: string;

	constructor(commit: CommitContent, nodeId: string, sha: string) {
		super();
		this.commit = commit;
		this.node_id = nodeId;
		this.sha = sha;
	}

}