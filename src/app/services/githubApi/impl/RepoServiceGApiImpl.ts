import { IRepo } from 'git-analyzer-types';
import superagent from 'superagent';
import { errorLogger } from '../../../../logger/Logger';
import { Repo, RepoModel } from '../../../schemas/RepoSchema';
import SyncRepoService from '../../sync/impl/SyncRepoService';
import RepoServiceGApi from '../RepoServiceGApi';

const repoServiceGApi: RepoServiceGApi = {
	getAllRepos: (token: string): Promise<Array<IRepo>> => {
		return getReposPromise(token)
			.catch((err) => {
				errorLogger(`Cannot get repos from user with token ${token}`, err);
				return Error;
			}).then((result: any) => {
				return createRepoArray(result.body);
			}).then((repos) => {
				repos.forEach((repo: IRepo) => {
					SyncRepoService.sync(repo as Repo);
				});
				return repos;
			});
	},
	getRepoByName: (token: string, reponame: string): Promise<IRepo> => {
		return getRepoByNamePromise(token, reponame)
			.catch((err: Error) => {
				errorLogger('Cannot get access to the repository', err)
				return null;
			}).then((result: any) => {
				const repo = createRepo(result.body) as Repo;
				SyncRepoService.sync(repo);
				return repo;
			});
	},
	getReposPaged: (token: string, page, per_page): Promise<Array<IRepo>> => {
		return getReposPromise(token, page, per_page)
			.catch((err) => {
				errorLogger(`Cannot get data from user with token ${token}`, err);
				return Error;
			})
			.then((result: any) => {
				return createRepoArray(result.body)
			}).then((repos) => {
				repos.forEach((repo: IRepo) => {
					SyncRepoService.sync(repo as Repo);
				});
				return repos;
			});
	},
	getReposPagedBySearch: async (token: string, search: string, username: string): Promise<Array<IRepo>> => {
		// el getall hace el sync de cada repo
		return await repoServiceGApi.getAllRepos(token)
			.then(async () => {
				const likeSearch = { $regex: ".*" + search + ".*" };
				const query = {
					full_name: likeSearch,
					"owner.login": username
				};
				let repoArray: Array<IRepo> = [];
				await RepoModel.find(query)
					.then((repos: Array<IRepo>) => {
						repoArray = createRepoArray(repos);
					})
				return repoArray;
			}).catch(err => {
				errorLogger("Cannot get all repos for search", err)
				return [];
			});
	},
	getCommitOfRepo: (token: string, reponame: string, commitSha: string) => {
		return getCommitOfRepoPromise(token, reponame, commitSha)
			.then((result) => {
				var commit = result.body;
				return commit;
			}).catch((err: Error) => {
				errorLogger('Cannot get commit of repo', err);
				return {};
			});
	}

};

const getCommitOfRepoPromise = (token: string, reponame: string, commitSha: string) => {
	return superagent
		.get(`https://api.github.com/repos/${reponame}/commits/${commitSha}`)
		.set('Authorization', `token ${token}`);
};

/**
 * Remote search
 * @param token
 * @param page
 * @param per_page
 * @param search
 * @param username
 * @deprecated
 */
const getSearchReposPromise = (token: string, page: string, per_page: string, search: string, username: string): Promise<any> => {
	const searchQuery = `?q=in:name+${search}+user:${username}&page=${page}&per_page=${per_page}`;
	return superagent
		.get(`https://api.github.com/search/repositories${searchQuery}`)
		.set('Authorization', `token ${token}`);
};

const getReposPromise = (token: string, page?: number, per_page?: number): Promise<any> => {
	var query = { page, per_page };
	return superagent
		.get('http://api.github.com/user/repos')
		.query(query)
		.set('Authorization', `token ${token}`);
};

const getRepoByNamePromise = (token: string, reponame: string) => {
	return superagent
		.get(`http://api.github.com/repos/${reponame}`)
		.set('Authorization', `token ${token}`);
};

const createRepo = (obj: any): IRepo => {
	return obj as Repo;
};

const createRepoArray = (objs: Array<any>): Array<IRepo> => {
	const repos: Array<IRepo> = objs.map((val: any) => {
		return createRepo(val);
	});
	return repos;
};

export default repoServiceGApi;