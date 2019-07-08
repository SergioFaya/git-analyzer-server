import { IUserChart } from 'git-analyzer-types';

/**
 * Defines an interface for a chart service
 */
export default interface ChartService {
	/**
	 * Returns a promise with the stats of the users that collaborate in the repository
	 * @param token 
	 * @param reponame 
	 */
	getStatsOfUser(token: string, reponame: string): Promise<Array<any>>;
	/**
	 * Returs a prmise with the contributors of a repo
	 * @param token 
	 * @param reponame 
	 */
	getContributorsForRepo(token: string, reponame: string): Promise<Array<IUserChart>>;
}