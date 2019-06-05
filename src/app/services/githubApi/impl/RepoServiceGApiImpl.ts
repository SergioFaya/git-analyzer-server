import { IRepo } from 'git-analyzer-types';
import superagent from 'superagent';
import { errorLogger } from '../../../../logger/Logger';
import { Repo } from '../../../schemas/RepoSchema';
import SyncRepoService from '../../sync/impl/SyncRepoServiceImpl';
import RepoServiceGApi from '../RepoServiceGApi';

const repoServiceGApi: RepoServiceGApi = {
	getAllRepos: (token: string): Promise<Array<IRepo>> => {
		return getReposPromise(token)
			.catch((err) => {
				errorLogger(`Cannot get repos from user with token ${token}`, err);
				return Error;
			})
			.then((result: any) => createRepoArray(result.body));
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
	getReposPaged: (token, page, per_page): Promise<Array<IRepo>> => {
		return getReposPromise(token, page, per_page)
			.catch((err) => {
				errorLogger(`Cannot get data from user with token ${token}`, err);
				return Error;
			})
			.then((result: any) => createRepoArray(result.body));
	},
	getReposPagedBySearch: (token, page, per_page, search, username): Promise<Array<IRepo>> => {
		// https://api.github.com/search/repositories?q=in:name+user:SergioFaya&page=1&per_page=5
		return getSearchReposPromise(token, String(page), String(per_page), search, username)
			.catch((err) => {
				errorLogger(`Cannot get repos from user with token ${token}`, err);
				return Error;
			})
			.then((result: any) => createRepoArray(result.body.items));


	},
};

const getSearchReposPromise = (token: string, page: string, per_page: string, search: string, username: string): Promise<any> => {
	const searchQuery = `?q=in:name+${search}+user:${username}&page=${page}&per_page=${per_page}`;
	return superagent
		.get(`https://api.github.com/search/repositories${searchQuery}`)
		.set('Authorization', `token ${token}`);
};

const getReposPromise = (token: string, page?: number, per_page?: number): Promise<any> => {
	console.log(token);
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
	const { id,
		node_id,
		name,
		full_name,
		html_url,
		description,
		url,
		forks_url,
		updated_at,
		homepage,
		size,
		has_issues,
		has_wiki,
		forks_count,
		forks,
		open_issues_count,
		open_issues,
		watchers,
	} = obj;

	return {
		id,
		node_id,
		name,
		full_name,
		html_url,
		description,
		url,
		updated_at,
		open_issues,
	};
};

const createRepoArray = (objs: Array<any>): Array<IRepo> => {
	const repos: Array<IRepo> = objs.map((val: any) => {
		return createRepo(val);
	});
	return repos;
};

export default repoServiceGApi as RepoServiceGApi;