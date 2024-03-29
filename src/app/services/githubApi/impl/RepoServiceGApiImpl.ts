import { IRepo } from 'git-analyzer-types';
import superagent from 'superagent';
import { errorLogger } from '../../../../logger/Logger';
import { Repo, RepoModel } from '../../../schemas/RepoSchema';
import SyncRepoService from '../../sync/impl/SyncRepoService';
import RepoServiceGApi from '../RepoServiceGApi';

const repoServiceGApi: RepoServiceGApi = {
	getAllRepos: (token: string): Promise<Array<IRepo>> => {
		return getReposPromise(token)
			.then((result: any) => {
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
			.then((result: any) => {
				const repo = createRepo(result.body) as Repo;
				SyncRepoService.sync(repo);
				return repo;
			});
	},
	getReposPaged: (token: string, page, per_page): Promise<Array<IRepo>> => {
		return getReposPromise(token, page, per_page)
			.then((result: any) => {
				return createRepoArray(result.body)
			}).then((repos) => {
				repos.forEach((repo: IRepo) => {
					SyncRepoService.sync(repo as Repo);
				});
				return repos;
			});
	},
	getReposBySearch: async (token: string, search: string, username: string): Promise<Array<IRepo>> => {
		// the getall syncs every repo
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

const getReposPromise = (token: string, page?: number, per_page?: number): Promise<any> => {
	var realPage = page || 0;
	var realPerPage = per_page || 100;
	var query = { page: realPage, per_page: realPerPage };
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
