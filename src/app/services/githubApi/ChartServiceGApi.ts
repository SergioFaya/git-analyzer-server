
export default interface ChartService {
	getStatsOfUser(token: string, reponame: string): Promise<Array<any>>;
}