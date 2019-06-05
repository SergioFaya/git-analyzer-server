import { IUserData } from 'git-analyzer-types';

export default interface UserDataService {
	getUserPrimaryEmailByToken(token: string): Promise<string>;
	getUserDataByToken(token: string): Promise<IUserData>;
}
