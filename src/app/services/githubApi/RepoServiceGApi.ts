import { IDecoratedCommit, IRepo } from 'git-analyzer-types';

/**
 * Defines an interface for a chart service
 */
export default interface RepoService {
	/**
	 * Returns a promise with the repositories of a user
	 * @param token 
	 */
	getAllRepos(token: string): Promise<Array<IRepo>>;
	/**
	 * Returs a promise with a user's repo that matches the reponame
	 * @param token 
	 * @param reponame 
	 */
	getRepoByName(token: string, reponame: string): Promise<IRepo>;
	/**
	 * Returns a promise with the repositories of a user paginated between start and end
	 * @param token 
	 * @param start 
	 * @param end 
	 */
	getReposPaged(token: string, start: number, end: number): Promise<Array<IRepo>>;
	/**
	 * Returns a promise with the repositories of a user that matches a search
	 * @param token 
	 * @param search 
	 * @param username 
	 */
	getReposBySearch(token: string, search: string, username: string): Promise<Array<IRepo>>;
	/**
	 * Returns a promise with the commit that is inside a repository
	 * @param token 
	 * @param reponame 
	 * @param commitSha 
	 */
	getCommitOfRepo(token: string, reponame: string, commitSha: string): Promise<IDecoratedCommit>;
}