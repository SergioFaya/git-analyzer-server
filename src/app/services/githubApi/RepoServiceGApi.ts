import { IDecoratedCommit, IRepo } from 'git-analyzer-types';

export default interface RepoServiceGApi {
	getAllRepos(token: string): Promise<Array<IRepo>>;
	getRepoByName(token: string, reponame: string): Promise<IRepo>;
	getReposPaged(token: string, start: number, end: number): Promise<Array<IRepo>>;
	getReposBySearch(token: string, search: string, username: string): Promise<Array<IRepo>>;
	getCommitOfRepo(token: string, reponame: string, commitSha: string): Promise<IDecoratedCommit>;
}