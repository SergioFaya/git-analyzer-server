import superagent from 'superagent';
import { errorLogger } from '../../../../logger/Logger';
import PieChartContributionsVM from '../../../models/PieChartContributionsVM';
import User from '../../../models/User';
import UserRepoStats from '../../../models/UserRepoStats';
import ChartService from '../ChartServiceGApi';

const ChartService: ChartService = {
	getStatsOfUser: (token, reponame) => {
		const p1 = getContributorsByRepoName(token, reponame);
		const p2 = getStatsOfRepoAndContributors(token, reponame);
		return Promise.all([p1, p2])
			.then((result) => {
				const contributors = result[0];
				const stats = result[1];
				const total: Array<any> = Array<any>();
				popullateStatsChartVM(contributors, stats, total);
				return total;
			});
	}
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

const getContributorsByRepoName = (token: string, reponame: string): Promise<Array<User>> => {
	return getContributorsByRepoNamePromise(token, reponame)
		.catch((err: any) => {
			errorLogger('Cant get access to the repository', err);
			return null;
		})
		.then((result: any) => {
			const contributorsGithub = result.body;
			const contributors: Array<User> = contributorsGithub.map((x: any) => {
				const user: User = {
					login: x.login,
					id: x.id,
					avatar_url: x.avatar_url,
					contributions: x.contributions,
					type: x.type,
					site_admin: x.site_admin,
				};
				return user;
			});
			return contributors;
		});

};
const getStatsOfRepoAndContributors = (token: string, reponame: string): Promise<Array<UserRepoStats>> => {
	return getStatsOfRepoAndContributorsPromise(token, reponame)
		.catch((err: any) => {
			errorLogger('Cannot get stats', err);
		})
		.then((result: any) => {
			const arr = result.body;
			return arr as Array<UserRepoStats>;
		});
};

async function popullateStatsChartVM(final: Array<User>, arr: Array<UserRepoStats>, total: Array<PieChartContributionsVM>) {
	if (arr && final) {
		final.forEach((i: any) => {
			arr.forEach((j: any) => {
				// a -> added c -> commits d -> deleted
				const statsReduced: UserRepoStats = j.weeks.reduce((anterior: any, actual: any) => {
					return {
						a: anterior.a + actual.a,
						c: anterior.c + actual.c,
						d: anterior.d + actual.d,
					};
				});
				if (i.login === j.author.login) {
					const contribution: PieChartContributionsVM = {
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
	}
}

export default ChartService;