import superagent from 'superagent';
import Org from '../../../models/Org';
import OrgsServiceGApi from '../OrgsServiceGApi';

const orgService: OrgsServiceGApi = {
	getOrganizationsUserParticipatesIn: (token: string): Promise<Array<Org>> => {
		return getOrganizationsUserParticipatesInPromise(token)
			.then((result) => {
				return result;
			});
	},
	getOwnedOrganizations: (token: string, username: string): Promise<Array<Org>> => {
		return getOwnedOrganizationsPromise(token, username)
			.then((result) => {
				return result;
			});
	},
};

const getOrganizationsUserParticipatesInPromise = (token: string): Promise<any> => {
	return superagent.get(`https://api.github.com/user/orgs`)
		.set('Accept', 'application/json')
		.set('x-access-token', token);
}

const getOwnedOrganizationsPromise = (token: string, username: string): Promise<any> => {
	return superagent.get(`https://api.github.com/users/${username}/orgs`)
		.set('Accept', 'application/json')
		.set('x-access-token', token);
}

export default orgService;
