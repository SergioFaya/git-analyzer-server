export default interface NetworkChartService {

	getNetworkChartData(token: string, username: string, reponame: string): Promise<Array<any>>;
}