import { IOrg } from 'git-analyzer-types';

export default interface UserDataService {
	getOrganizationsUserParticipatesIn(token: string, username: string): Promise<Array<IOrg>>;
	getOwnedOrganizations(token: string, username: string): Promise<Array<IOrg>>;
}


