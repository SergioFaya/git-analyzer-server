
export default interface ChartService {
	// getContributorsByRepoName(token: string, reponame: string): Promise<Array<User>>;
	// getStatsOfRepoAndContributors(token: string, reponame: string): Promise<Array<UserRepoStats>>;
	getStatsOfUser(token: string, reponame: string): Promise<Array<any>>;

	getNetworkChartData(token: string, reponame: string, username: string): Promise<Array<any>>;
}