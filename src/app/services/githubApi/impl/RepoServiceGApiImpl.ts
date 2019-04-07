import superagent from 'superagent';
import { errorLogger } from '../../../../logger/Logger';
import Repo from '../../../models/Repo';
import RepoServiceGApi from '../RepoServiceGApi';

const repoServiceGApi: RepoServiceGApi = {
	getAllRepos: (token: string): Promise<Array<Repo>> => {
		return superagent
			.get('http://api.github.com/user/repos')
			.set('Authorization', `token ${token}`)
			.catch((err) => {
				errorLogger(`Cannot get data from user with token ${token}`, err);
				return Error;
			})
			// cast implicito
			.then((result: any) => createRepoArray(result.body));
	},
	getRepoByName: (token: string, reponame: string): Promise<Repo> => {
		return superagent
			.get(`http://api.github.com/repos/${reponame}`)
			.set('Authorization', `token ${token}`)
			.catch((err: Error) => {
				errorLogger('Cannot get access to the repository', err)
				return null;
			}).then((result: any) => {
				return result.body as Repo;
			});
	},
	getReposPaged: (_token, _start, _end): Array<Repo> => {
		// TODO:
		const arr = Array<Repo>();
		return arr;
	},
};

const createRepo = (obj: any): Repo => {
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
	};
};

const createRepoArray = (objs: Array<any>): Array<Repo> => {
	const repos: Array<Repo> = objs.map((val: any) => {
		return createRepo(val);
	});
	return repos;
};

export default repoServiceGApi as RepoServiceGApi;