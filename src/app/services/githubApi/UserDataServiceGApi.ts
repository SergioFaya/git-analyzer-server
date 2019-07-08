import { IUserData } from 'git-analyzer-types';
/**
 * Defines a service to get the user information
 */
export default interface UserDataService {
	/**
	 * Returs a promise with the email of a user
	 * @param token 
	 */
	getUserPrimaryEmailByToken(token: string): Promise<string>;
	/**
	 * Returns a promise with the githubs data of a user
	 * @param token 
	 */
	getUserDataByToken(token: string): Promise<IUserData>;
}
