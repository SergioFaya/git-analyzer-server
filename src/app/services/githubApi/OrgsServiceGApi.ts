import { IOrg, IRepo } from 'git-analyzer-types';

export default interface OrgsServiceGApi {
	getOwnedOrganizations(token: string): Promise<Array<IOrg>>;

	getReposOfOrgPaged(token: string, orgname: string, page: number, per_page: number): Promise<Array<IRepo>>;

}


