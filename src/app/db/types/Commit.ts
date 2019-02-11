export interface ICommit {
	sha: string;
	node_id: string;
	commit: CommitContent;
}

export interface CommitContent {
	author: Author;
	committer: Committer;
	message: string;
	tree: Tree;
	url: string;
	comment_count: number;
	verification: Verification;
}

export interface Author {
	name: string;
	email: string;
	date: Date;
}

export interface Committer {
	name: string;
	email: string;
	date: Date;
}

export interface Tree {
	sha: string;
	url: string;
}

export interface Verification {
	verified: boolean;
	reason: string;
	signature: string;
	payload: string;
}
