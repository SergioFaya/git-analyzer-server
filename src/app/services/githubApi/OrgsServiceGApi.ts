import { IOrg, IRepo } from 'git-analyzer-types';

/**
 * Defines an interface for a organization service
 */
export default interface OrgsService {
	/**
	 * Returs a promise with the organizations owned by a user
	 * @param token 
	 */
	getOwnedOrganizations(token: string): Promise<Array<IOrg>>;
	/**
	 * Returns a promise with the paginated repositories owned by a organization
	 * @param token 
	 * @param orgname 
	 * @param page 
	 * @param per_page 
	 */
	getReposOfOrgPaged(token: string, orgname: string, page: number, per_page: number): Promise<Array<IRepo>>;

}


