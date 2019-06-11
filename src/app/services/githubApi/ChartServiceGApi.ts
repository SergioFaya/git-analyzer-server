import { IUserChart } from 'git-analyzer-types';

export default interface ChartService {
	getStatsOfUser(token: string, reponame: string): Promise<Array<any>>;
	getContributorsForRepo(token: string, reponame: string): Promise<Array<IUserChart>>;
}