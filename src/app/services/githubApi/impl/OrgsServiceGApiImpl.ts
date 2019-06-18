import { IOrg, IRepo } from 'git-analyzer-types';
import superagent from 'superagent';
import OrgsServiceGApi from '../OrgsServiceGApi';


const orgService: OrgsServiceGApi = {
	getOwnedOrganizations: (token: string): Promise<Array<IOrg>> => {
		return getOrganizationsPromise(token)
			.then((result) => {
				return result.body;
			});
	},
	getReposOfOrgPaged: (token: string, orgname: string, page: number, per_page: number): Promise<Array<IRepo>> => {
		return getReposOfOrgPromise(token, orgname, page, per_page)
			.then((result) => {
				return result.body;
			});
	},
};

const getOrganizationsPromise = (token: string): Promise<any> => {
	return superagent.get(`https://api.github.com/user/orgs`)
		.set('Accept', 'application/json')
		.set('Authorization', `token ${token}`);
}

const getReposOfOrgPromise = (token: string, orgname: string, page: number, per_page: number): Promise<any> => {
	var query = { page, per_page };
	return superagent.get(`https://api.github.com/orgs/${orgname}/repos`)
		.set('Accept', 'application/json')
		.set('Authorization', `token ${token}`)
		.query(query);
}

export default orgService;
