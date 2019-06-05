import { IPieChartContributionsVM, IUserChart, IUserRepoStats } from 'git-analyzer-types';
import superagent from 'superagent';
import { errorLogger } from '../../../../logger/Logger';
import ChartService from '../ChartServiceGApi';

const ChartService: ChartService = {
	getStatsOfUser: (token, reponame) => {
		const p1 = getContributorsByRepoName(token, reponame);
		const p2 = getStatsOfRepoAndContributors(token, reponame);
		return Promise.all([p1, p2])
			.then((result) => {
				return popullateStatsChartVM(result[0], result[1]);
			});
	},
};

const getContributorsByRepoNamePromise = (token: string, reponame: string): Promise<any> => {
	return superagent
		.get(`https://api.github.com/repos/${reponame}/contributors`)
		.set('Authorization', `token ${token}`);
};

const getStatsOfRepoAndContributorsPromise = (token: string, reponame: string): Promise<any> => {
	return superagent
		.get(`https://api.github.com/repos/${reponame}/stats/contributors`)
		.set('Authorization', `token ${token}`)
}

const getContributorsByRepoName = (token: string, reponame: string): Promise<Array<IUserChart>> => {
	return getContributorsByRepoNamePromise(token, reponame)
		.catch((err: any) => {
			errorLogger('Cant get access to the repository', err);
			return null;
		})
		.then((result: any) => {
			const contributorsGithub = result.body;
			const contributors: Array<IUserChart> = contributorsGithub.map((x: any) => {
				const user: IUserChart = {
					login: x.login,
					id: x.id,
					avatar_url: x.avatar_url,
					contributions: x.contributions,
					//type: x.type,
					site_admin: x.site_admin,
				};
				return user;
			});
			return contributors;
		});
};

const getStatsOfRepoAndContributors = (token: string, reponame: string): Promise<Array<IUserRepoStats>> => {
	return getStatsOfRepoAndContributorsPromise(token, reponame)
		.catch((err: any) => {
			errorLogger('Cannot get stats', err);
		})
		.then((result: any) => {
			const arr = result.body;
			return arr as Array<IUserRepoStats>;
		});
};

async function popullateStatsChartVM(final: Array<IUserChart>, arr: Array<IUserRepoStats>) {
	const total: Array<IPieChartContributionsVM> = Array<IPieChartContributionsVM>();
	if (arr instanceof Array && final) {
		final.forEach((i: any) => {
			arr.forEach((j: any) => {
				// a -> added c -> commits d -> deleted
				const statsReduced: IUserRepoStats = j.weeks.reduce((anterior: any, actual: any) => {
					return {
						a: anterior.a + actual.a,
						c: anterior.c + actual.c,
						d: anterior.d + actual.d,
					};
				});
				if (i.login === j.author.login) {
					const contribution: IPieChartContributionsVM = {
						avatar_url: i.avatar_url,
						contributions: i.contributions,
						login: i.login,
						modifications: statsReduced,
						total: j.total,
					};
					total.push(contribution);
				}
			});
		});
		return total;
	} else {
		final.forEach((i: any) => {
			if (i.login) {
				const contribution: IPieChartContributionsVM = {
					avatar_url: i.avatar_url,
					contributions: i.contributions,
					login: i.login,
					modifications: {
						a: -1,
						c: -1,
						d: -1,
					},
					total: -1,
				};
				total.push(contribution);
			}

		});
		return total;
	}
}
// more charts
// https://developer.github.com/v3/repos/statistics/#get-the-number-of-additions-and-deletions-per-week

export default ChartService;