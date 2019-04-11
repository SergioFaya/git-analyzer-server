import Repo from '../../models/Repo';

export default interface RepoServiceGApi {
	getAllRepos(token: string): Promise<Array<Repo>>;
	getRepoByName(token: string, reponame: string): Promise<Repo>;
	getReposPaged(token: string, start: number, end: number): Promise<Array<Repo>>;
	getReposPagedBySearch(token: string, start: number, end: number, search: string, username: string): Promise<Array<Repo>>;
}