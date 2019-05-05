import Org from '../../models/Org';

export default interface UserDataService {
	getOrganizationsUserParticipatesIn(token: string, username: string): Promise<Array<Org>>;
	getOwnedOrganizations(token: string, username: string): Promise<Array<Org>>;
}


