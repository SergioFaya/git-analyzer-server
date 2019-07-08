/**
 * Defines an interface for the network chart service
 */
export default interface NetworkChartService {
	/**
	 * Returns a promise with the DataStructure containing the nodes and edges that will be represented in the client chart
	 * @param token 
	 * @param username 
	 * @param reponame 
	 */
	getNetworkChartData(token: string, username: string, reponame: string): Promise<Array<any>>;
}